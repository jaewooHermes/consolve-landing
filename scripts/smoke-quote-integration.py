import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path('/workspace')

processes = []

def start(cmd, cwd, env=None, log_name='process.log'):
    log = open(f'/tmp/{log_name}', 'w')
    merged_env = os.environ.copy()
    if env:
        merged_env.update(env)
    proc = subprocess.Popen(cmd, cwd=cwd, env=merged_env, stdout=log, stderr=subprocess.STDOUT, text=True)
    processes.append((proc, log))
    return proc

def stop_all():
    for proc, log in processes:
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=8)
            except subprocess.TimeoutExpired:
                proc.kill()
        log.close()

def wait_url(url, timeout=60):
    deadline = time.time() + timeout
    last = None
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as res:
                return res.read().decode('utf-8')
        except Exception as exc:
            last = exc
            time.sleep(0.5)
    raise RuntimeError(f'timeout waiting for {url}: {last}')

def post_json(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'content-type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode('utf-8'))

try:
    start(
        ['bash', '-lc', '. .venv/bin/activate && PORT=8787 DATA_DIR=/workspace/quote-server/data WIKI_ROOT=/workspace/LLM_WIKI WORKSPACE_ROOT=/workspace python -m quote_server.app'],
        ROOT / 'quote-server',
        log_name='quote-server-smoke.log',
    )
    wait_url('http://127.0.0.1:8787/health', timeout=45)

    start(
        ['npm', 'run', 'start', '--', '-H', '127.0.0.1', '-p', '3000'],
        ROOT / 'consolve-landing',
        env={'QUOTE_API_URL': 'http://127.0.0.1:8787'},
        log_name='consolve-next-smoke.log',
    )
    home = wait_url('http://127.0.0.1:3000', timeout=90)
    response = post_json('http://127.0.0.1:3000/api/quote', {
        'text': '쇼핑몰 홈페이지, 상품 80개, 결제, 카카오 채널, 블로그 SEO 자동화 필요'
    })

    assert 'quote-chat-launcher' in home, 'floating launcher markup missing in rendered home'
    assert response['status'] == 'ok', response
    assert response['estimate']['service_type'] == 'ecommerce_site', response
    assert response['estimate']['range']['min'] > 0, response
    assert '예상 견적' in response['message'], response

    print('home_has_quote_widget', 'quote-chat-launcher' in home)
    print('api_status', response['status'])
    print('service_type', response['estimate']['service_type'])
    print('range_min', response['estimate']['range']['min'])
    print('range_max', response['estimate']['range']['max'])
finally:
    stop_all()

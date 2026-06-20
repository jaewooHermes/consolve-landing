import os, subprocess, sys, time, urllib.request
from pathlib import Path
procs=[]
def start(cmd,cwd,env=None):
    e=os.environ.copy();
    if env: e.update(env)
    p=subprocess.Popen(cmd,cwd=cwd,env=e,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    procs.append(p)
    return p
def wait(url, timeout=90):
    end=time.time()+timeout
    while time.time()<end:
        try:
            urllib.request.urlopen(url, timeout=2).read(); return
        except Exception: time.sleep(.5)
    raise SystemExit(f'timeout {url}')
try:
    start(['bash','-lc','. .venv/bin/activate && PORT=8787 DATA_DIR=/workspace/quote-server/data WIKI_ROOT=/workspace/LLM_WIKI WORKSPACE_ROOT=/workspace python -m quote_server.app'], '/workspace/quote-server')
    wait('http://127.0.0.1:8787/health')
    start(['npm','run','start','--','-H','127.0.0.1','-p','3000'], '/workspace/consolve-landing', {'QUOTE_API_URL':'http://127.0.0.1:8787'})
    wait('http://127.0.0.1:3000')
    print('READY http://127.0.0.1:3000', flush=True)
    while True: time.sleep(1)
finally:
    for p in procs:
        if p.poll() is None: p.terminate()

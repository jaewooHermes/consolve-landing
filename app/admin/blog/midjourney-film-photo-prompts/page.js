export const metadata = {
  title: "블로그 수정 | Consolve Admin",
  robots: { index: false, follow: false },
};

const CURRENT_ARTICLE = {
  slug: "midjourney-film-photo-prompts",
  title: "감성 넘치는 이미지 프롬프트 10선",
  description:
    "90년대 필름, 교외의 무드, 빈티지 인물 사진, 창가 정물 콘셉트를 바로 복사해 사용할 수 있는 미드저니 필름 사진 프롬프트 모음입니다.",
  lead:
    "90년대 필름 사진, 교외의 쓸쓸한 분위기, 빈티지 헤드폰과 워크맨, 흐린 숲과 창가 정물 같은 이미지를 만들기 위한 미드저니용 문장입니다.",
  excerpt:
    "90년대 필름 사진 무드의 미드저니 프롬프트를 바로 복사해 쓸 수 있게 정리했습니다.",
};

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
*{box-sizing:border-box}body{margin:0;font-family:"Pretendard","Noto Sans KR",system-ui,sans-serif;background:#f7f7f8;color:#111114;letter-spacing:-.02em}.wrap{max-width:880px;margin:0 auto;padding:56px 24px 96px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:28px}.badge{display:inline-flex;border:1px solid #dfddff;background:#f0efff;color:#5148df;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:800}h1{font-size:42px;line-height:1.15;letter-spacing:-.055em;margin:12px 0 8px}.muted{color:#666b74;margin:0;line-height:1.7}.card{background:#fff;border:1px solid #ececf0;border-radius:24px;padding:26px;box-shadow:0 16px 54px rgba(0,0,0,.06)}label{display:block;font-weight:800;margin:20px 0 8px}input,textarea{width:100%;border:1px solid #dddfe6;border-radius:16px;padding:14px 16px;font:inherit;line-height:1.5;background:#fff;outline:none}textarea{min-height:120px;resize:vertical}.actions{display:flex;gap:10px;align-items:center;margin-top:24px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;justify-content:center;height:44px;border-radius:999px;padding:0 18px;font-weight:850;border:1px solid #d9dbe3;background:#fff;color:#222;text-decoration:none;cursor:pointer}.btn.primary{border:0;background:#111114;color:#fff}.btn:disabled{opacity:.55;cursor:not-allowed}.status{margin-top:18px;border-radius:16px;padding:14px 16px;display:none;white-space:pre-wrap;line-height:1.6}.status.ok{display:block;background:#effaf3;color:#11632b;border:1px solid #bfebcd}.status.err{display:block;background:#fff0f0;color:#a01818;border:1px solid #f1c5c5}.hint{font-size:13px;color:#7b8088;margin-top:16px;line-height:1.7}.fields{margin-top:24px}.back{color:#5148df;text-decoration:none;font-weight:800}@media(max-width:640px){.top{align-items:flex-start;flex-direction:column}h1{font-size:34px}.card{padding:20px}}
`;

export default function EditPromptArticlePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="wrap">
        <div className="top">
          <div>
            <span className="badge">Admin only</span>
            <h1>블로그 수정</h1>
            <p className="muted">Basic Auth로 보호되는 수정 화면입니다. 저장하면 GitHub main에 커밋되어 Vercel 자동배포가 트리거됩니다.</p>
          </div>
          <a className="back" href="/blog/midjourney-film-photo-prompts">글 보기 →</a>
        </div>

        <section className="card">
          <form id="editForm">
            <input type="hidden" name="slug" defaultValue={CURRENT_ARTICLE.slug} />
            <div className="fields">
              <label htmlFor="title">제목</label>
              <input id="title" name="title" defaultValue={CURRENT_ARTICLE.title} required maxLength={80} />

              <label htmlFor="description">SEO 설명</label>
              <textarea id="description" name="description" defaultValue={CURRENT_ARTICLE.description} required maxLength={220} />

              <label htmlFor="lead">상단 리드 문장</label>
              <textarea id="lead" name="lead" defaultValue={CURRENT_ARTICLE.lead} required maxLength={260} />

              <label htmlFor="excerpt">블로그 목록 요약</label>
              <textarea id="excerpt" name="excerpt" defaultValue={CURRENT_ARTICLE.excerpt} required maxLength={180} />
            </div>

            <div className="actions">
              <button className="btn primary" type="submit">저장하고 배포 요청</button>
              <a className="btn" href="/blog">목록으로</a>
            </div>
            <p className="hint">저장 API는 <code>GITHUB_TOKEN_ORG</code> 또는 <code>GITHUB_TOKEN</code>이 서버 환경에 있어야 동작합니다. 토큰 값은 화면에 표시하지 않습니다.</p>
            <div id="status" className="status" role="status" aria-live="polite" />
          </form>
        </section>
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              const form = document.querySelector('#editForm');
              const status = document.querySelector('#status');
              const button = form?.querySelector('button[type="submit"]');
              if (!form || !status || !button) return;
              form.addEventListener('submit', async (event) => {
                event.preventDefault();
                button.disabled = true;
                status.className = 'status';
                status.textContent = '';
                const payload = Object.fromEntries(new FormData(form).entries());
                try {
                  const response = await fetch('/api/admin/blog/midjourney-film-photo-prompts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  const data = await response.json().catch(() => ({}));
                  if (!response.ok || !data.ok) {
                    throw new Error(data.error || '저장에 실패했습니다.');
                  }
                  status.className = 'status ok';
                  status.textContent = '저장 커밋 완료: ' + data.commit + '\\nVercel 자동배포가 시작됩니다.';
                } catch (error) {
                  status.className = 'status err';
                  status.textContent = error.message || String(error);
                } finally {
                  button.disabled = false;
                }
              });
            })();
          `,
        }}
      />
    </>
  );
}

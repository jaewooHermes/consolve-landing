import { formatDate, listAllPostsForAdmin } from "../../../lib/cms";

export const dynamic = "force-dynamic";
export const metadata = { title: "블로그 관리 | System Web Admin", robots: { index: false, follow: false } };

const css = `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');*{box-sizing:border-box}body{margin:0;font-family:"Pretendard","Noto Sans KR",system-ui,sans-serif;background:#f7f7f8;color:#111114;letter-spacing:-.02em}.wrap{max-width:1040px;margin:0 auto;padding:56px 24px 96px}.badge{display:inline-flex;border:1px solid #dfddff;background:#f0efff;color:#5148df;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:800}h1{font-size:42px;line-height:1.15;letter-spacing:-.055em;margin:12px 0 8px}.muted{color:#666b74;margin:0 0 28px;line-height:1.7}.card{background:#fff;border:1px solid #ececf0;border-radius:24px;padding:26px;box-shadow:0 16px 54px rgba(0,0,0,.06);margin-bottom:24px}.card h2{margin:0 0 16px;font-size:20px}.new-form{display:grid;grid-template-columns:1fr 1fr auto;gap:12px}.new-form input{border:1px solid #dddfe6;border-radius:14px;padding:13px 16px;font:inherit;outline:none}.btn{display:inline-flex;align-items:center;justify-content:center;height:46px;border-radius:999px;padding:0 20px;font-weight:850;border:1px solid #d9dbe3;background:#fff;color:#222;text-decoration:none;cursor:pointer;font-size:14px}.btn.primary{border:0;background:#111114;color:#fff}.btn.sm{height:34px;padding:0 14px;font-size:13px}.btn.danger{color:#a01818;border-color:#f1c5c5}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:13px 10px;text-align:left;border-bottom:1px solid #ececf0;vertical-align:middle}th{font-size:12px;color:#8d8e91;text-transform:uppercase;letter-spacing:.05em}td .title{font-weight:800;color:#111}td .slug{font-size:12px;color:#9a9da5;font-family:Consolas,monospace}.pill{display:inline-flex;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800}.pill.published{background:#effaf3;color:#11632b}.pill.draft{background:#f1f1f3;color:#5a5e66}.pill.review{background:#fff7e8;color:#9a6b00}.pill.archived{background:#fff0f0;color:#a01818}.row-actions{display:flex;gap:6px;justify-content:flex-end}.status-box{margin-top:14px;border-radius:14px;padding:12px 16px;display:none;line-height:1.6;font-size:14px}.status-box.err{display:block;background:#fff0f0;color:#a01818;border:1px solid #f1c5c5}.empty{padding:32px;text-align:center;color:#8d8e91}@media(max-width:760px){.new-form{grid-template-columns:1fr}h1{font-size:32px}.hide-sm{display:none}}`;

function statusPill(status) {
  const cls = ["published", "draft", "review", "archived"].includes(status) ? status : "draft";
  return `<span class="pill ${cls}">${status}</span>`;
}

export default async function AdminBlogListPage() {
  let posts = [];
  let loadError = "";
  try {
    posts = await listAllPostsForAdmin();
  } catch (error) {
    loadError = error.message || "목록을 불러오지 못했습니다.";
  }

  const rows = posts
    .map(
      (post) => `
      <tr data-slug="${post.slug}">
        <td><div class="title">${post.title}</div><div class="slug">${post.slug}</div></td>
        <td>${statusPill(post.status)}</td>
        <td class="hide-sm">${post.category || ""}</td>
        <td class="hide-sm">${formatDate(post.publishedAt)}</td>
        <td class="hide-sm">${post.updatedAt ? formatDate(post.updatedAt) : ""}</td>
        <td><div class="row-actions">
          <a class="btn sm" href="/admin/blog/${encodeURIComponent(post.slug)}">편집</a>
          <a class="btn sm" href="/blog/articles/${encodeURIComponent(post.slug)}" target="_blank" rel="noopener">보기</a>
          <button class="btn sm danger" type="button" data-delete="${post.slug}">삭제</button>
        </div></td>
      </tr>`
    )
    .join("");

  const tableHtml = posts.length
    ? `<table><thead><tr><th>글</th><th>상태</th><th class="hide-sm">카테고리</th><th class="hide-sm">발행일</th><th class="hide-sm">수정일</th><th></th></tr></thead><tbody>${rows}</tbody></table>`
    : `<div class="empty">아직 글이 없습니다. 위에서 첫 글을 만들어 보세요.</div>`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="wrap">
        <span className="badge">System Web Admin</span>
        <h1>블로그 관리</h1>
        <p className="muted">글 작성·수정·발행을 여기서 관리합니다. 발행(published) 상태의 글만 /blog에 노출됩니다.</p>

        <section className="card">
          <h2>새 글 만들기</h2>
          <div className="new-form">
            <input id="newTitle" placeholder="제목 (예: 카페24 운영 체크리스트)" maxLength={160} />
            <input id="newSlug" placeholder="slug (예: cafe24-operation-checklist)" maxLength={160} />
            <button className="btn primary" id="createBtn" type="button">초안 만들기</button>
          </div>
          <div id="statusBox" className="status-box" role="status" aria-live="polite">{loadError}</div>
        </section>

        <section className="card">
          <h2>글 목록 ({posts.length})</h2>
          <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
        </section>
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
  const ready = (fn) => { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true }); else fn(); };
  ready(() => {
    const statusBox = document.querySelector('#statusBox');
    const showError = (message) => { if (statusBox) { statusBox.className = 'status-box err'; statusBox.textContent = message; } };
    const slugify = (value) => value.trim().toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const titleInput = document.querySelector('#newTitle');
    const slugInput = document.querySelector('#newSlug');
    const createBtn = document.querySelector('#createBtn');

    createBtn?.addEventListener('click', async () => {
      const title = titleInput?.value.trim() || '';
      const slug = slugify(slugInput?.value || '');
      if (!slug || slug.length < 3) { showError('slug는 영문 소문자·숫자·하이픈 3자 이상으로 입력해 주세요.'); slugInput?.focus(); return; }
      createBtn.disabled = true; createBtn.textContent = '만드는 중...';
      try {
        const response = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ slug, title }) });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || ('생성 실패: HTTP ' + response.status));
        location.href = '/admin/blog/' + encodeURIComponent(data.slug);
      } catch (error) {
        showError(error.message || String(error));
        createBtn.disabled = false; createBtn.textContent = '초안 만들기';
      }
    });

    document.querySelectorAll('[data-delete]').forEach((button) => {
      button.addEventListener('click', async () => {
        const slug = button.getAttribute('data-delete');
        if (!confirm('"' + slug + '" 글을 삭제할까요? 마지막 내용은 리비전에 백업됩니다.')) return;
        button.disabled = true;
        try {
          const response = await fetch('/api/admin/blog/' + encodeURIComponent(slug), { method: 'DELETE', credentials: 'same-origin' });
          const data = await response.json();
          if (!response.ok || !data.ok) throw new Error(data.error || ('삭제 실패: HTTP ' + response.status));
          document.querySelector('tr[data-slug="' + slug + '"]')?.remove();
        } catch (error) {
          showError(error.message || String(error));
          button.disabled = false;
        }
      });
    });
  });
})();`,
        }}
      />
    </>
  );
}

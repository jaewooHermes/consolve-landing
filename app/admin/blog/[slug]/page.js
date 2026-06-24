import { getPostBySlugForAdmin } from "../../../../lib/cms";

export const dynamic = "force-dynamic";
export const metadata = { title: "블로그 수정 | Consolve Admin", robots: { index: false, follow: false } };

const css = `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');*{box-sizing:border-box}body{margin:0;font-family:"Pretendard","Noto Sans KR",system-ui,sans-serif;background:#f7f7f8;color:#111114;letter-spacing:-.02em}.wrap{max-width:1040px;margin:0 auto;padding:56px 24px 96px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:28px}.badge{display:inline-flex;border:1px solid #dfddff;background:#f0efff;color:#5148df;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:800}h1{font-size:42px;line-height:1.15;letter-spacing:-.055em;margin:12px 0 8px}.muted{color:#666b74;margin:0;line-height:1.7}.card{background:#fff;border:1px solid #ececf0;border-radius:24px;padding:26px;box-shadow:0 16px 54px rgba(0,0,0,.06)}label{display:block;font-weight:800;margin:20px 0 8px}input,textarea,select{width:100%;border:1px solid #dddfe6;border-radius:16px;padding:14px 16px;font:inherit;line-height:1.5;background:#fff;outline:none}textarea{min-height:100px;resize:vertical}.json-editor{min-height:680px;font-family:"SFMono-Regular",Consolas,monospace;font-size:13px;line-height:1.6;white-space:pre}.actions{display:flex;gap:10px;align-items:center;margin-top:24px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;justify-content:center;height:44px;border-radius:999px;padding:0 18px;font-weight:850;border:1px solid #d9dbe3;background:#fff;color:#222;text-decoration:none;cursor:pointer}.btn.primary{border:0;background:#111114;color:#fff}.btn:disabled{opacity:.55;cursor:not-allowed}.status{margin-top:18px;border-radius:16px;padding:14px 16px;display:none;white-space:pre-wrap;line-height:1.6}.status.ok{display:block;background:#effaf3;color:#11632b;border:1px solid #bfebcd}.status.err{display:block;background:#fff0f0;color:#a01818;border:1px solid #f1c5c5}.hint{font-size:13px;color:#7b8088;margin-top:16px;line-height:1.7}.fields{margin-top:24px}.back{color:#5148df;text-decoration:none;font-weight:800}.quick{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:800px){.top{display:block}.quick{grid-template-columns:1fr}h1{font-size:34px}}`;

function emptyPost(slug) {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    slug,
    status: "draft",
    type: "article",
    category: "insight",
    title: "새 블로그 글",
    excerpt: "요약을 입력하세요.",
    seoDescription: "SEO 설명을 입력하세요.",
    author: "Consolve",
    publishedAt: null,
    updatedAt: now,
    hero: { kind: "gradient", alt: "블로그 대표 이미지" },
    content: { blocks: [{ type: "paragraph", text: "본문을 입력하세요." }] },
  };
}

export default async function EditBlogPostPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const post = (await getPostBySlugForAdmin(slug)) || emptyPost(slug);
  const postJson = JSON.stringify(post, null, 2);
  const initialAlert = query?.saved
    ? "DB 저장 완료"
    : query?.error
      ? `저장 실패: ${query.error}`
      : "";
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="wrap">
        <div className="top"><div><span className="badge">Admin only · DB JSON</span><h1>블로그 JSON 수정</h1><p className="muted">모든 블로그 콘텐츠는 DB posts.payload JSON으로 저장됩니다. 저장하면 GitHub 커밋 없이 DB에 즉시 반영됩니다.</p></div><a className="back" href={slug === "midjourney-film-photo-prompts" ? "/blog/midjourney-film-photo-prompts" : `/blog/articles/${slug}`}>글 보기 →</a></div>
        <section className="card"><form id="editForm" method="post" noValidate action={`/api/admin/blog/${encodeURIComponent(slug)}`}><div className="fields">
          <div className="quick"><div><label htmlFor="title">제목</label><input id="title" name="title" defaultValue={post.title} required maxLength={160} /></div><div><label htmlFor="status">상태</label><select id="status" name="status" defaultValue={post.status || "draft"}><option value="draft">draft</option><option value="review">review</option><option value="published">published</option><option value="archived">archived</option></select></div></div>
          <div className="quick"><div><label htmlFor="category">카테고리</label><input id="category" name="category" defaultValue={post.category || "insight"} maxLength={80} /></div><div><label htmlFor="author">작성자</label><input id="author" name="author" defaultValue={post.author || "Consolve"} maxLength={80} /></div></div>
          <label htmlFor="excerpt">블로그 목록 요약</label><textarea id="excerpt" name="excerpt" defaultValue={post.excerpt || ""} required maxLength={500} />
          <label htmlFor="lead">상세 상단 리드 문구</label><textarea id="lead" name="lead" defaultValue={post.lead || post.excerpt || ""} required maxLength={700} />
          <label htmlFor="description">SEO 설명</label><textarea id="description" name="description" defaultValue={post.seoDescription || post.metaDescription || post.excerpt || ""} required maxLength={500} />
          <label htmlFor="contentJson">전체 DB payload JSON</label><textarea id="contentJson" name="contentJson" className="json-editor" defaultValue={postJson} spellCheck={false} required />
        </div><div className="actions"><button className="btn primary" type="button" id="saveButton">DB에 저장</button><button className="btn" type="button" id="syncQuick">빠른 필드 → JSON 반영</button><a className="btn" href="/blog">목록으로</a></div><p className="hint">권장 구조는 content.blocks 배열입니다. HTML은 직접 넣지 말고 paragraph, heading, image, table, list, promptGrid 같은 block type을 사용하세요. 저장 시 이전 payload는 post_revisions에 백업됩니다.</p><div id="statusBox" className="status" role="status" aria-live="polite" /></form></section>
      </main>
      <script dangerouslySetInnerHTML={{ __html: `(() => { const slug=${JSON.stringify(slug)}; const initialAlert=${JSON.stringify(initialAlert)}; const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }; ready(()=>{ const form=document.querySelector('#editForm'); const statusBox=document.querySelector('#statusBox'); const button=document.querySelector('#saveButton'); const syncButton=document.querySelector('#syncQuick'); const contentJson=document.querySelector('#contentJson'); const nl=String.fromCharCode(10); const setStatus=(type,message)=>{ if(!statusBox) return; statusBox.className='status '+type; statusBox.textContent=message; }; const field=(id)=>document.querySelector('#'+id); const applyQuickFields=()=>{ if(!contentJson) throw new Error('JSON 입력칸을 찾지 못했습니다. 페이지를 새로고침해 주세요.'); const post=JSON.parse(contentJson.value); post.slug=slug; post.title=field('title')?.value.trim()||post.title||''; post.status=field('status')?.value||post.status||'draft'; post.category=field('category')?.value.trim()||post.category||'insight'; post.author=field('author')?.value.trim()||post.author||'Consolve'; post.excerpt=field('excerpt')?.value.trim()||post.excerpt||''; post.lead=field('lead')?.value.trim()||post.lead||post.excerpt; post.seoDescription=field('description')?.value.trim()||post.seoDescription||post.metaDescription||post.excerpt; if(post.status==='published'&&!post.publishedAt) post.publishedAt=new Date().toISOString(); contentJson.value=JSON.stringify(post,null,2); return post; }; const save=async(event)=>{ event?.preventDefault?.(); event?.stopPropagation?.(); if(!button) return; button.disabled=true; button.textContent='저장 중...'; setStatus('ok','DB 저장 중입니다...'); try{ const payload=applyQuickFields(); const response=await fetch('/api/admin/blog/'+encodeURIComponent(slug),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify({payload})}); const text=await response.text(); let data={}; try{ data=text?JSON.parse(text):{}; }catch{ throw new Error('저장 API가 JSON이 아닌 응답을 반환했습니다: '+text.slice(0,160)); } if(!response.ok||!data.ok) throw new Error(data.error||('저장에 실패했습니다. HTTP '+response.status)); setStatus('ok',['DB 저장 완료','slug: '+data.slug,'updatedAt: '+data.updatedAt].join(nl)); alert('DB 저장 완료'); }catch(error){ const message=error.message||String(error); setStatus('err','저장 실패: '+message); alert('저장 실패: '+message); }finally{ button.disabled=false; button.textContent='DB에 저장'; } }; if(initialAlert) alert(initialAlert); if(!form||!statusBox||!button||!contentJson){ alert('저장 UI 초기화 실패: 페이지를 새로고침해 주세요.'); return; } syncButton?.addEventListener('click',(event)=>{ event.preventDefault(); try{ applyQuickFields(); setStatus('ok','빠른 필드를 JSON에 반영했습니다.'); }catch(error){ setStatus('err','JSON 형식 오류: '+error.message); } }); button.addEventListener('click',save); form.addEventListener('submit',save); }); })();` }} />
    </>
  );
}

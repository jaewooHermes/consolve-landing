import { persistPipelineResult, runConsolveContentPipeline } from "../../../../lib/content-pipeline";

function boolValue(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).toLowerCase();
  if (["1", "true", "yes", "publish", "published", "발행"].includes(normalized)) return true;
  if (["0", "false", "no", "draft", "초안"].includes(normalized)) return false;
  return fallback;
}

function resultHtml(result, persistence) {
  const escaped = JSON.stringify({ ...result, persistence }, null, 2)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Pipeline Result</title><style>body{font-family:ui-sans-serif,system-ui;background:#111;color:#f5f5f0;padding:32px;line-height:1.6}a{color:#b8c7ff}pre{white-space:pre-wrap;background:#1f1f1f;border:1px solid #333;border-radius:16px;padding:20px;overflow:auto}</style></head><body><h1>콘텐츠 파이프라인 실행 결과</h1><p><a href="/admin">← admin으로 돌아가기</a></p><pre>${escaped}</pre></body></html>`;
}

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  let input = {};

  if (contentType.includes("application/json")) {
    input = await request.json();
  } else {
    const form = await request.formData();
    input = Object.fromEntries(form.entries());
  }

  try {
    const result = runConsolveContentPipeline({
      keyword: input.keyword,
      projectName: input.projectName || input.project_name || "consolve",
      publish: boolValue(input.publish, false),
      source: input.source || "admin.consolve.kr",
    });

    let persistence;
    try {
      persistence = boolValue(input.persist, true) ? persistPipelineResult(result) : { ok: false, skipped: true, reason: "persist=false" };
    } catch (error) {
      persistence = { ok: false, skipped: true, reason: String(error && error.message ? error.message : error) };
    }

    if (contentType.includes("application/json")) {
      return Response.json({ ...result, persistence });
    }

    return new Response(resultHtml(result, persistence), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    const payload = { ok: false, error: String(error && error.message ? error.message : error) };
    if (contentType.includes("application/json")) return Response.json(payload, { status: 400 });
    return new Response(resultHtml(payload, { ok: false }), { status: 400, headers: { "content-type": "text/html; charset=utf-8" } });
  }
}

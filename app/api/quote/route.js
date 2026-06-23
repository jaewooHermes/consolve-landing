import { NextResponse } from "next/server";

const DEFAULT_TIMEOUT_MS = 8000;
const ALLOWED_KEYS = new Set([
  "text",
  "service_type",
  "features",
  "features_confirmed",
  "design_status",
  "backend_need",
  "quantity",
  "pages",
  "timeline_weeks",
  "customer",
  "conversationId",
  "conversation_id",
  "messages",
]);

function json(payload, status = 200) {
  return NextResponse.json(payload, { status });
}

function sanitizeBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "요청 형식이 올바르지 않습니다." };
  }

  const clean = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    clean[key] = value;
  }

  if (typeof clean.text === "string") {
    clean.text = clean.text.trim().slice(0, 1000);
  }

  if (!clean.text && !clean.service_type) {
    return { error: "견적 요청 내용을 입력해 주세요." };
  }

  return { clean };
}

function normalizeQuoteResponse(upstream) {
  if (upstream?.status === "needs_more_info") {
    return {
      status: "needs_more_info",
      known: upstream.known || {},
      missing: upstream.missing || [],
      currentMissingField: upstream.currentMissingField || null,
      question: upstream.question || "",
      questions: upstream.questions || [],
      conversation: upstream.conversation || null,
      message: upstream.answer || upstream?.discord?.content || "정확한 견적을 위해 추가 정보가 필요합니다.",
      source: "quote-server",
    };
  }

  const estimate = upstream?.estimate ?? upstream;
  const message =
    upstream?.answer ||
    estimate?.discord?.content ||
    upstream?.message ||
    "예상 견적을 계산했습니다.";

  return {
    status: "ok",
    estimate,
    message,
    conversation: upstream?.conversation || null,
    source: "quote-server",
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ status: "bad_request", message: "JSON 요청만 지원합니다." }, 400);
  }

  const { clean, error } = sanitizeBody(body);
  if (error) return json({ status: "bad_request", message: error }, 400);

  const quoteApiUrl = process.env.QUOTE_API_URL;
  if (!quoteApiUrl) {
    return json(
      {
        status: "quote_unavailable",
        message: "자동 견적 서버 연결이 준비되지 않았습니다.",
        retryable: true,
      },
      502
    );
  }

  const timeoutMs = Number(process.env.QUOTE_API_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const token = process.env.QUOTE_API_TOKEN;
  const endpoint = `${quoteApiUrl.replace(/\/$/, "")}/quote`;

  try {
    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(clean),
      signal: AbortSignal.timeout(Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_TIMEOUT_MS),
      cache: "no-store",
    });

    const upstream = await upstreamResponse.json().catch(() => ({}));

    if (!upstreamResponse.ok) {
      return json(
        {
          status: "quote_unavailable",
          message: upstream?.message || "자동 견적 서버가 응답하지 않았습니다.",
          retryable: true,
        },
        502
      );
    }

    return json(normalizeQuoteResponse(upstream));
  } catch {
    return json(
      {
        status: "quote_unavailable",
        message: "자동 견적 서버 연결이 준비되지 않았습니다.",
        retryable: true,
      },
      502
    );
  }
}

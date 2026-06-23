"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { trackConsultationCta } from "./consultationAnalytics";

const PRESETS = {
  landing_page: "랜딩페이지 제작 견적 요청. 업종은 아직 정리 중이고, 문의 연결과 기본 SEO가 필요합니다.",
  business_website: "회사/서비스 홈페이지 제작 견적 요청. 필요한 페이지는 소개, 서비스, 사례, 문의입니다.",
  ecommerce_site: "쇼핑몰/자사몰 제작 견적 요청. 상품 수와 결제 방식, 카카오 채널 연결이 필요합니다.",
  custom: "맞춤 플랫폼/MVP 제작 견적 요청. 필요한 핵심 기능과 일정 범위를 상담하고 싶습니다.",
};

const QUICK_TEXTS = [
  "상담 가능 범위 확인",
  "쇼핑몰/자사몰 견적",
  "홈페이지 제작 견적",
];

function formatWon(value) {
  if (typeof value !== "number") return "-";
  return `${value.toLocaleString("ko-KR")}원`;
}

function serviceLabel(serviceType) {
  const labels = {
    landing_page: "랜딩페이지",
    business_website: "회사/서비스 홈페이지",
    ecommerce_site: "쇼핑몰/자사몰",
    blog_seo_automation: "블로그 SEO 자동화",
    ai_chatbot: "AI 상담/챗봇",
    quote_automation: "견적 자동화",
  };
  return labels[serviceType] || serviceType || "웹 제작";
}

export default function QuoteChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [conversationId] = useState(() => `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [conversationMessages, setConversationMessages] = useState([]);

  const placeholder = useMemo(
    () => "예: 쇼핑몰 홈페이지, 상품 80개, 결제, 카카오 채널 필요",
    []
  );

  const requestQuote = useCallback(async (rawText) => {
    const requestText = rawText.trim();
    if (!requestText) {
      setError("만들 사이트나 필요한 기능을 한 줄로 적어주세요.");
      setStatus("idle");
      return;
    }

    setText(requestText);
    setOpen(true);
    setStatus("loading");
    setError("");
    setResult(null);
    setConversationMessages((messages) => [...messages, { role: "user", content: requestText }]);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: requestText, conversationId }),
      });
      const data = await response.json();
      if (!response.ok || !["ok", "needs_more_info"].includes(data.status)) {
        throw new Error(data.message || "견적 서버 연결에 실패했습니다.");
      }
      setResult(data);
      if (data.conversation?.messages?.length) {
        setConversationMessages(data.conversation.messages);
      } else {
        setConversationMessages((messages) => [...messages, { role: "assistant", content: data.message || "견적 정보를 확인했습니다." }]);
      }
      setText("");
      setStatus("success");
    } catch (err) {
      setError(err.message || "지금 자동 견적 서버 연결이 준비되지 않았습니다.");
      setStatus("error");
    }
  }, [conversationId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quotePreset = params.get("quote");
    if (quotePreset && PRESETS[quotePreset]) {
      setText(PRESETS[quotePreset]);
      setOpen(true);
    }

    if (window.location.hash === "#quote") setOpen(true);

    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href*="#quote"]');
      if (!anchor) return;
      setOpen(true);
    };

    const onSubmit = (event) => {
      const form = event.target.closest?.("form.search-cta");
      if (!form) return;
      event.preventDefault();
      const input = form.querySelector("input, textarea");
      requestQuote(input?.value || "");
    };

    const onHashChange = () => {
      if (window.location.hash === "#quote") setOpen(true);
    };

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, [requestQuote]);

  const submitQuote = async (event) => {
    event?.preventDefault();
    if (event?.currentTarget) {
      trackConsultationCta(event.currentTarget, {
        cta_location: "quote_widget_submit",
        cta_text: "quote_widget_submit",
        form_value_present: Boolean(text.trim()),
      });
    }
    await requestQuote(text);
  };

  const estimate = result?.estimate;
  const range = estimate?.range;
  const nextQuestions = estimate?.nextQuestions || estimate?.next_questions || result?.questions || [];
  const lineItems = estimate?.lineItems || estimate?.line_items || [];

  return (
    <div className="quote-chat-root" aria-live="polite">
      {open && (
        <section className="quote-chat-panel" role="dialog" aria-label="5분 견적 상담 채팅창">
          <header className="quote-chat-head">
            <button className="quote-back" type="button" onClick={() => setOpen(false)} aria-label="채팅창 닫기">‹</button>
            <div className="quote-agent-mark" aria-hidden="true">S</div>
            <div>
              <strong>System Web 견적봇</strong>
              <span>보통 1분 안에 1차 범위를 계산해요</span>
            </div>
          </header>

          <div className="quote-chat-body">
            <div className="quote-intro">
              <h3>웹사이트·자사몰 1차 견적을 바로 확인해보세요 💬</h3>
              <p>필요한 작업을 한 줄로 남겨주시면 예상 금액, 산정 항목, 확인 질문을 정리해드립니다.</p>
              <p className="quote-hours"><b>운영 안내</b><br />AI 1차 견적: 즉시 · 상세 견적: 직접 검토 후 발송</p>
              <div className="quote-action-row">
                {QUICK_TEXTS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="quote-quick"
                    data-ga-location={`quote_widget_quick_${label}`}
                    data-ga-text={label}
                    onClick={(event) => {
                      trackConsultationCta(event.currentTarget);
                      setText(label === "상담 가능 범위 확인" ? PRESETS.business_website : label);
                      setOpen(true);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="quote-bubbles" aria-label="추천 질문">
              <button type="button" data-ga-location="quote_widget_bubble_ecommerce" data-ga-text="쇼핑몰 견적은 어떻게 잡히나요?" onClick={(event) => { trackConsultationCta(event.currentTarget); setText(PRESETS.ecommerce_site); }}>쇼핑몰 견적은 어떻게 잡히나요?</button>
              <button type="button" data-ga-location="quote_widget_bubble_landing" data-ga-text="랜딩페이지는 얼마부터 가능한가요?" onClick={(event) => { trackConsultationCta(event.currentTarget); setText(PRESETS.landing_page); }}>랜딩페이지는 얼마부터 가능한가요?</button>
            </div>

            {conversationMessages.length > 0 && (
              <div className="quote-transcript" aria-label="견적 상담 대화 기록">
                {conversationMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.createdAt || "local"}`}
                    className={`quote-message quote-message-${message.role === "assistant" ? "assistant" : "user"}`}
                  >
                    <span>{message.role === "assistant" ? "AI" : "나"}</span>
                    <p>{message.content}</p>
                  </div>
                ))}
                {status === "loading" && (
                  <div className="quote-message quote-message-assistant is-typing">
                    <span>AI</span>
                    <p>답변을 정리하고 있어요…</p>
                  </div>
                )}
              </div>
            )}

            {status === "success" && result?.status === "needs_more_info" && (
              <article className="quote-result-card quote-progress-card">
                <span className="quote-result-kicker">다음 확인 항목</span>
                <h4>{result.currentMissingField || "추가 정보"}</h4>
                <small>위 대화 기록처럼 AI 질문에 답변하면 다음 미충족 항목으로 넘어갑니다.</small>
              </article>
            )}

            {status === "success" && result?.status === "ok" && estimate && (
              <article className="quote-result-card">
                <span className="quote-result-kicker">예상 견적</span>
                <h4>{range ? `${formatWon(range.min)} ~ ${formatWon(range.max)}` : "견적 산정 완료"}</h4>
                <p>{serviceLabel(estimate.service_type)} 기준의 1차 예상 범위입니다.</p>
                {lineItems.length > 0 && (
                  <ul>
                    {lineItems.slice(0, 4).map((item, index) => (
                      <li key={`${item.label || item.name}-${index}`}>{item.label || item.name || "산정 항목"}</li>
                    ))}
                  </ul>
                )}
                {nextQuestions.length > 0 && (
                  <div className="quote-next">
                    <b>다음 확인 질문</b>
                    <span>{nextQuestions.slice(0, 2).join(" · ")}</span>
                  </div>
                )}
                <small>최종 견적은 상세 범위 확인 후 확정됩니다.</small>
              </article>
            )}

            {status === "error" && <div className="quote-error">{error}</div>}
          </div>

          <form className="quote-chat-input" onSubmit={submitQuote}>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholder}
              rows={2}
              aria-label="견적 요청 내용"
            />
            <div className="quote-input-tools" aria-hidden="true">⌕ ☺</div>
            <button type="submit" disabled={status === "loading"} aria-label="견적 요청 보내기">
              {status === "loading" ? "…" : "↑"}
            </button>
          </form>
          <p className="quote-disclaimer">AI는 한정된 데이터에 기반하니, 중요한 정보는 추가 확인을 권장해요.</p>
        </section>
      )}

      <button
        className={`quote-chat-launcher${open ? " is-open" : ""}`}
        type="button"
        aria-label={open ? "견적 채팅창 닫기" : "견적 채팅창 열기"}
        aria-expanded={open}
        onClick={(event) => {
          trackConsultationCta(event.currentTarget, {
            cta_location: open ? "quote_widget_close" : "quote_widget_open",
            cta_text: open ? "견적 채팅창 닫기" : "견적 채팅창 열기",
          });
          setOpen((value) => !value);
        }}
      >
        {open ? "×" : <span>💬</span>}
      </button>

      <style jsx global>{`
        .quote-chat-root{position:fixed;right:30px;bottom:24px;z-index:80;font-family:"Pretendard","Inter","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#17171a}
        .quote-chat-launcher{position:fixed;right:30px;bottom:22px;width:58px;height:58px;border:0;border-radius:50%;background:#111114;color:#fff;display:grid;place-items:center;font-size:24px;box-shadow:0 16px 38px rgba(0,0,0,.20);cursor:pointer;transition:transform .18s ease,background .18s ease,box-shadow .18s ease}
        .quote-chat-launcher:hover{transform:translateY(-2px);box-shadow:0 20px 48px rgba(0,0,0,.24)}
        .quote-chat-launcher.is-open{background:#fff;color:#5d6068;border:1px solid #e7e7eb;font-size:36px;box-shadow:0 12px 34px rgba(0,0,0,.16)}
        .quote-chat-panel{position:fixed;right:40px;bottom:96px;width:min(430px,calc(100vw - 32px));height:min(730px,calc(100vh - 126px));background:#fff;border:1px solid #e7e7eb;border-radius:28px;box-shadow:0 28px 90px rgba(16,18,24,.22);overflow:hidden;display:flex;flex-direction:column;animation:quote-pop .22s cubic-bezier(.2,.8,.2,1);isolation:isolate}
        @keyframes quote-pop{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
        .quote-chat-head{display:flex;align-items:center;gap:10px;padding:18px 20px 12px;background:rgba(255,255,255,.92);border-bottom:1px solid rgba(237,237,241,.72)}
        .quote-back{border:0;background:transparent;color:#5e56f0;font-size:28px;line-height:1;cursor:pointer;padding:2px 4px}
        .quote-agent-mark{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#ffe1ef 0 16%,#a58cff 17% 46%,#5e56f0 47% 100%);color:#fff;font-size:12px;font-weight:800}
        .quote-chat-head strong{display:block;font-size:15px;font-weight:800;letter-spacing:-.02em}.quote-chat-head span{display:block;margin-top:2px;color:#8d9098;font-size:12px}
        .quote-chat-body{flex:1;overflow:auto;padding:22px 20px 16px;background:linear-gradient(180deg,#fff 0%,#fff 68%,#fafafa 100%)}
        .quote-intro h3{margin:0 0 12px;font-size:18px;line-height:1.45;font-weight:800;letter-spacing:-.035em;color:#111114}.quote-intro p{margin:0 0 14px;font-size:14px;line-height:1.72;color:#333740}.quote-hours{background:#fafafa;border:1px solid #ededf1;border-radius:16px;padding:12px 14px}.quote-hours b{color:#111114}.quote-action-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 24px}.quote-quick{border:0;border-radius:10px;background:#eef6ff;color:#2776d8;font-size:13px;font-weight:700;padding:10px 12px;cursor:pointer}.quote-quick:nth-child(2){background:#edfaef;color:#1a9b4a}.quote-quick:nth-child(3){background:#f7f4ff;color:#5e56f0}
        .quote-bubbles{display:flex;flex-direction:column;align-items:flex-end;gap:8px;margin:16px 0 18px}.quote-bubbles button{max-width:86%;border:1px solid #ececf0;background:#fff;border-radius:18px;padding:11px 15px;font-size:14px;color:#444852;box-shadow:0 3px 10px rgba(0,0,0,.03);cursor:pointer;text-align:left}.quote-bubbles button:hover{border-color:#d9d7fb;color:#4d46d6}
        .quote-transcript{display:flex;flex-direction:column;gap:10px;margin:14px 0 16px}.quote-message{display:flex;flex-direction:column;gap:4px;max-width:88%}.quote-message span{font-size:11px;font-weight:800;color:#9a9da5}.quote-message p{margin:0;white-space:pre-wrap;font-size:14px;line-height:1.65;border-radius:18px;padding:11px 14px;box-shadow:0 4px 14px rgba(0,0,0,.04)}.quote-message-user{align-self:flex-end;align-items:flex-end}.quote-message-user p{background:#111114;color:#fff;border-bottom-right-radius:6px}.quote-message-assistant{align-self:flex-start;align-items:flex-start}.quote-message-assistant p{background:#f4f4f5;color:#24272d;border-bottom-left-radius:6px}.quote-message.is-typing p{color:#777b84;font-style:italic}
        .quote-result-card{margin:16px 0 4px;border:1px solid #e3e2ff;background:linear-gradient(180deg,#fbfaff,#fff);border-radius:20px;padding:17px 16px;box-shadow:0 14px 32px rgba(94,86,240,.08)}.quote-result-kicker{display:inline-flex;color:#5e56f0;background:#f2f0ff;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:800}.quote-result-card h4{margin:10px 0 6px;font-size:22px;letter-spacing:-.045em}.quote-result-card p{margin:0 0 10px;color:#4d525c;font-size:14px}.quote-result-card ul{margin:0 0 12px;padding-left:18px;color:#343943;font-size:13px;line-height:1.7}.quote-next{border-top:1px solid #eeeeF4;padding-top:12px;display:flex;flex-direction:column;gap:4px;font-size:13px;color:#555b66}.quote-next b{color:#111114}.quote-result-card small{display:block;margin-top:12px;color:#9a9da5;font-size:12px}.quote-error{margin:14px 0;padding:14px;border:1px solid #ffe0e0;background:#fff7f7;color:#a33;border-radius:16px;font-size:13px;line-height:1.6}
        .quote-chat-input{margin:0 14px 8px;background:#f4f4f5;border:1px solid #ededf0;border-radius:20px;min-height:86px;padding:13px 56px 12px 16px;position:relative}.quote-chat-input textarea{width:100%;resize:none;border:0;outline:0;background:transparent;color:#202328;font-size:15px;line-height:1.5}.quote-chat-input textarea::placeholder{color:#a7aab1}.quote-chat-input button{position:absolute;right:12px;bottom:12px;width:36px;height:36px;border:0;border-radius:12px;background:#cfc4ff;color:#fff;font-size:22px;font-weight:900;cursor:pointer}.quote-chat-input button:disabled{opacity:.55;cursor:wait}.quote-input-tools{position:absolute;left:16px;bottom:12px;color:#90949d;font-size:16px;letter-spacing:8px;pointer-events:none}.quote-disclaimer{margin:0 20px 14px;text-align:center;color:#a7aab1;font-size:11px;line-height:1.5}
        @media(max-width:640px){.quote-chat-root{right:16px;bottom:16px}.quote-chat-launcher{right:16px;bottom:16px}.quote-chat-panel{right:10px;left:10px;bottom:86px;width:auto;height:min(680px,calc(100vh - 104px));border-radius:24px}.quote-chat-body{padding:18px 16px 14px}}
      `}</style>
    </div>
  );
}

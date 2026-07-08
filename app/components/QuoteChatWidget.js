"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackConsultationCta } from "./consultationAnalytics";

const PRESETS = {
  landing_page: "랜딩페이지 제작 견적 요청드립니다.",
  business_website: "회사 홈페이지 제작 견적 요청드립니다.",
  ecommerce_site: "카페24 자사몰 제작 견적 요청드립니다.",
  custom: "맞춤 플랫폼/MVP 제작 견적을 상담하고 싶습니다.",
};

const QUICK_STARTS = [
  { label: "홈페이지 견적", send: "회사 홈페이지 제작 견적 요청드립니다." },
  { label: "카페24 자사몰 견적", send: "카페24 자사몰 제작 견적 요청드립니다." },
  { label: "랜딩페이지 견적", send: "랜딩페이지 제작 견적 요청드립니다." },
];

const FIELD_LABELS = {
  service_type: "서비스 유형",
  design_status: "디자인 준비",
  pages: "페이지 규모",
  cafe24_modules: "Cafe24 화면 모듈",
  features: "필요 기능",
  backend_need: "백엔드/연동",
  timeline_weeks: "오픈 일정",
  contact_email: "이메일",
  confirmation: "최종 확인",
};

const SERVICE_LABELS = {
  landing_page: "단순 랜딩페이지",
  homepage: "홈페이지",
  cafe24_store: "자사몰 (Cafe24)",
};

const CID_KEY = "swq-cid";
const MSG_KEY = "swq-msgs";
const STATE_KEY = "swq-state";

function formatWon(value) {
  if (typeof value !== "number") return "-";
  return `${value.toLocaleString("ko-KR")}원`;
}

function newConversationId() {
  return `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pushAnalytics(name, params = {}) {
  try {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
  } catch {
    /* analytics must never break the widget */
  }
}

export default function QuoteChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [choicesMulti, setChoicesMulti] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [followup, setFollowup] = useState(null); // { currentMissingField, missing }
  const [estimateView, setEstimateView] = useState(null); // { estimate, pdfUrl, cta }
  const [conversationId, setConversationId] = useState(newConversationId);
  const bodyRef = useRef(null);
  const loadingRef = useRef(false);

  // 대화 복원 (새로고침해도 이어서)
  useEffect(() => {
    try {
      const savedCid = localStorage.getItem(CID_KEY);
      const savedMsgs = JSON.parse(localStorage.getItem(MSG_KEY) || "[]");
      if (savedCid && Array.isArray(savedMsgs) && savedMsgs.length) {
        setConversationId(savedCid);
        setMessages(savedMsgs);
        const savedState = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
        if (savedState && typeof savedState === "object") {
          setFollowup(savedState.followup || null);
          setChoices(Array.isArray(savedState.choices) ? savedState.choices : []);
          setChoicesMulti(Boolean(savedState.choicesMulti));
          setEstimateView(savedState.estimateView || null);
        }
      } else if (savedCid) {
        setConversationId(savedCid);
      } else {
        localStorage.setItem(CID_KEY, conversationId);
      }
    } catch {
      /* localStorage 미지원 환경 무시 */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((cid, msgs, state) => {
    try {
      localStorage.setItem(CID_KEY, cid);
      localStorage.setItem(MSG_KEY, JSON.stringify(msgs.slice(-40)));
      localStorage.setItem(STATE_KEY, JSON.stringify(state || null));
    } catch {
      /* ignore */
    }
  }, []);

  // 새 메시지마다, 그리고 패널을 다시 열 때 아래로 스크롤
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, status, choices, estimateView]);

  const resetConversation = useCallback(() => {
    const cid = newConversationId();
    setConversationId(cid);
    setMessages([]);
    setChoices([]);
    setChoicesMulti(false);
    setSelectedModules([]);
    setFollowup(null);
    setEstimateView(null);
    setError("");
    setStatus("idle");
    try {
      localStorage.setItem(CID_KEY, cid);
      localStorage.removeItem(MSG_KEY);
      localStorage.removeItem(STATE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const requestQuote = useCallback(
    async (rawText) => {
      if (loadingRef.current) return;
      const requestText = String(rawText || "").trim();
      if (!requestText) {
        setError("만들 사이트나 필요한 기능을 한 줄로 적어주세요.");
        return;
      }
      loadingRef.current = true;
      const prevChoices = choices;
      const prevChoicesMulti = choicesMulti;
      setOpen(true);
      setStatus("loading");
      setError("");
      setChoices([]);
      setSelectedModules([]);
      setText("");
      const optimistic = [...messages, { role: "user", content: requestText }];
      setMessages(optimistic);
      if (optimistic.length === 1) pushAnalytics("quote_started", { conversation_id: conversationId });

      try {
        const response = await fetch("/api/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text: requestText, conversationId, channel: "web" }),
        });
        const data = await response.json();
        if (!response.ok || !["ok", "needs_more_info"].includes(data.status)) {
          throw new Error(data.message || "견적 서버 연결에 실패했습니다.");
        }
        const nextMessages = data.conversation?.messages?.length
          ? data.conversation.messages
          : [...optimistic, { role: "assistant", content: data.message || "확인했습니다." }];
        setMessages(nextMessages);

        if (data.status === "needs_more_info") {
          const nextFollowup = { currentMissingField: data.currentMissingField, missing: data.missing || [] };
          const nextChoices = Array.isArray(data.choices) ? data.choices : [];
          const nextChoicesMulti = Boolean(data.choicesMulti);
          setFollowup(nextFollowup);
          setChoices(nextChoices);
          setChoicesMulti(nextChoicesMulti);
          setEstimateView(null);
          persist(conversationId, nextMessages, {
            followup: nextFollowup,
            choices: nextChoices,
            choicesMulti: nextChoicesMulti,
            estimateView: null,
          });
          pushAnalytics("quote_question_shown", { field: data.currentMissingField || "followup" });
        } else {
          const nextEstimateView = { estimate: data.estimate, pdfUrl: data.pdfUrl, cta: data.cta };
          setFollowup(null);
          setEstimateView(nextEstimateView);
          persist(conversationId, nextMessages, {
            followup: null,
            choices: [],
            choicesMulti: false,
            estimateView: nextEstimateView,
          });
          pushAnalytics("quote_completed", {
            conversation_id: conversationId,
            service_type: data.estimate?.service_type,
            value: data.estimate?.subtotal,
            currency: "KRW",
          });
        }
        setStatus("idle");
      } catch (err) {
        setMessages(optimistic);
        setChoices(prevChoices);
        setChoicesMulti(prevChoicesMulti);
        setError(err.message || "지금 자동 견적 서버 연결이 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.");
        setStatus("error");
      } finally {
        loadingRef.current = false;
      }
    },
    [conversationId, messages, choices, choicesMulti, persist]
  );

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
      if (anchor) setOpen(true);
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

  const onChoiceClick = (choice) => {
    if (!choicesMulti || choice.send === "없음") {
      setSelectedModules([]);
      requestQuote(choice.send);
      return;
    }
    setSelectedModules((current) =>
      current.includes(choice.send) ? current.filter((value) => value !== choice.send) : [...current, choice.send]
    );
  };

  const started = messages.length > 0;
  const estimate = estimateView?.estimate;
  const lineItems = estimate?.lineItems || [];
  const currentFieldLabel = followup?.currentMissingField ? FIELD_LABELS[followup.currentMissingField] || followup.currentMissingField : null;
  const remaining = followup?.missing?.length || 0;

  return (
    <div className="quote-chat-root" aria-live="polite">
      {open && (
        <section className="quote-chat-panel" role="dialog" aria-label="자동 견적 상담 채팅창">
          <header className="quote-chat-head">
            <button className="quote-back" type="button" onClick={() => setOpen(false)} aria-label="채팅창 닫기">‹</button>
            <div className="quote-agent-mark" aria-hidden="true">S</div>
            <div className="quote-head-text">
              <strong>System Web 견적 어시스턴트</strong>
              <span>몇 가지만 확인하면 견적서 PDF까지 바로 드려요</span>
            </div>
            {started && (
              <button className="quote-reset" type="button" onClick={resetConversation}>새 문의</button>
            )}
          </header>

          {followup && remaining > 0 && (
            <div className="quote-progress" aria-label="견적 진행 상태">
              <span className="quote-progress-now">지금 확인 중: <b>{currentFieldLabel}</b></span>
              <span className="quote-progress-left">남은 확인 {remaining}개</span>
            </div>
          )}

          <div className="quote-chat-body" ref={bodyRef}>
            {!started && (
              <div className="quote-intro">
                <h3>웹사이트·자사몰 1차 견적을 바로 받아보세요 💬</h3>
                <p>필요한 작업을 한 줄로 남겨주시면 대화 몇 번으로 예상 금액과 견적서 PDF를 정리해 드립니다.</p>
                <p className="quote-hours"><b>진행 방식</b><br />AI 1차 견적: 즉시 · 견적서 PDF: 바로 다운로드 · 상세 견적: 직접 검토 후 안내</p>
                <div className="quote-action-row">
                  {QUICK_STARTS.map((quick) => (
                    <button
                      key={quick.label}
                      type="button"
                      className="quote-quick"
                      data-ga-location={`quote_widget_quick_${quick.label}`}
                      data-ga-text={quick.label}
                      onClick={(event) => {
                        trackConsultationCta(event.currentTarget);
                        requestQuote(quick.send);
                      }}
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {started && (
              <div className="quote-transcript" aria-label="견적 상담 대화 기록">
                {messages.map((message, index) => (
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

            {status !== "loading" && choices.length > 0 && (
              <div className="quote-choices" aria-label="답변 선택지">
                {choices.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    className={`quote-choice${selectedModules.includes(choice.send) ? " on" : ""}`}
                    onClick={() => onChoiceClick(choice)}
                  >
                    {choice.label}
                  </button>
                ))}
                {choicesMulti && selectedModules.length > 0 && (
                  <button type="button" className="quote-choice quote-choice-go" onClick={() => requestQuote(selectedModules.join(", "))}>
                    선택 완료 ({selectedModules.length})
                  </button>
                )}
              </div>
            )}

            {estimate && (
              <article className="quote-result-card">
                <span className="quote-result-kicker">1차 예상 견적</span>
                <h4>{estimate.range ? `${formatWon(estimate.range.min)} ~ ${formatWon(estimate.range.max)}` : "견적 산정 완료"}</h4>
                <p>{SERVICE_LABELS[estimate.service_type] || estimate.service_label || "웹 제작"} 기준 · 합계 {formatWon(estimate.subtotal)}</p>
                {lineItems.length > 0 && (
                  <ul>
                    {lineItems.slice(0, 6).map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <em>{item.label}</em>
                        <b>{formatWon(item.amount)}</b>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="quote-result-actions">
                  {estimateView.pdfUrl && (
                    <a
                      className="quote-pdf-btn"
                      href={estimateView.pdfUrl}
                      target="_blank"
                      rel="noopener"
                      onClick={(event) => {
                        trackConsultationCta(event.currentTarget, { cta_location: "quote_widget_pdf", cta_text: "견적서 PDF" });
                        pushAnalytics("quote_pdf_download", { conversation_id: conversationId });
                      }}
                    >
                      📄 견적서 PDF 다운로드
                    </a>
                  )}
                  {estimateView.cta?.url && (
                    <a
                      className="quote-cta-btn"
                      href={estimateView.cta.url}
                      target="_blank"
                      rel="noopener"
                      onClick={(event) => trackConsultationCta(event.currentTarget, { cta_location: "quote_widget_cta" })}
                    >
                      {estimateView.cta.label}
                    </a>
                  )}
                </div>
                <small>조건을 바꿔보고 싶으시면 그대로 입력하세요. 예: “디자인 제작 포함하면 얼마인가요?”</small>
              </article>
            )}

            {status === "error" && <div className="quote-error">{error}</div>}
          </div>

          <form className="quote-chat-input" onSubmit={submitQuote}>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitQuote(event);
                }
              }}
              placeholder={started ? "답변을 입력하거나 위 버튼을 눌러주세요" : "예: 회사 홈페이지 제작, 8페이지, 4주 안에 오픈"}
              rows={2}
              aria-label="견적 요청 내용"
            />
            <button type="submit" disabled={status === "loading"} aria-label="견적 요청 보내기">
              {status === "loading" ? "…" : "↑"}
            </button>
          </form>
          <p className="quote-disclaimer">1차 자동 추정 견적이며, 최종 견적은 상세 범위 확인 후 확정됩니다.</p>
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
        .quote-agent-mark{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#ffe1ef 0 16%,#a58cff 17% 46%,#5e56f0 47% 100%);color:#fff;font-size:12px;font-weight:800;flex:none}
        .quote-head-text{flex:1;min-width:0}
        .quote-chat-head strong{display:block;font-size:15px;font-weight:800;letter-spacing:-.02em}.quote-chat-head span{display:block;margin-top:2px;color:#8d9098;font-size:12px}
        .quote-reset{flex:none;border:1px solid #e3e3e9;background:#fff;color:#5a5e66;border-radius:999px;font-size:12px;font-weight:700;padding:7px 11px;cursor:pointer}
        .quote-progress{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 20px;background:#f7f4ff;border-bottom:1px solid #ece9fb;font-size:12px;color:#5a5e66}
        .quote-progress-now b{color:#5e56f0}
        .quote-progress-left{color:#9a9da5}
        .quote-chat-body{flex:1;overflow:auto;padding:22px 20px 16px;background:linear-gradient(180deg,#fff 0%,#fff 68%,#fafafa 100%)}
        .quote-intro h3{margin:0 0 12px;font-size:18px;line-height:1.45;font-weight:800;letter-spacing:-.035em;color:#111114}.quote-intro p{margin:0 0 14px;font-size:14px;line-height:1.72;color:#333740}.quote-hours{background:#fafafa;border:1px solid #ededf1;border-radius:16px;padding:12px 14px}.quote-hours b{color:#111114}.quote-action-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 8px}.quote-quick{border:0;border-radius:10px;background:#f7f4ff;color:#5e56f0;font-size:13px;font-weight:700;padding:10px 12px;cursor:pointer}.quote-quick:nth-child(1){background:#eef6ff;color:#2776d8}.quote-quick:nth-child(2){background:#edfaef;color:#1a9b4a}
        .quote-transcript{display:flex;flex-direction:column;gap:10px;margin:2px 0 14px}.quote-message{display:flex;flex-direction:column;gap:4px;max-width:88%}.quote-message span{font-size:11px;font-weight:800;color:#9a9da5}.quote-message p{margin:0;white-space:pre-wrap;font-size:14px;line-height:1.65;border-radius:18px;padding:11px 14px;box-shadow:0 4px 14px rgba(0,0,0,.04)}.quote-message-user{align-self:flex-end;align-items:flex-end}.quote-message-user p{background:#111114;color:#fff;border-bottom-right-radius:6px}.quote-message-assistant{align-self:flex-start;align-items:flex-start}.quote-message-assistant p{background:#f4f4f5;color:#24272d;border-bottom-left-radius:6px}.quote-message.is-typing p{color:#777b84;font-style:italic}
        .quote-choices{display:flex;flex-wrap:wrap;gap:7px;margin:2px 0 14px}
        .quote-choice{border:1px solid #d9d7fb;background:#fff;color:#5e56f0;border-radius:999px;padding:9px 14px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .14s ease,color .14s ease}
        .quote-choice:hover{background:#f7f4ff}
        .quote-choice.on{background:#5e56f0;color:#fff;border-color:#5e56f0}
        .quote-choice-go{background:#111114;color:#fff;border-color:#111114}
        .quote-result-card{margin:6px 0 10px;border:1px solid #e3e2ff;background:linear-gradient(180deg,#fbfaff,#fff);border-radius:20px;padding:17px 16px;box-shadow:0 14px 32px rgba(94,86,240,.08)}.quote-result-kicker{display:inline-flex;color:#5e56f0;background:#f2f0ff;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:800}.quote-result-card h4{margin:10px 0 6px;font-size:22px;letter-spacing:-.045em}.quote-result-card p{margin:0 0 10px;color:#4d525c;font-size:14px}
        .quote-result-card ul{margin:0 0 6px;padding:0;list-style:none;font-size:13px}
        .quote-result-card li{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid #f0effa;color:#343943}
        .quote-result-card li em{font-style:normal}.quote-result-card li b{white-space:nowrap;font-weight:700;color:#111114}
        .quote-result-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 2px}
        .quote-pdf-btn{display:inline-flex;align-items:center;gap:6px;background:#5e56f0;color:#fff;border-radius:12px;padding:11px 15px;font-size:13px;font-weight:800;text-decoration:none}
        .quote-pdf-btn:hover{background:#4d46d6}
        .quote-cta-btn{display:inline-flex;align-items:center;background:#111114;color:#fff;border-radius:12px;padding:11px 15px;font-size:13px;font-weight:800;text-decoration:none}
        .quote-result-card small{display:block;margin-top:10px;color:#9a9da5;font-size:12px;line-height:1.6}
        .quote-error{margin:14px 0;padding:14px;border:1px solid #ffe0e0;background:#fff7f7;color:#a33;border-radius:16px;font-size:13px;line-height:1.6}
        .quote-chat-input{margin:0 14px 8px;background:#f4f4f5;border:1px solid #ededf0;border-radius:20px;min-height:72px;padding:13px 56px 12px 16px;position:relative}.quote-chat-input textarea{width:100%;resize:none;border:0;outline:0;background:transparent;color:#202328;font-size:15px;line-height:1.5}.quote-chat-input textarea::placeholder{color:#a7aab1}.quote-chat-input button{position:absolute;right:12px;bottom:12px;width:36px;height:36px;border:0;border-radius:12px;background:#5e56f0;color:#fff;font-size:22px;font-weight:900;cursor:pointer}.quote-chat-input button:disabled{opacity:.55;cursor:wait}.quote-disclaimer{margin:0 20px 14px;text-align:center;color:#a7aab1;font-size:11px;line-height:1.5}
        @media(max-width:640px){.quote-chat-root{right:16px;bottom:16px}.quote-chat-launcher{right:16px;bottom:16px}.quote-chat-panel{right:10px;left:10px;bottom:86px;width:auto;height:min(680px,calc(100vh - 104px));border-radius:24px}.quote-chat-body{padding:18px 16px 14px}}
      `}</style>
    </div>
  );
}

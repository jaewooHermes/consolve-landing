export const CONSULTATION_EVENT_NAME = "consultation_cta_click";

const getText = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();

const getLocation = (el) =>
  el?.dataset?.gaLocation ||
  el?.closest("section")?.className?.toString().split(/\s+/).filter(Boolean).join(".") ||
  "unknown";

export function trackConsultationCta(el, extra = {}) {
  if (typeof window === "undefined" || !el) return;

  const params = {
    event_category: "consultation",
    event_label: getLocation(el),
    cta_location: getLocation(el),
    cta_text: el.dataset.gaText || getText(el),
    cta_href: el.getAttribute("href") || el.getAttribute("action") || "",
    page_path: window.location.pathname,
    ...extra,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", CONSULTATION_EVENT_NAME, params);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: CONSULTATION_EVENT_NAME, ...params });
}

export function bindConsultationAnalytics(root) {
  if (!root) return () => {};

  const onClick = (event) => {
    const cta = event.target.closest("[data-ga-consultation-cta]");
    if (!cta || !root.contains(cta)) return;
    if (cta.closest("form[data-ga-consultation-cta]")) return;
    trackConsultationCta(cta);
  };

  const onSubmit = (event) => {
    const form = event.target.closest("form[data-ga-consultation-cta]");
    if (!form || !root.contains(form)) return;
    const input = form.querySelector("input, textarea, select");
    trackConsultationCta(form, {
      cta_text: form.dataset.gaText || "consultation_form_submit",
      form_value_present: Boolean(input && String(input.value || "").trim()),
    });
  };

  root.addEventListener("click", onClick);
  root.addEventListener("submit", onSubmit);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("submit", onSubmit);
  };
}

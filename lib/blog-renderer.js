export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function inlineMarkup(value = "") {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function slugifyHeading(value = "", fallback = "section") {
  const ascii = String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || fallback;
}

export function extractHeadingsFromBlocks(blocks = []) {
  return blocks
    .filter((block) => block?.type === "heading" && Number(block.level || 2) === 2 && block.text)
    .slice(0, 8)
    .map((block, index) => ({
      id: block.id || slugifyHeading(block.text, `sec-${index + 1}`),
      title: block.text,
    }));
}

function renderRows(rows = []) {
  return rows
    .map((row, rowIndex) => {
      const cells = Array.isArray(row) ? row : [];
      return `<tr>${cells
        .map((cell) => rowIndex === 0 ? `<th>${inlineMarkup(cell)}</th>` : `<td>${inlineMarkup(cell)}</td>`)
        .join("")}</tr>`;
    })
    .join("");
}

function renderImage(block = {}) {
  if (!block.src && !block.image) return "";
  const src = escapeHtml(block.src || block.image);
  const alt = escapeHtml(block.alt || block.imageAlt || block.caption || "");
  const caption = block.caption ? `<figcaption>${inlineMarkup(block.caption)}</figcaption>` : "";
  return `<figure class="blog-image"><img src="${src}" alt="${alt}" loading="lazy" />${caption}</figure>`;
}

function renderPromptGrid(block = {}) {
  const items = Array.isArray(block.items) ? block.items : [];
  if (!items.length) return "";
  return `<div class="prompt-items">${items.map((item, index) => {
    const title = item?.title || `프롬프트 ${index + 1}`;
    const description = item?.description || "";
    const prompt = item?.prompt || "";
    const images = Array.isArray(item?.images)
      ? item.images
      : item?.image
        ? [{ src: item.image, alt: item.imageAlt || title }]
        : [];
    const gallery = images.length
      ? `<div class="prompt-gallery" aria-label="${escapeHtml(title)} 이미지 예시">${images.map((image, imageIndex) => {
          const src = typeof image === "string" ? image : image?.src;
          if (!src) return "";
          const alt = typeof image === "string" ? `${title} ${imageIndex + 1}` : (image.alt || `${title} ${imageIndex + 1}`);
          return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="${index < 2 ? "eager" : "lazy"}" />`;
        }).join("")}</div>`
      : "";
    return `<section class="prompt-item"><h3>${index + 1}. ${inlineMarkup(title)}</h3>${description ? `<p>${inlineMarkup(description)}</p>` : ""}${gallery}${prompt ? `<pre class="prompt"><code>${escapeHtml(prompt)}</code></pre>` : ""}</section>`;
  }).join("")}</div>`;
}

export function renderBlocksToHtml(blocks = []) {
  if (!Array.isArray(blocks)) return "";
  return blocks.map((block, index) => {
    if (!block || typeof block !== "object") return "";
    switch (block.type) {
      case "paragraph":
        return block.text ? `<p>${inlineMarkup(block.text)}</p>` : "";
      case "heading": {
        const level = Math.min(Math.max(Number(block.level || 2), 2), 3);
        const id = level === 2 ? ` id="${escapeHtml(block.id || slugifyHeading(block.text, `sec-${index + 1}`))}"` : "";
        return block.text ? `<h${level}${id}>${inlineMarkup(block.text)}</h${level}>` : "";
      }
      case "callout":
        return `<div class="callout">${block.title ? `<h4>${inlineMarkup(block.title)}</h4>` : ""}${block.text ? `<p>${inlineMarkup(block.text)}</p>` : ""}</div>`;
      case "quote":
        return block.text ? `<blockquote>${inlineMarkup(block.text)}</blockquote>` : "";
      case "list": {
        const items = Array.isArray(block.items) ? block.items : [];
        const tag = block.ordered ? "ol" : "ul";
        return items.length ? `<${tag}>${items.map((item) => `<li>${inlineMarkup(item)}</li>`).join("")}</${tag}>` : "";
      }
      case "table":
        return Array.isArray(block.rows) && block.rows.length ? `<table class="options"><tbody>${renderRows(block.rows)}</tbody></table>` : "";
      case "code":
        return block.code ? `<pre class="prompt"><code>${escapeHtml(block.code)}</code></pre>` : "";
      case "image":
        return renderImage(block);
      case "promptGrid":
      case "promptList":
        return renderPromptGrid(block);
      default:
        return "";
    }
  }).join("\n");
}

export function markdownToHtml(markdown = "") {
  const lines = String(markdown).split(/\r?\n/);
  const out = [];
  let list = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (list) { out.push("</ul>"); list = false; }
      continue;
    }
    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) { if (list) { out.push("</ul>"); list = false; } out.push(`<h2 id="${escapeHtml(slugifyHeading(line.slice(3), `sec-${out.length + 1}`))}">${inlineMarkup(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("### ")) { if (list) { out.push("</ul>"); list = false; } out.push(`<h3>${inlineMarkup(line.slice(4))}</h3>`); continue; }
    if (/^-\s+/.test(line)) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inlineMarkup(line.replace(/^-\s+/, ""))}</li>`); continue; }
    if (list) { out.push("</ul>"); list = false; }
    out.push(`<p>${inlineMarkup(line)}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("\n");
}

export function extractHeadingsFromMarkdown(markdown = "") {
  return String(markdown)
    .split(/\r?\n/)
    .filter((line) => line.startsWith("## "))
    .slice(0, 8)
    .map((line, index) => {
      const title = line.replace(/^##\s+/, "");
      return { id: slugifyHeading(title, `sec-${index + 1}`), title };
    });
}

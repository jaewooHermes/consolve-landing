// 마크다운 ↔ content.blocks 변환기.
// 어드민 에디터에서 마크다운으로 글을 쓰면 저장 시 blocks로 변환되고(markdownToBlocks),
// blocks로만 저장된 기존 글은 편집 화면에서 마크다운으로 되돌린다(blocksToMarkdown).
// blocksToMarkdown이 표현 못 하는 block(callout, promptGrid 등)이 있으면 null을 반환해
// 해당 글은 JSON 편집으로만 다루게 한다 (마크다운 왕복으로 정보가 깨지는 것을 방지).

const IMAGE_RE = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/;
const ORDERED_RE = /^\d+[.)]\s+/;

export function markdownToBlocks(markdown = "") {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  const flushParagraph = (buffer) => {
    const text = buffer.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    buffer.length = 0;
  };

  const paragraph = [];
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(paragraph);
      i += 1;
      continue;
    }

    // 코드 펜스
    if (trimmed.startsWith("```")) {
      flushParagraph(paragraph);
      const language = trimmed.slice(3).trim();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // 닫는 펜스
      blocks.push({ type: "code", code: code.join("\n"), ...(language ? { language } : {}) });
      continue;
    }

    // 제목 (# 는 글 제목과 겹치므로 h2로 취급, 렌더러는 h2~h3만 지원)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph(paragraph);
      const level = headingMatch[1].length >= 3 ? 3 : 2;
      blocks.push({ type: "heading", level, text: headingMatch[2].trim() });
      i += 1;
      continue;
    }

    // 이미지 단독 줄
    const imageMatch = trimmed.match(IMAGE_RE);
    if (imageMatch) {
      flushParagraph(paragraph);
      blocks.push({ type: "image", src: imageMatch[2], alt: imageMatch[1] || "" });
      i += 1;
      continue;
    }

    // 인용
    if (trimmed.startsWith(">")) {
      flushParagraph(paragraph);
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ").trim() });
      continue;
    }

    // 표
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushParagraph(paragraph);
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
        const isSeparator = cells.every((cell) => /^:?-{2,}:?$/.test(cell));
        if (!isSeparator) rows.push(cells);
        i += 1;
      }
      if (rows.length) blocks.push({ type: "table", rows });
      continue;
    }

    // 목록
    const isBullet = /^[-*]\s+/.test(trimmed);
    const isOrdered = ORDERED_RE.test(trimmed);
    if (isBullet || isOrdered) {
      flushParagraph(paragraph);
      const items = [];
      const ordered = isOrdered;
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        if (ordered ? ORDERED_RE.test(itemLine) : /^[-*]\s+/.test(itemLine)) {
          items.push(itemLine.replace(ordered ? ORDERED_RE : /^[-*]\s+/, "").trim());
          i += 1;
        } else break;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // 구분선은 건너뛴다
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flushParagraph(paragraph);
      i += 1;
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }
  flushParagraph(paragraph);
  return blocks;
}

const CONVERTIBLE = new Set(["paragraph", "heading", "list", "quote", "code", "image", "table"]);

export function blocksToMarkdown(blocks = []) {
  if (!Array.isArray(blocks) || !blocks.length) return "";
  if (!blocks.every((block) => block && CONVERTIBLE.has(block.type))) return null;

  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.text || "";
        case "heading":
          return `${Number(block.level) >= 3 ? "###" : "##"} ${block.text || ""}`;
        case "list": {
          const items = Array.isArray(block.items) ? block.items : [];
          return items.map((item, index) => (block.ordered ? `${index + 1}. ${item}` : `- ${item}`)).join("\n");
        }
        case "quote":
          return `> ${block.text || ""}`;
        case "code":
          return "```" + (block.language || "") + "\n" + (block.code || "") + "\n```";
        case "image":
          return `![${block.alt || ""}](${block.src || block.image || ""})`;
        case "table": {
          const rows = Array.isArray(block.rows) ? block.rows : [];
          if (!rows.length) return "";
          const [header, ...body] = rows;
          const line = (cells) => `| ${cells.join(" | ")} |`;
          return [line(header), line(header.map(() => "---")), ...body.map(line)].join("\n");
        }
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

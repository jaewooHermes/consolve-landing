export const PROMPT_ARTICLE_SLUG = "midjourney-film-photo-prompts";

export function promptArticleToPostPayload(article) {
  const promptItems = Array.isArray(article.promptItems) ? article.promptItems : [];
  const blocks = [
    ...(Array.isArray(article.introParagraphs) ? article.introParagraphs.map((text) => ({ type: "paragraph", text })) : []),
    ...(article.note ? [{ type: "callout", title: "Note", text: article.note }] : []),
    { type: "heading", level: 2, text: article.optionsTitle || "추천 사용 옵션" },
    { type: "table", rows: article.options || [] },
    { type: "heading", level: 2, text: article.promptsTitle || "프롬프트" },
    {
      type: "promptGrid",
      items: promptItems.map((item) => ({
        title: item.title,
        description: item.description,
        prompt: item.prompt,
        imageBase: item.imageBase,
        images: [1, 2, 3].map((variant) => ({
          src: `/generated-content/${PROMPT_ARTICLE_SLUG}/${item.imageBase}-0${variant}.png`,
          alt: `${item.title} ${variant}`,
        })),
      })),
    },
    { type: "heading", level: 2, text: article.howToTitle || "활용 방법" },
    ...(article.howToIntro ? [{ type: "paragraph", text: article.howToIntro }] : []),
    { type: "list", ordered: true, items: article.howToItems || [] },
    { type: "code", code: article.examplePrompt || "" },
    { type: "heading", level: 2, text: article.checklistTitle || "체크리스트" },
    { type: "list", items: article.checklist || [] },
    ...(article.outro ? [{ type: "paragraph", text: article.outro }] : []),
  ];

  return {
    schemaVersion: 1,
    id: article.slug || PROMPT_ARTICLE_SLUG,
    slug: article.slug || PROMPT_ARTICLE_SLUG,
    status: article.status || "published",
    type: "article",
    category: article.category || "tip",
    title: article.title,
    excerpt: article.excerpt,
    seoDescription: article.seoDescription,
    lead: article.lead,
    eyebrow: article.eyebrow || "프롬프트 모음",
    author: article.author || "Consolve",
    date: article.date || "2026년 6월 23일",
    publishedAt: article.publishedAt || "2026-06-23T00:00:00.000Z",
    updatedAt: article.updatedAt || new Date().toISOString(),
    hero: {
      kind: "gradient",
      alt: article.heroLabel || "블로그 대표 이미지",
    },
    promptArticle: true,
    content: { blocks },
  };
}

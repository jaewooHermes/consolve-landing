import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPostBySlug, formatDate } from "../../../lib/cms";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeImageSrc(value) {
  const src = String(value || "").trim();
  if (/^\/generated-content\/[a-z0-9._\/-]+\.(?:png|jpg|jpeg|webp|gif)$/i.test(src)) return src;
  if (/^https:\/\/[^\s)]+\.(?:png|jpg|jpeg|webp|gif)$/i.test(src)) return src;
  return "";
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="nofollow noopener noreferrer" target="_blank">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html;
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").split("\n");
  const blocks = [];
  let listItems = [];

  function flushList() {
    if (listItems.length) {
      blocks.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushList();
      const src = safeImageSrc(imageMatch[2]);
      if (src) {
        blocks.push(`<figure class="article-image"><img src="${escapeHtml(src)}" alt="${escapeHtml(imageMatch[1])}" loading="lazy" decoding="async" /></figure>`);
      }
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }
    flushList();
    blocks.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }
  flushList();
  return blocks.join("\n");
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | Consovle Blog",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://consolve.kr/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://consolve.kr/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author || "Consolve",
    },
    publisher: {
      "@type": "Organization",
      name: "Consolve",
      url: "https://consolve.kr",
    },
    mainEntityOfPage: `https://consolve.kr/blog/${post.slug}`,
  };

  return (
    <main className="article-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <nav className="article-nav" aria-label="블로그 이동">
        <Link href="/blog">← Blog</Link>
        <Link href="/">Consolve</Link>
      </nav>
      <article className="article-card">
        <header className="article-header">
          <p className="blog-kicker">{post.targetKeyword || "Google SEO"}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.contentMarkdown) }} />
      </article>
    </main>
  );
}

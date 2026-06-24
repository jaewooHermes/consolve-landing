import EditBlogPostPage from "../[slug]/page";

export const dynamic = "force-dynamic";
export const metadata = { title: "블로그 수정 | Consolve Admin", robots: { index: false, follow: false } };

export default async function EditPromptArticlePage() {
  return EditBlogPostPage({ params: Promise.resolve({ slug: "midjourney-film-photo-prompts" }) });
}

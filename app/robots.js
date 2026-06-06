export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["Yeti", "NaverBot"],
        allow: "/",
      },
    ],
    sitemap: "https://consolve.kr/sitemap.xml",
    host: "https://consolve.kr",
  };
}

import "./globals.css";

export const metadata = {
  title: "Consolve Gallery",
  description: "A studio-style gallery of founder-ready launch work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

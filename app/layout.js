import "./globals.css";

export const metadata = {
  title: "Consolve — 1일 견적. 실시간 진행. 6개월 무상 보증.",
  description: "AI로 만드는 1인 개발 외주. 랜딩 30 / 홈 100 / 자사몰 300.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

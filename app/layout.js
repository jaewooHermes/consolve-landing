import "./globals.css";
import QuoteChatWidget from "./components/QuoteChatWidget";

export const metadata = {
  title: "Visible Dev — 시스템으로 빠르고 퀄리티 있는 웹·자사몰 개발",
  description:
    "제작·검수·인계 단계마다 시스템을 넣어, 빠르면서도 퀄리티 있는 웹사이트·자사몰 개발 외주.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <QuoteChatWidget />
      </body>
    </html>
  );
}

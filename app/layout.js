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
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R4YH4QJWR8"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-R4YH4QJWR8');
            `,
          }}
        />
      </head>
      <body>
        {children}
        <QuoteChatWidget />
      </body>
    </html>
  );
}

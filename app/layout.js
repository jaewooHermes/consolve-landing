import Script from "next/script";
import "./globals.css";
import QuoteChatWidget from "./components/QuoteChatWidget";

const GA_MEASUREMENT_ID = "G-R4YH4QJWR8";

export const metadata = {
  title: "Visible Dev — 시스템으로 빠르고 퀄리티 있는 웹·자사몰 개발",
  description:
    "제작·검수·인계 단계마다 시스템을 넣어, 빠르면서도 퀄리티 있는 웹사이트·자사몰 개발 외주.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
        <QuoteChatWidget />
      </body>
    </html>
  );
}

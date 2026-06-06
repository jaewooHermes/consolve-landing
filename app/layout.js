import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-R4YH4QJWR8";

export const metadata = {
  metadataBase: new URL("https://consolve.kr"),
  title: "Consolve — 1일 견적. 실시간 진행. 6개월 무상 보증.",
  description: "AI로 만드는 1인 개발 외주. 랜딩 30 / 홈 100 / 자사몰 300.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}

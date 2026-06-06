// /test 라우트 메타데이터 (page.js가 client component라 metadata는 여기서 export)
export const metadata = {
  title: "Visible Dev — 시스템으로 빠르고 퀄리티 있는 웹·자사몰 개발",
  description:
    "제작·검수·인계 단계마다 시스템을 넣어, 빠르면서도 퀄리티 있는 웹사이트·자사몰 개발 외주.",
};

export default function TestLayout({ children }) {
  return children;
}

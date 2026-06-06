const nextConfig = {
  // dev에서 127.0.0.1 / 로컬 네트워크 IP로 접속해도 클라이언트 JS(HMR·청크)가
  // 차단되지 않도록 허용. (Next 16 기본 cross-origin 차단 해제)
  allowedDevOrigins: ["127.0.0.1", "localhost", "100.99.46.56"],
};

export default nextConfig;

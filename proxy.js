import { NextResponse } from "next/server";

function isAdminRequest(request) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const pathname = request.nextUrl.pathname;
  return hostname === "admin.consolve.kr" || pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Consolve Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

function decodeBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function timingSafeEqualString(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function isAuthorized(request) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;
  const parsed = decodeBasicAuth(request.headers.get("authorization"));
  if (!parsed) return false;
  return timingSafeEqualString(parsed.username, expectedUsername) && timingSafeEqualString(parsed.password, expectedPassword);
}

export function proxy(request) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const pathname = request.nextUrl.pathname;

  if (isAdminRequest(request) && !isAuthorized(request)) {
    return unauthorized();
  }

  if (
    hostname === "admin.consolve.kr" &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

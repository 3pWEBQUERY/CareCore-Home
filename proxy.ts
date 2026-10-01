import { NextResponse, type NextRequest } from "next/server";

// Schnelle Vorprüfung: ohne Sitzungs-Cookie direkt zur Anmeldung. Die eigentliche Prüfung machen die Layouts.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("cch_session")) {
    const url = new URL("/anmelden", request.url);
    url.searchParams.set("weiter", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/konto/:path*", "/admin/:path*"] };

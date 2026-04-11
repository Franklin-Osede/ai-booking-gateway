import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "upgrade-insecure-requests": "1"
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch from target: ${response.status}`, {
        status: response.status,
      });
    }

    let html = await response.text();
    
    // Inject <base> tag to fix relative assets
    const baseTag = `<base href="${url}">`;
    html = html.replace("<head>", `<head>\n${baseTag}`);

    const newHeaders = new Headers(response.headers);
    
    // Strip headers that block iframing
    newHeaders.delete("x-frame-options");
    newHeaders.delete("content-security-policy");

    // CRITICAL FIX: Since we read the text and modify it, it is no longer compressed
    // or the same length. We must strip these headers so the browser doesn't choke.
    newHeaders.delete("content-encoding");
    newHeaders.delete("content-length");
    newHeaders.delete("transfer-encoding");

    return new NextResponse(html, {
      status: 200,
      headers: newHeaders,
    });
  } catch (error: unknown) {
    console.error("Proxy Proxy Error:", error);
    return new NextResponse(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}

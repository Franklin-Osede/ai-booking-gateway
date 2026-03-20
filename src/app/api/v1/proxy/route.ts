import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
  } catch (error: any) {
    console.error("Proxy Proxy Error:", error);
    return new NextResponse(error.message || "Internal server error", { status: 500 });
  }
}

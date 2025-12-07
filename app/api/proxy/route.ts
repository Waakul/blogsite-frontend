// app/api/proxy/route.ts
export async function GET(req: Request) {
  return proxyRequest(req, "GET");
}

export async function POST(req: Request) {
  return proxyRequest(req, "POST");
}

export async function PUT(req: Request) {
  return proxyRequest(req, "PUT");
}

async function proxyRequest(req: Request, method: string) {
  const url = new URL(req.url);
  // Forward to localhost:4401, preserving path and query
  const target = `http://localhost:4401${url.pathname.replace("/api/proxy", "")}${url.search}`;

  const body =
    method !== "GET" && method !== "HEAD" ? await req.text() : undefined;

  const response = await fetch(target, {
    method,
    headers: req.headers,
    body,
  });

  const data = await response.text();
  return new Response(data, { status: response.status });
}

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const info: Record<string, unknown> = {
    url_full: url ?? "MISSING",
    url_length: url?.length ?? 0,
    url_chars: url ? Array.from(url).map((c, i) => `${i}:${c}(${c.charCodeAt(0)})`) : [],
    key_exists: !!key,
    key_length: key?.length ?? 0,
    key_prefix: key?.substring(0, 15) ?? "MISSING",
  };

  // Try basic fetch to root
  if (url) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      info.root_status = res.status;
    } catch (err: any) {
      info.root_error = err.message;
      info.root_cause = err.cause?.message ?? "no cause";
      info.root_code = err.cause?.code ?? "no code";
    }
  }

  // Try REST endpoint
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/users?select=count`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      info.rest_status = res.status;
      info.rest_body = await res.text();
    } catch (err: any) {
      info.rest_error = err.message;
      info.rest_cause = err.cause?.message ?? "no cause";
      info.rest_code = err.cause?.code ?? "no code";
    }
  }

  return Response.json(info, { headers: { "Content-Type": "application/json" } });
}

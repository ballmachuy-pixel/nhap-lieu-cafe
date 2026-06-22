export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Show full URL (not sensitive) and key prefix
  const info: Record<string, unknown> = {
    url_full: url ?? "MISSING",
    url_length: url?.length ?? 0,
    key_exists: !!key,
    key_length: key?.length ?? 0,
    key_prefix: key?.substring(0, 15) ?? "MISSING",
  };

  // Try to actually connect to Supabase
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/users?select=count`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      info.fetch_status = res.status;
      info.fetch_ok = res.ok;
      info.fetch_body = await res.text();
    } catch (err: any) {
      info.fetch_error = err.message;
    }
  }

  return Response.json(info);
}

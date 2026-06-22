export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Response.json({
    url_exists: !!url,
    url_length: url?.length ?? 0,
    url_prefix: url?.substring(0, 30) ?? "MISSING",
    key_exists: !!key,
    key_length: key?.length ?? 0,
    key_prefix: key?.substring(0, 15) ?? "MISSING",
  });
}

export const prerender = false;

export async function GET() {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('client_secret', clientSecret);
  url.searchParams.set('code', 'test_fake_code');

  const res = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  const body = await res.json();

  return new Response(JSON.stringify({
    CLIENT_ID_LENGTH: clientId?.length ?? 0,
    CLIENT_SECRET_LENGTH: clientSecret?.length ?? 0,
    github_http_status: res.status,
    github_error: body.error ?? null,
    github_error_description: body.error_description ?? null,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

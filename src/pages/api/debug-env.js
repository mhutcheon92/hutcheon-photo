export const prerender = false;

export async function GET(context) {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  const reqUrl = new URL(context.request.url);
  const code = reqUrl.searchParams.get('code');
  const allParams = Object.fromEntries(reqUrl.searchParams.entries());

  if (!code) {
    return new Response(JSON.stringify({
      instructions: 'Visit /api/keystatic/github/login first, authorize on GitHub, then you will be redirected back. Copy the full callback URL from the browser and replace /api/keystatic/github/oauth/callback with /api/debug-env to test.',
      CLIENT_ID_LENGTH: clientId?.length ?? 0,
      CLIENT_SECRET_LENGTH: clientSecret?.length ?? 0,
    }, null, 2), { headers: { 'Content-Type': 'application/json' } });
  }

  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('client_secret', clientSecret);
  url.searchParams.set('code', code);

  const res = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  const body = await res.json();

  return new Response(JSON.stringify({
    github_http_status: res.status,
    github_response_keys: Object.keys(body),
    github_error: body.error ?? null,
    github_error_description: body.error_description ?? null,
    has_access_token: !!body.access_token,
    has_refresh_token: !!body.refresh_token,
    has_expires_in: !!body.expires_in,
    token_type: body.token_type ?? null,
    scope: body.scope ?? null,
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
}

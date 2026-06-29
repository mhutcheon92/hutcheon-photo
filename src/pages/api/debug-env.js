export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({
    CLIENT_ID_SET: !!process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    CLIENT_ID_LENGTH: process.env.KEYSTATIC_GITHUB_CLIENT_ID?.length ?? 0,
    CLIENT_SECRET_SET: !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    CLIENT_SECRET_LENGTH: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET?.length ?? 0,
    SECRET_SET: !!process.env.KEYSTATIC_SECRET,
    SECRET_LENGTH: process.env.KEYSTATIC_SECRET?.length ?? 0,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

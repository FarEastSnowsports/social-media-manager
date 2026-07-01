// Vercel Edge Middleware — server-side HTTP Basic Auth.
// Runs on Vercel's Edge before any static file is served, so the page is
// NEVER sent to an unauthenticated visitor. The password lives here / in an
// env var on the server — it is never exposed in the page source.
//
// Password: set SITE_PASSWORD in Vercel → Project → Settings → Environment
// Variables. If unset, falls back to the value below.
// Username is ignored (any username works); only the password is checked.

export const config = {
  matcher: ['/((?!_vercel|favicon.ico).*)'],
};

export default function middleware(request) {
  const EXPECTED = (typeof process !== 'undefined' && process.env && process.env.SITE_PASSWORD)
    ? process.env.SITE_PASSWORD
    : 'SMM2627';

  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch (e) { decoded = ''; }
    const sep = decoded.indexOf(':');
    const password = sep >= 0 ? decoded.slice(sep + 1) : '';
    if (password === EXPECTED) {
      return; // authorized → continue to the static file
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="FES SMM Interview Deck", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

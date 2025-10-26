// //src/app/api/auth/logout/route.ts
// import { NextResponse } from 'next/server';

// export async function POST() {
//   const resp = NextResponse.json({ ok: true });
//   resp.cookies.set('cv_token', '', { httpOnly: true, path: '/', maxAge: 0 });
//   return resp;
// }






// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

const NAMES = ['cv_token', 'token', 'access_token', 'jwt'];

function clearCookies(res: NextResponse) {
  for (const name of NAMES) {
    res.cookies.set({
      name,
      value: '',
      path: '/',
      httpOnly: true,
      secure: false, // bật true khi deploy HTTPS
      expires: new Date(0),
      sameSite: 'lax',
    });
  }
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearCookies(res);
  return res;
}

export const GET = POST;

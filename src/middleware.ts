import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('sudofim_session');
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Neautorizat' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const role = request.cookies.get('session_role')?.value;
  const path = request.nextUrl.pathname;

  if (path === '/login') {
    if (role) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/dashboard') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

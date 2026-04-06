import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage) {
    const authCookie = request.cookies.get('admin_session');
    const isValid = authCookie && authCookie.value === process.env.ADMIN_PASSWORD;

    // 1. Se não tiver logado, chuta pro login
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 2. Se ESTIVER logado e tentar acessar apenas a raiz /admin, joga pro dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/api/admin/:path*'
  ],
}

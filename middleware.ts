import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to public routes
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated and trying to access protected routes
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/kanban') || pathname.startsWith('/jobs'))) {
      return NextResponse.redirect(new URL('/login?callbackUrl=' + pathname, req.url));
    }

    // Check role-based permissions for admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/settings/users')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', req.url));
      }
    }

    // Check permissions for specific routes
    if (pathname.startsWith('/jobs/create') || pathname.startsWith('/jobs/edit')) {
      const allowedRoles = ['ADMIN', 'CSR'];
      if (!allowedRoles.includes(token?.role)) {
        return NextResponse.redirect(new URL('/dashboard?error=insufficient-permissions', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all requests to proceed to the middleware function
        // The actual authorization logic is handled in the middleware function above
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-).*)',
  ],
};
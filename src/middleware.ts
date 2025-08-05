import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Allow access to auth pages without authentication
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    // Protect admin routes
    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      
      // Check if user has admin role for admin routes
      if (req.nextUrl.pathname.startsWith('/admin/settings') && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
          return true
        }
        // Require token for admin routes
        return !!token
      }
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/login', '/register']
} 
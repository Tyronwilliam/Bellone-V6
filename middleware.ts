
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Routes protégées
  const protectedRoutes = ['/projects', '/board', '/clients', '/settings']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Rediriger vers la page de connexion si pas authentifié
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Rediriger vers les projets si déjà connecté et sur la page de connexion
  if (request.nextUrl.pathname.startsWith('/auth/signin') && session?.user) {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

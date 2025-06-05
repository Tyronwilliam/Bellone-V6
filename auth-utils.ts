import { auth } from '@/auth'
import type { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

// Middleware pour vérifier l'authentification côté serveur
export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return session
}

// Utilitaire pour extraire le token JWT des headers
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7) // Enlever "Bearer "
}

// Vérifier l'authentification pour les API routes
export async function verifyApiAuth(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return session
}

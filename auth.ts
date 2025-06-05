import { prisma } from '@/lib/prisma'
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { Resend as ResendAuth } from 'resend'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 jours de connexion
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 jours de connexion
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Ajout infos user au JWT pour identifications
      if (user) {
        token.userId = user.id
        token.email = user.email
        //@ts-ignore
        token.role = user.role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      // Passer les infos de sesssion au token
      if (token) {
        session.user.id = token.userId as string
        session.user.email = token.email as string
        //@ts-ignore
        session.user.role = token.role as string
      }
      return session
    }
  },
  events: {
    createUser({ user }) {
      console.log('[EVENT] createUser:', user)
    },
    signIn({ user, account, profile }) {
      console.log('[EVENT] signIn:', user, account, profile)
    }
  },
  providers: [
    Resend({
      from: process.env.FROM_RESEND,
      sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
        const resend = new ResendAuth(process.env.AUTH_RESEND_KEY)

        try {
          const { data, error } = await resend.emails.send({
            from: process.env.FROM_RESEND!,
            to: email,
            subject: 'Connexion à ton compte Bellone',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">Bellone</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                  <h2 style="color: #333;">Connexion à votre compte</h2>
                  <p style="color: #666; line-height: 1.6;">
                    Bonjour,<br><br>
                    Cliquez sur le bouton ci-dessous pour vous connecter à votre compte Bellone :
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="
                      display: inline-block;
                      padding: 12px 30px;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                    ">Se connecter</a>
                  </div>
                  <p style="color: #999; font-size: 14px;">
                    Si vous n'avez pas demandé cette connexion, ignorez cet e-mail.<br>
                    Ce lien expirera dans 24 heures.
                  </p>
                </div>
              </div>
            `
          })
          if (error) {
            throw new Error(`Resend error: ${error.message}`)
          }
        } catch (err) {
          console.error("Erreur lors de l'envoi de l'e-mail de vérification :", err)
          throw err
        }
      },
      apiKey: process.env.AUTH_RESEND_KEY as string,
      normalizeIdentifier(identifier: string): string {
        let [local, domain] = identifier.toLowerCase().trim().split('@')
        domain = domain.split(',')[0]
        return `${local}@${domain}`
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
  }
})

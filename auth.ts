import { prisma } from '@/lib/prisma'
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { Resend as ResendAuth } from 'resend'

const resend = new ResendAuth(process.env.AUTH_RESEND_KEY)

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: 'frenchwebdeveloper@gmail.com',
      sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
        try {
          const { data, error } = await resend.emails.send({
            from: 'frenchwebdeveloper@gmail.com',
            to: email,
            subject: 'Connexion à ton compte',
            html: `
              <p>Bonjour,</p>
              <p>Clique sur le lien ci-dessous pour te connecter à ton compte :</p>
              <p><a href="${url}">Se connecter</a></p>
              <p>Si tu n’as pas demandé ce lien, ignore cet e-mail.</p>
            `
          })

          if (error) {
            throw new Error(`Resend error: ${error.message}`)
          }
        } catch (err) {
          console.error('Erreur lors de l’envoi de l’e-mail de vérification :', err)
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
  session: {
    strategy: 'database'
  }
})

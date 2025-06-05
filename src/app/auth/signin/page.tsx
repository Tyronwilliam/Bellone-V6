import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SignInForm } from './components/SignInForm'

export default async function SignInPage() {
  const session = await auth()

  // Rediriger si déjà connecté
  if (session?.user) {
    redirect('/projects')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à Bellone
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de connexion
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}

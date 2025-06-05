'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  console.log(session, 'HEY')
  return (
    <main>
      <header className="w-full h-fit flex justify-between p-4 shadow-md  ">
        <p>Bellone</p>
        <Link href="/projects">Go to Proejcts</Link>
        <button onClick={() => router.push('/auth/signin')}>SignIn</button>
      </header>
    </main>
  )
}

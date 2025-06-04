'use client'
import Link from 'next/link'
import { SignIn } from './components/SignIn'

export default function Home() {
  return (
    <main>
      <header className="w-full h-fit flex justify-between p-4 shadow-md  ">
        Hello Wolrd
        <Link href="/projects">Go to Proejcts</Link>
        <SignIn />
      </header>
    </main>
  )
}

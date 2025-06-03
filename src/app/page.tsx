'use client'
import Button from '@/generic/ButtonGeneric'
import Link from 'next/link'

export default function Home() {
  return (
    <main >
      Hello Wolrd
      <Link href="/projects">Go to Proejcts</Link>
    </main>
  )
}

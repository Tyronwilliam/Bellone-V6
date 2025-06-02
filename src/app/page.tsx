'use client'
import Button from '@/_components/generic/ButtonGeneric'
import Link from 'next/link'

export default function Home() {
  return (
    <main >
      Hello Wolrd
      <Link href="/projects">Go to Proejcts</Link>
    </main>
  )
}

'use client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { signIn, SignInOptions } from 'next-auth/react'
import { useState } from 'react'

export function SignIn() {
  const [isOpen, setIsOpen] = useState(false)

  const resendAction = async (formData: FormData) => {
    const email = formData.get('email')

    if (typeof email === 'string') {
      await signIn('resend', { email })
    } else {
      console.error('Email invalide ou manquant')
    }
  }

  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      <button onClick={toggle}>SignIn</button>
      {isOpen && (
        <Card className="absolute top-[7%] right-[1%]">
          <form
            action={resendAction}
            className="flex flex-col justify-between items-center gap-4 px-4 pb-4"
          >
            <span className="text-center uppercase font-bold">Sign In</span>
            <label htmlFor="email-resend">
              Email :
              <Input
                type="email"
                id="email-resend"
                name="email"
                placeholder="johndoe@example.com"
              />
            </label>
            <input
              type="submit"
              value="SignIn with Resend"
              className="border-2 rounded-md p-3 cursor-pointer"
            />
          </form>
        </Card>
      )}
    </>
  )
}

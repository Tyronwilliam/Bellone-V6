import { AddTaskInput, addTaskToColumn } from '@/lib/task/queries'
import { verifyApiAuth } from 'auth-utils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const authResult = await verifyApiAuth(req)
  if (authResult instanceof Response) return authResult
  const session = authResult
  try {
    const input: AddTaskInput = await req.json()

    const task = await addTaskToColumn({
      ...input,
      assigneeId: input.assigneeId ?? session.user!.id
    })

    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

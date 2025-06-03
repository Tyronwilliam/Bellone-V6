import { AddTaskInput, addTaskToColumn } from '@/lib/task/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const input: AddTaskInput = await req.json()
    console.log(input, 'INPUT BRO')

    const task = await addTaskToColumn(input)
    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

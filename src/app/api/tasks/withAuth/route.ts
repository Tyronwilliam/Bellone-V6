import { prisma } from '@/infrastructure/prisma'
import { AddTaskInput, UpdateTaskInput } from '@/infrastructure/task/taskInterface'
import { addTaskToColumn, updatedTask } from '@/infrastructure/task/taskQueries'
import { verifyApiAuth } from 'auth-utils'
import { User } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function getVerifyAuth(req: NextRequest): Promise<User> {
  const session = await verifyApiAuth(req)

  if (!session || !session.user) {
    throw new Error('Non authentifié')
  }

  return session.user as User
}

export async function POST(req: NextRequest) {
  try {
    const user = await getVerifyAuth(req)
    const input: AddTaskInput = await req.json()

    if (!input.title || !input.columnId) {
      return NextResponse.json({ message: 'Title or Column id is missing.' }, { status: 400 })
    }

    const task = await addTaskToColumn({
      ...input,
      createdById: user.id!,
      assigneeId: input.assigneeId ?? user.id
    })

    return NextResponse.json(task, { status: 200 })
  } catch (error: any) {
    console.error('POST /api/tasks/withAuth error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

// Update TASK

export async function PATCH(req: NextRequest) {
  try {
    const user = await getVerifyAuth(req)
    const input = await req.json()

    // Optionnel : autorisation
    const task = await prisma.task.findUnique({
      where: { id: input.id },
      select: { createdById: true }
    })

    if (!task || task.createdById !== user.id) {
      return NextResponse.json({ message: 'Accès interdit' }, { status: 403 })
    }

    const updatedTaskResponse = await updatedTask(input)
    return NextResponse.json(updatedTaskResponse, { status: 200 })
  } catch (error: any) {
    console.error('PATCH /api/tasks error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

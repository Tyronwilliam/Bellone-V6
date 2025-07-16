import { prisma } from '@/infrastructure/prisma'
import { AddTaskInput, UpdateTaskInput } from '@/infrastructure/task/taskInterface'
import { addTaskToColumn, updatedMembers, updatedTask } from '@/infrastructure/task/taskQueries'
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

// Update TASK

export async function PATCH(req: NextRequest) {
  try {
    const user = await getVerifyAuth(req)
    const input = await req.json()

    // Optionnel : autorisation
    const task = await prisma.task.findUnique({
      where: { id: input.id }
    })

    if (!task) {
      return NextResponse.json({ message: 'Task Not found' }, { status: 403 })
    }

    const updatedTaskResponse = await updatedMembers(input)
    return NextResponse.json(updatedTaskResponse, { status: 200 })
  } catch (error: any) {
    console.error('PATCH /api/tasks error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

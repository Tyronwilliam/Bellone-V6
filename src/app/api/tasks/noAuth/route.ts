import { prisma } from '@/infrastructure/prisma'
import { deleteTask, updatedTask } from '@/infrastructure/task/taskQueries'
import { verifyApiAuth } from 'auth-utils'
import { User } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function getVerifyAuth(req: NextRequest): Promise<User> {
  const session = await verifyApiAuth(req)

  if (!session || !session.user) {
    throw new Error('Not authenticated')
  }

  return session.user as User
}

// Update TASK

export async function PATCH(req: NextRequest) {
  try {
    const user = await getVerifyAuth(req)
    const input = await req.json()

    if (!input.id) {
      return NextResponse.json({ message: 'Task ID requiered.' }, { status: 400 })
    }

    const task = await prisma.task.findUnique({ where: { id: input.id } })
    if (!task) {
      return NextResponse.json({ message: 'Task not found.' }, { status: 404 })
    }

    const updatedTaskResponse = await updatedTask(input)

    if (updatedTaskResponse.success) {
      return NextResponse.json(updatedTaskResponse, { status: 200 })
    } else {
      return NextResponse.json({ message: updatedTaskResponse.error }, { status: 400 })
    }
  } catch (error) {
    console.error('PATCH /api/tasks error:', error)
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getVerifyAuth(req)
    const input = await req.json()
    const id = input.id

    if (!id) {
      return NextResponse.json({ message: 'Task ID requiered.' }, { status: 400 })
    }

    const task = await prisma.task.findUnique({ where: { id: id } })

    if (!task) {
      return NextResponse.json({ message: 'Task not found.' }, { status: 404 })
    }
    const response = await deleteTask(id)
    if (response.success) {
      return NextResponse.json(response, { status: 200 })
    } else {
      return NextResponse.json({ message: response.error }, { status: 400 })
    }
  } catch (error) {
    console.error('PATCH /api/tasks error:', error)
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 })
  }
}

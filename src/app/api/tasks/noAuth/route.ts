import { prisma } from '@/infrastructure/prisma'
import { updatedMembers } from '@/infrastructure/task/taskQueries'
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

    if (!input.id) {
      return NextResponse.json({ message: 'ID de tâche requis.' }, { status: 400 })
    }

    const task = await prisma.task.findUnique({ where: { id: input.id } })
    if (!task) {
      return NextResponse.json({ message: 'Tâche non trouvée.' }, { status: 404 })
    }

    const updatedTaskResponse = await updatedMembers(input)

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

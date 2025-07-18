import { AddLabelInput, DeleteLabelInput } from '@/infrastructure/label/labelInterface'
import {
  addLabelToTask,
  createGlobalLabel,
  removeLabelFromTask
} from '@/infrastructure/label/labelQueries'
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
    const input: AddLabelInput = await req.json()

    if (!input.name) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 })
    }

    const newLabel = await createGlobalLabel({
      ...input,
      userId: user.id!
    })

    if (!newLabel.success) {
      return NextResponse.json(
        { message: newLabel.error, existingLabel: newLabel.existingLabel },
        { status: 409 }
      )
    }

    if (input.taskId) {
      const linkToTask = await addLabelToTask({
        labelId: newLabel.label!.id,
        taskId: input.taskId
      })
      console.log(linkToTask, 'LINK TO TASK')
      if (!linkToTask.success) {
        return NextResponse.json(
          { message: 'Ce label est déjà associé à cette tâche' },
          { status: 422 }
        )
      }
      return NextResponse.json({ success: true, label: linkToTask.taskLabel }, { status: 201 })
    } else {
      return NextResponse.json(
        { message: 'Global label create fail to link it to the task' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('POST /api/label error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getVerifyAuth(req)
    const input: DeleteLabelInput = await req.json()

    if (!input.tagId) {
      return NextResponse.json({ message: 'Missing requiered label ID.' }, { status: 400 })
    }

    if (!input.taskId) {
      return NextResponse.json({ message: 'Missing requiered task ID.' }, { status: 400 })
    }

    const deleteLabel = await removeLabelFromTask(input)

    if (!deleteLabel.success) {
      return NextResponse.json(
        { message: deleteLabel.error ?? 'Erreur lors de la suppression du label' },
        { status: 409 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('DELETE /api/label error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

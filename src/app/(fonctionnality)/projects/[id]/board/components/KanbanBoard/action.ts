// app/actions/addColumn.ts
'use server'

import { prisma } from '@/infrastructure/prisma'
import { UpdateTaskSchema } from '@/infrastructure/task/taskInterface'
import { updatedTask } from '@/infrastructure/task/taskQueries'
import { z } from 'zod'

const AddColumnSchema = z.object({
  name: z.string().min(1, 'Nom est requis'),
  boardId: z.string().cuid(),
  order: z.number().int().nonnegative(),
  position: z.number().int().nonnegative(),
  color: z.string().optional()
})

export async function addColumnAction(body: z.infer<typeof AddColumnSchema>) {
  try {
    const parsed = AddColumnSchema.safeParse(body)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input'
      }
    }

    const column = await prisma.column.create({
      data: parsed.data
    })

    return { success: true, column }
  } catch (error) {
    console.error('Erreur addColumn:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la création'
    }
  }
}
//

// export async function updateTaskAction(body: z.infer<typeof UpdateTaskSchema>) {
//   try {
//     const parsed = UpdateTaskSchema.parse(body)

//     const { success, result, error } = await updatedTask(parsed)

//     if (!success) {
//       return { success: false, error }
//     }

//     return { success: true, task: result }
//   } catch (error) {
//     console.error('Erreur update Task:', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Erreur lors de l'update"
//     }
//   }
// }

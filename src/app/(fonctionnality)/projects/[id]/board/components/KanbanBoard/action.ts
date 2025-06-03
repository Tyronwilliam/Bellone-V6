// app/actions/addColumn.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const AddColumnSchema = z.object({
  name: z.string().min(1),
  boardId: z.string().cuid(),
  order: z.number().int().nonnegative(),
  position: z.number().int().nonnegative(),
  color: z.string().optional()
})

export async function addColumnAction(body: z.infer<typeof AddColumnSchema>) {
  try {
    const parsed = AddColumnSchema.parse(body)

    const column = await prisma.column.create({
      data: parsed
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

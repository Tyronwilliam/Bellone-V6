// lib/prisma/addTaskToColumn.ts

import { prisma } from '@/lib/prisma'

export type AddTaskInput = {
  title: string
  description?: string | null
  price?: number | null
  dueDate?: Date | null
  columnId: string
  assigneeId?: string | null
  client_id?: string | null
}

export async function addTaskToColumn({
  title,
  description = null,
  price = null,
  dueDate = null,
  columnId,
  assigneeId = null,
  client_id = null
}: AddTaskInput) {
  // Récupère la position actuelle (nombre de tâches dans la colonne)
  const taskCount = await prisma.task.count({
    where: { columnId }
  })
  const task = await prisma.task.create({
    data: { title, description, price, dueDate, columnId, assigneeId, client_id, order: taskCount }
  })

  return task
}

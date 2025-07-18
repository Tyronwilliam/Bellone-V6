import { prisma } from '@/infrastructure/prisma'
import { AddTaskInput, UpdateTaskInput } from './taskInterface'
import { cleanFalsyFields } from '@/app/utils/request'

export async function addTaskToColumn({
  title,
  columnId,
  assigneeId,
  client_id,
  createdById
}: AddTaskInput & { createdById: string }) {
  // Compte les tâches existantes dans la colonne pour positionner la nouvelle
  const taskCount = await prisma.task.count({
    where: { columnId }
  })

  const task = await prisma.task.create({
    data: {
      title: title.toLowerCase().trim(),
      columnId,
      assigneeId,
      client_id,
      createdById,
      order: taskCount
    },
    include: {
      assignee: true,
      tags: {
        include: { label: true }
      }
    }
  })

  return task
}

export async function updatedTask(input: UpdateTaskInput) {
  const updateData = cleanFalsyFields({
    title: input.title && input.title.toLowerCase().trim(),
    description: input.description,
    price: input.price,
    dueDate: input.dueDate,
    order: input.order,
    columnId: input.columnId,
    assigneeId: input.assigneeId ?? null,
    client_id: input.client_id,
    done: input.done
  })

  return prisma.task.update({
    where: { id: input.id },
    data: updateData,
    include: {
      assignee: true,
      tags: {
        include: { label: true }
      }
    }
  })
}
export async function updatedMembers(input: UpdateTaskInput) {
  const updateData = cleanFalsyFields({
    title: input.title && input.title.toLowerCase().trim(),
    description: input.description,
    price: input.price,
    dueDate: input.dueDate,
    order: input.order,
    columnId: input.columnId,
    assigneeId: input.assigneeId ?? null,
    client_id: input.client_id,
    done: input.done
  })

  return prisma.task.update({
    where: { id: input.id },
    data: updateData,
    include: {
      assignee: true,
      tags: {
        include: { label: true }
      }
    }
  })
}

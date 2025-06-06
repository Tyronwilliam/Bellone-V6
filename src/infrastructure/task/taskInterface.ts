import { z } from 'zod'

export type AddTaskInput = {
  title: string
  description?: string
  price?: number
  dueDate?: Date
  order: number
  columnId: string
  assigneeId?: string
  client_id?: string
  createdById: string
}
export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  dueDate: z.date().optional(),
  order: z.number().optional(),
  columnId: z.string().optional(),
  assigneeId: z.string().optional(),
  client_id: z.string().optional(),
  id: z.string(),
  done: z.boolean().optional()
})
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>

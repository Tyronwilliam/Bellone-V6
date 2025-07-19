import type { Board, Client, Column, Label, Project, Task, User } from '@prisma/prisma'

export type TaskTag = {
  task_id: string
  label_id: string
  createdAt: Date
  label: Label
}
export type TaskWithAssigneeAndTags = Task & {
  assignee: User | null
  tags: TaskTag[] 
}

export type KanbanData = {
  projects: Project
  clients: Client
  users: User[]
  boards: Board[]
  columns: Column[]
  tasks: TaskWithAssigneeAndTags[]
  labels: Label[]
}
export type KanbanBoardProps = {
  initialData: KanbanData
}

import type { Board, Client, Column, Label, Project, Task, User } from '@prisma/prisma'

export type TaskWithAssigneeAndTags = Task & {
  assignee: User | null
  tags: {
    label: Label
  }[]
}

export type KanbanData = {
  projects: Project
  clients: Client
  users: User[]
  boards: Board[]
  columns: Column[]
  tasks: TaskWithAssigneeAndTags[]
  // tags: Label[]
}
export type KanbanBoardProps = {
  initialData: KanbanData
}

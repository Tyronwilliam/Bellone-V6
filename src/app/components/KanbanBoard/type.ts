export interface Client {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  avatar?: string
}

export interface Project {
  id: string
  client_id: string
  name: string
}

export interface Board {
  id: string
  projectId: string
  name: string
  created_by_id: string
}

export interface Column {
  id: string
  boardId: string
  name: string
  order: number
  color?: string
}

export interface Task {
  id: string
  columnId: string
  title: string
  description?: string
  price?: number
  dueDate?: string
  assigneeId?: string
  client_id: string | undefined
  tags: string[]
  order: number
}

export interface KanbanData {
  clients: Client[]
  users: User[]
  projects: Project[]
  boards: Board[]
  columns: Column[]
  tasks: Task[]
}
export interface TaskLabel {
  task_id: string
  label_id: string
}
export interface LabelInterface {
  id: string
  name: string
  color?: string
}
export type ColumnType = Column

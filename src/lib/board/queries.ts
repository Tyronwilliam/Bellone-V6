import { prisma } from '@/lib/prisma'
import type { Board, Client, Column, Label, Project, Task, User } from '@prisma/prisma'

export async function getBoard(projectId: string) {
  const boards = await prisma.board.findMany({
    where: {
      projectId: projectId
    }
  })
  return boards
}
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

export async function getKanbanData(projectId: string): Promise<KanbanData | null> {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    include: {
      client: true,
      members: {
        include: { user: true }
      },
      boards: {
        include: {
          columns: {
            include: {
              tasks: {
                include: {
                  assignee: true,
                  tags: {
                    include: { label: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  if (!project) return null

  return {
    projects: project,
    clients: project.client,
    users: project.members.map((m) => m.user),
    boards: project.boards,
    columns: project.boards.flatMap((b) => b.columns),
    tasks: project.boards.flatMap((b) => b.columns.flatMap((c) => c.tasks))
  }
}

import { prisma } from '@/infrastructure/prisma'
import { KanbanData } from './boardInterface'
import { Board } from '@prisma/prisma'

export async function getBoard(projectId: string): Promise<Board[]> {
  const boards = await prisma.board.findMany({
    where: {
      projectId: projectId
    }
  })
  return boards
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
            },
            orderBy: { order: 'asc' }
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

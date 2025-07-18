import { prisma } from '@/infrastructure/prisma'
import { KanbanData, TaskWithAssigneeAndTags } from './boardInterface'
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
    where: { id: projectId },
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
  // Extraire les tâches
  const tasks: TaskWithAssigneeAndTags[] = project.boards
    .flatMap((board) => board.columns)
    .flatMap((column) => column.tasks)

  // Extraire tous les labels des tâches (via tags)
  const labels = tasks
    .flatMap((task) => task.tags)
    .map((tag) => tag?.label)
    .filter((label): label is NonNullable<typeof label> => !!label)

  // Supprimer les doublons de labels (basé sur l'id)
  const uniqueLabels = Array.from(new Map(labels.map((label) => [label.id, label])).values())

  return {
    projects: project,
    clients: project.client,
    users: project.members.map((m) => m.user),
    boards: project.boards,
    columns: project.boards.flatMap((b) => b.columns),
    tasks: tasks,
    labels: uniqueLabels
  }
}

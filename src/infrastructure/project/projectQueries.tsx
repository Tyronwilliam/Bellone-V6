import { prisma } from '@/infrastructure/prisma'
import { ProjectInput } from './projectInterface'
import { Prisma } from '@prisma/prisma'

export async function createProjectWithBoard({
  userId,
  name,
  description,
  client_id,
  hiddenForClient
}: ProjectInput) {
  // Ajouter l'userID donc le createur du projet en tant que Admin
  const newProject = await prisma.project.create({
    data: {
      name,
      description,
      client_id,
      hiddenForClient,
      members: {
        create: {
          user: {
            connect: { id: userId }
          },
          role: 'admin'
        }
      }
    },
    include: {
      members: true,
      client: true
    }
  })
  const newBoard = await prisma.board.create({
    data: {
      name: name,
      project: { connect: { id: newProject.id } },
      createdBy: { connect: { id: userId } },
      columns: {
        create: [
          { name: 'À faire', position: 0, order: 0 },
          { name: 'En cours', position: 1, order: 1 },
          { name: 'Terminé', position: 2, order: 2 }
        ]
      }
    },
    include: {
      columns: true
    }
  })

  return newProject
}
export type FullProject = Prisma.PromiseReturnType<typeof findUniqueProject>

export const findUniqueProject = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: {
        include: {
          user: true // Si le client a un compte utilisateur
        }
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true, avatar: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      boards: {
        include: {
          columns: {
            include: {
              tasks: {
                include: {
                  assignee: {
                    select: { id: true, name: true, avatar: true }
                  },
                  tags: {
                    include: {
                      label: true
                    }
                  }
                }
              }
            },
            orderBy: { order: 'asc' }
          },
          _count: {
            select: { columns: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      quotes: {
        include: {
          items: true,
          _count: {
            select: { items: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      invoices: {
        include: {
          items: true,
          payments: true,
          _count: {
            select: { items: true, payments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      labels: {
        include: {
          label: true
        },
        where: {
          isFavorite: true
        },
        take: 10
      }
    }
  })
}

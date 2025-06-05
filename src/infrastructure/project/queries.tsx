import { prisma } from '@/infrastructure/prisma'
import { Project } from '@prisma/prisma'

export type ProjectInput = {
  userId: string
  name: string
  description?: string
  client_id: string
  hiddenForClient?: boolean
  //   boards
  // labels
  //   quotes
  // invoices
}

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

// app/actions/addProject.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addProject(data: { name: string; clientId: string }) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        client_id: data.clientId
      }
    })

    revalidatePath('/projects')
    return { success: true, project }
  } catch (e) {
    console.error('Erreur ajout projet:', e)
    return { success: false, error: 'Erreur lors de la création du projet.' }
  }
}
// Exemple lors de la création d'un board
// const newBoard = await prisma.board.create({
//     data: {
//       id: 'b1',
//       name: 'Mon premier board',
//       project: { connect: { id: projectId } },
//       createdBy: { connect: { id: userId } },
//       columns: {
//         create: [
//           { id: 'col1', name: 'À faire', position: 0, order: 0 },
//           { id: 'col2', name: 'En cours', position: 1, order: 1 },
//           { id: 'col3', name: 'Terminé', position: 2, order: 2 }
//         ]
//       }
//     },
//     include: {
//       columns: true
//     }
//   })

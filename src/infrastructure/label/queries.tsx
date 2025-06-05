import { prisma } from '@/infrastructure/prisma'
import { GetAllLabelsOptions } from './labelInterface'

export async function getAllLabelsByUserOrBoard({
  userId,
  boardId,
  search,
  scope = 'all',
  page = 0,
  pageSize = 20
}: GetAllLabelsOptions) {
  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search.toLowerCase() } },
          { description: { contains: search.toLowerCase() } }
        ]
      }
    : {}

  const baseWhere: any = {
    AND: [searchFilter]
  }

  if (scope === 'user') {
    baseWhere.AND.push({ createdById: userId })
  } else if (scope === 'board') {
    baseWhere.AND.push({ boards: { some: { boardId } } })
  } else {
    baseWhere.AND.push({
      OR: [{ createdById: userId }, { boards: { some: { boardId } } }]
    })
  }

  const labels = await prisma.label.findMany({
    where: baseWhere,
    orderBy: [{ usageCount: 'desc' }, { name: 'asc' }],
    // include: {
    //   createdBy: {
    //     select: { name: true, email: true }
    //   }
    // },
    skip: page * pageSize,
    take: pageSize
  })

  const total = await prisma.label.count({ where: baseWhere })

  return {
    labels,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

// Récupérer les labels populaires OK
export async function getPopularLabels(limit = 10) {
  return await prisma.label.findMany({
    where: {
      usageCount: { gt: 0 }
    },
    orderBy: { usageCount: 'desc' },
    take: limit
  })
}

// Récupérer les labels utilisés dans un projet avec Favoris en premier a voir si j-besoin
// A utiliser pour recuperer tout les labels ou sinon include dans projet mais utiliser ça pour un chargmeent differé
export async function getProjectLabels(projectId: string) {
  return await prisma.projectLabel.findMany({
    where: { projectId },
    include: {
      label: true
    },
    orderBy: [
      { isFavorite: 'desc' }, // Favoris en premier
      { label: { name: 'asc' } }
    ]
  })
}

// Récupérer les labels utilisés dans un board
// export async function getBoardLabels(boardId: string) {
//   return await prisma.boardLabel.findMany({
//     where: { boardId },
//     include: {
//       label: true
//     },
//     orderBy: [{ isFavorite: 'desc' }, { label: { name: 'asc' } }]
//   })
// }

// Récupérer tous les labels disponibles pour un board (projet + board + globaux)
// export async function getAvailableLabelsForBoard(boardId: string) {
//   const board = await prisma.board.findUnique({
//     where: { id: boardId },
//     select: { projectId: true }
//   })

//   if (!board) return []

//   // Labels du projet
//   const projectLabels = await getProjectLabels(board.projectId)

//   // Labels du board
//   const boardLabels = await getBoardLabels(boardId)

//   // Labels globaux populaires (pas encore utilisés)
//   const usedLabelIds = [
//     ...projectLabels.map((pl) => pl.labelId),
//     ...boardLabels.map((bl) => bl.labelId)
//   ]

//   const popularLabels = await prisma.label.findMany({
//     where: {
//       id: { notIn: usedLabelIds },
//       usageCount: { gt: 0 }
//     },
//     orderBy: { usageCount: 'desc' },
//     take: 5
//   })

//   return {
//     projectLabels: projectLabels.map((pl) => ({
//       ...pl.label,
//       source: 'project',
//       isFavorite: pl.isFavorite
//     })),
//     boardLabels: boardLabels.map((bl) => ({
//       ...bl.label,
//       source: 'board',
//       isFavorite: bl.isFavorite
//     })),
//     popularLabels: popularLabels.map((label) => ({ ...label, source: 'global' }))
//   }
// }

// Ajouter un label existant à un board
export async function addLabelToBoard(data: {
  boardId: string
  labelId: string
  addedById: string
  isFavorite?: boolean
}) {
  // Incrémenter le compteur d'utilisation
  await prisma.label.update({
    where: { id: data.labelId },
    data: { usageCount: { increment: 1 } }
  })

  return await prisma.boardLabel.create({
    data
  })
}
// Créer un nouveau label global
export async function createLabel(data: {
  name: string
  color?: string
  description?: string
  createdById: string
}) {
  return await prisma.label.create({
    data
  })
} 
// Ajouter un label existant à un projet
export async function addLabelToProject(data: {
  projectId: string
  labelId: string
  addedById: string
  isFavorite?: boolean
}) {
  // Incrémenter le compteur d'utilisation
  await prisma.label.update({
    where: { id: data.labelId },
    data: { usageCount: { increment: 1 } }
  })

  return await prisma.projectLabel.create({
    data
  })
}
// Créer et ajouter un label à un projet en une fois
export async function createAndAddLabelToProject(data: {
  name: string
  color?: string
  description?: string
  projectId: string
  createdById: string
  isFavorite?: boolean
}) {
  // Vérifier si le label existe déjà
  let label = await prisma.label.findUnique({
    where: { name: data.name.toLowerCase() }
  })

  // Créer le label s'il n'existe pas
  if (!label) {
    label = await createLabel({
      name: data.name.toLowerCase(),
      color: data.color,
      description: data.description,
      createdById: data.createdById
    })
  }

  // Ajouter au projet
  return await addLabelToProject({
    projectId: data.projectId,
    labelId: label.id,
    addedById: data.createdById,
    isFavorite: data.isFavorite
  })
}

// Marquer un label comme favori dans un projet
export async function toggleProjectLabelFavorite(projectId: string, labelId: string) {
  const projectLabel = await prisma.projectLabel.findUnique({
    where: { projectId_labelId: { projectId, labelId } }
  })

  if (!projectLabel) return null

  return await prisma.projectLabel.update({
    where: { id: projectLabel.id },
    data: { isFavorite: !projectLabel.isFavorite }
  })
}

// Supprimer un label d'un projet (mais garder le label global)
export async function removeLabelFromProject(projectId: string, labelId: string) {
  return await prisma.projectLabel.delete({
    where: { projectId_labelId: { projectId, labelId } }
  })
}

// Supprimer définitivement un label global (admin seulement)
export async function deleteLabel(labelId: string) {
  return await prisma.label.delete({
    where: { id: labelId }
  })
}

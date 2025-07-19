import { prisma } from '@/infrastructure/prisma'

/**
 * Récupère tous les labels globaux avec options de recherche et pagination
 */
export async function getGlobalLabels({
  search,
  page = 1,
  limit = 20,
  sortBy = 'usageCount',
  sortOrder = 'desc'
}: {
  search?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'usageCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}) {
  const skip = (page - 1) * limit

  // Construire la condition de recherche
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    : {}

  // Récupérer les labels avec pagination
  const [labels, totalCount] = await Promise.all([
    prisma.label.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.label.count({ where })
  ])

  return {
    labels,
    pagination: {
      page,
      limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + labels.length < totalCount
    }
  }
}

/**
 * Récupère les labels associés à un projet spécifique avec personnalisations
 */
export async function getProjectLabels(projectId: string) {
  const projectLabels = await prisma.projectLabel.findMany({
    where: { projectId },
    include: {
      label: true
    },
    orderBy: [
      { isFavorite: 'desc' }, // Favoris en premier
      { label: { usageCount: 'desc' } } // Puis par popularité
    ]
  })

  return projectLabels
}

/**
 * Récupère les labels disponibles pour un board (labels du projet)
 */
// Utilise pour eviter la récuperation de label si le board ne s'est pas crée
export async function getBoardLabels(boardId: string) {
  // Récupérer le projet du board
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: { projectId: true }
  })

  if (!board) {
    throw new Error('Board non trouvé')
  }

  // Récupérer les labels du projet avec personnalisations
  return await getProjectLabels(board.projectId)
}

/**
 * Récupère les labels associés à une tâche spécifique
 */
export async function getTaskLabels(taskId: string) {
  const taskLabels = await prisma.taskLabel.findMany({
    where: { task_id: taskId },
    include: {
      label: true
    }
  })

  return taskLabels
}

/**
 * Récupère tous les labels disponibles pour un board (projet + globaux populaires)
 */
export async function getAvailableLabelsForBoard(boardId: string) {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: { projectId: true }
  })

  if (!board) return { projectLabels: [], popularLabels: [] }

  // Labels du projet
  const projectLabels = await getProjectLabels(board.projectId)

  // Labels globaux populaires (pas encore utilisés dans le projet)
  const usedLabelIds = projectLabels.map((pl) => pl.labelId)

  const popularLabels = await prisma.label.findMany({
    where: {
      id: { notIn: usedLabelIds },
      usageCount: { gt: 0 }
    },
    orderBy: { usageCount: 'desc' },
    take: 10
  })

  return {
    projectLabels: projectLabels.map((pl) => ({
      ...pl.label,
      source: 'project' as const,
      isFavorite: pl.isFavorite,
      colorOverride: pl.colorOverride
    })),
    popularLabels: popularLabels.map((label) => ({
      ...label,
      source: 'global' as const
    }))
  }
}

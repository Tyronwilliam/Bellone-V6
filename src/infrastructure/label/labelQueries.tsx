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
 * Crée un nouveau label global avec vérification d'unicité du nom
 */
export async function createGlobalLabel({
  name,
  color,
  description,
  userId
}: {
  name: string
  color?: string
  description?: string
  userId: string
}) {
  // Vérifier si un label avec ce nom existe déjà
  const existingLabel = await prisma.label.findUnique({
    where: { name }
  })

  if (existingLabel) {
    return {
      success: false,
      error: 'Un label avec ce nom existe déjà',
      existingLabel
    }
  }

  // Créer le nouveau label
  const newLabel = await prisma.label.create({
    data: {
      name,
      color: color || '#3b82f6', // Couleur par défaut (bleu)
      description,
      createdById: userId,
      usageCount: 0
    }
  })

  return {
    success: true,
    label: newLabel
  }
}

/**
 * Ajoute un label global existant à un projet
 */
export async function addLabelToProject({
  labelId,
  projectId,
  userId,
  isFavorite = false,
  colorOverride = null
}: {
  labelId: string
  projectId: string
  userId: string
  isFavorite?: boolean
  colorOverride?: string | null
}) {
  // Vérifier si le label existe déjà dans ce projet
  const existingProjectLabel = await prisma.projectLabel.findUnique({
    where: {
      projectId_labelId: {
        projectId,
        labelId
      }
    }
  })

  if (existingProjectLabel) {
    return {
      success: false,
      error: 'Ce label est déjà associé à ce projet',
      existingProjectLabel
    }
  }

  // Créer la relation et incrémenter le compteur d'utilisation
  const [projectLabel] = await prisma.$transaction([
    prisma.projectLabel.create({
      data: {
        projectId,
        labelId,
        addedById: userId,
        isFavorite,
        colorOverride
      }
    }),
    prisma.label.update({
      where: { id: labelId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    })
  ])

  return {
    success: true,
    projectLabel
  }
}

/**
 * Ajoute un label à une tâche
 */
export async function addLabelToTask({ labelId, taskId }: { labelId: string; taskId: string }) {
  // Vérifier si le label existe déjà pour cette tâche
  const existingTaskLabel = await prisma.taskLabel.findUnique({
    where: {
      task_id_label_id: {
        task_id: taskId,
        label_id: labelId
      }
    }
  })

  if (existingTaskLabel) {
    return {
      success: false,
      error: 'Ce label est déjà associé à cette tâche'
    }
  }

  // Créer la relation et incrémenter le compteur d'utilisation
  const [taskLabel] = await prisma.$transaction([
    prisma.taskLabel.create({
      data: {
        task_id: taskId,
        label_id: labelId
      }
    })
    // prisma.label.update({
    //   where: { id: labelId },
    //   data: {
    //     usageCount: {
    //       increment: 1
    //     }
    //   }
    // })
  ])

  return {
    success: true,
    taskLabel
  }
}

/**
 * Met à jour les personnalisations d'un label dans un projet
 */
export async function updateProjectLabelCustomization({
  projectId,
  labelId,
  colorOverride,
  isFavorite
}: {
  projectId: string
  labelId: string
  colorOverride?: string | null
  isFavorite?: boolean
}) {
  const projectLabel = await prisma.projectLabel.findUnique({
    where: {
      projectId_labelId: {
        projectId,
        labelId
      }
    }
  })

  if (!projectLabel) {
    return {
      success: false,
      error: "Ce label n'est pas associé à ce projet"
    }
  }

  const updatedProjectLabel = await prisma.projectLabel.update({
    where: {
      id: projectLabel.id
    },
    data: {
      ...(colorOverride !== undefined && { colorOverride }),
      ...(isFavorite !== undefined && { isFavorite })
    }
  })

  return {
    success: true,
    projectLabel: updatedProjectLabel
  }
}

/**
 * Marque un label comme favori dans un projet
 */
export async function toggleProjectLabelFavorite({
  projectId,
  labelId
}: {
  projectId: string
  labelId: string
}) {
  const projectLabel = await prisma.projectLabel.findUnique({
    where: {
      projectId_labelId: {
        projectId,
        labelId
      }
    }
  })

  if (!projectLabel) {
    return {
      success: false,
      error: "Ce label n'est pas associé à ce projet"
    }
  }

  const updatedProjectLabel = await prisma.projectLabel.update({
    where: {
      id: projectLabel.id
    },
    data: {
      isFavorite: !projectLabel.isFavorite
    }
  })

  return {
    success: true,
    projectLabel: updatedProjectLabel
  }
}

/**
 * Retire un label d'un projet
 */
export async function removeLabelFromProject({
  projectId,
  labelId
}: {
  projectId: string
  labelId: string
}) {
  const projectLabel = await prisma.projectLabel.findUnique({
    where: {
      projectId_labelId: {
        projectId,
        labelId
      }
    }
  })

  if (!projectLabel) {
    return {
      success: false,
      error: "Ce label n'est pas associé à ce projet"
    }
  }

  // Supprimer la relation et décrémenter le compteur d'utilisation
  await prisma.$transaction([
    prisma.projectLabel.delete({
      where: {
        id: projectLabel.id
      }
    }),
    prisma.label.update({
      where: { id: labelId },
      data: {
        usageCount: {
          decrement: 1
        }
      }
    })
  ])

  return {
    success: true
  }
}

/**
 * Retire un label d'une tâche
 */
export async function removeLabelFromTask({
  taskId,
  labelId
}: {
  taskId: string
  labelId: string
}) {
  const taskLabel = await prisma.taskLabel.findUnique({
    where: {
      task_id_label_id: {
        task_id: taskId,
        label_id: labelId
      }
    }
  })

  if (!taskLabel) {
    return {
      success: false,
      error: "Ce label n'est pas associé à cette tâche"
    }
  }

  // Supprimer la relation et décrémenter le compteur d'utilisation
  await prisma.$transaction([
    prisma.taskLabel.delete({
      where: {
        task_id_label_id: {
          task_id: taskId,
          label_id: labelId
        }
      }
    })
    // prisma.label.update({
    //   where: { id: labelId },
    //   data: {
    //     usageCount: {
    //       decrement: 1
    //     }
    //   }
    // })
  ])

  return {
    success: true
  }
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

import { prisma } from '@/infrastructure/prisma'

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

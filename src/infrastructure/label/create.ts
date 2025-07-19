import { prisma } from '@/infrastructure/prisma'
/**
 * Crée un nouveau label global avec vérification d'unicité du nom
 */

interface CreateGlobalLabelProps {
  name: string
  color?: string
  description?: string
  userId: string
  taskId?: string
}
export async function createGlobalLabel({
  name,
  color,
  description,
  userId,
  taskId
}: CreateGlobalLabelProps) {
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

interface AddLabelToProjectProps {
  labelId: string
  projectId: string
  userId: string
  isFavorite?: boolean
  colorOverride?: string | null
}
export async function addLabelToProject({
  labelId,
  projectId,
  userId,
  isFavorite = false,
  colorOverride = null
}: AddLabelToProjectProps) {
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
      },
      include: { label: true }
    })
  ])

  // prisma.label.update({
  //   where: { id: labelId },
  //   data: {
  //     usageCount: {
  //       increment: 1
  //     }
  //   }
  // })

  return {
    success: true,
    taskLabel
  }
}

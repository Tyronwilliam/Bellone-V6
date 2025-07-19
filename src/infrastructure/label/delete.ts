import { prisma } from '@/infrastructure/prisma'

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
export async function removeLabelFromTask({ taskId, tagId }: { taskId: string; tagId: string }) {
  const taskLabel = await prisma.taskLabel.findUnique({
    where: {
      task_id_label_id: {
        task_id: taskId,
        label_id: tagId
      }
    }
  })

  if (!taskLabel) {
    return {
      success: false,
      // error: "Ce label n'est pas associé à cette tâche"
      error: 'This label is not associated to this task'
    }
  }

  // Supprimer la relation et décrémenter le compteur d'utilisation
  await prisma.$transaction([
    prisma.taskLabel.delete({
      where: {
        task_id_label_id: {
          task_id: taskId,
          label_id: tagId
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

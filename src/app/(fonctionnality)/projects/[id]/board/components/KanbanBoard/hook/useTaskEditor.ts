'use client'

import { useState, useEffect } from 'react'
import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'

export function useTaskEditor(initialTask: TaskWithAssigneeAndTags | null) {
  const [editedTask, setEditedTask] = useState<TaskWithAssigneeAndTags | null>(null)

  useEffect(() => {
    if (initialTask) {
      setEditedTask({ ...initialTask })
    }
  }, [initialTask])

  const updateTask = (updates: Partial<TaskWithAssigneeAndTags>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, ...updates })
    }
  }

  const resetTask = () => {
    if (initialTask) {
      setEditedTask({ ...initialTask })
    }
  }

  return {
    editedTask,
    updateTask,
    resetTask,
    hasChanges: JSON.stringify(editedTask) !== JSON.stringify(initialTask)
  }
}

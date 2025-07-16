'use client'

import { useState, useEffect } from 'react'
import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import axios from 'axios'
import { toast } from 'sonner'

export function useTaskEditor(initialTask: TaskWithAssigneeAndTags | null) {
  const [editedTask, setEditedTask] = useState<TaskWithAssigneeAndTags | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (initialTask) {
      setEditedTask({ ...initialTask })
    }
  }, [initialTask])

  const updateTask = async (updates: Partial<TaskWithAssigneeAndTags>) => {
    if (editedTask) {
      setIsLoading(true)
      const data = { ...editedTask, ...updates }
      try {
        const { data: updatedTaskResponse, status } = await axios.patch('/api/tasks/members', data)
        if (status === 200) {
          setEditedTask(updatedTaskResponse)
        }
      } catch (error) {
        toast.error(`Unexpected error : ${error}`)
        console.warn(error, 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
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
    hasChanges: JSON.stringify(editedTask) !== JSON.stringify(initialTask),
    isLoading
  }
}

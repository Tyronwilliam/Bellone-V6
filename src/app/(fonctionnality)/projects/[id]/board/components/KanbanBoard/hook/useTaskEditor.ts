'use client'

import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
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
    if (!editedTask) return

    setIsLoading(true)
    const data = { ...editedTask, ...updates }

    try {
      const response = await axios.patch('/api/tasks/noAuth', data)
      const updatedTaskResponse = response.data

      if (response.status === 200 && updatedTaskResponse.result) {
        setEditedTask(updatedTaskResponse.result)
        toast.success('Task updated successfully')
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Une erreur inattendue est survenue'
      toast.error(message)
      console.warn('Update task error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetTask = () => {
    if (initialTask) {
      setEditedTask({ ...initialTask })
    }
  }
  
  const hasChanges = useMemo(() => {
    if (!initialTask || !editedTask) return false
    return editedTask.description !== initialTask.description
  }, [editedTask?.description, initialTask?.description])

  return {
    editedTask,
    setEditedTask,
    updateTask,
    resetTask,
    hasChanges: hasChanges,
    isLoading
  }
}

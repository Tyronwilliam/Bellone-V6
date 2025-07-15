'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'

interface UseTaskTagsProps {
  task: TaskWithAssigneeAndTags
  onTaskUpdate: (updates: Partial<TaskWithAssigneeAndTags>) => void
  userConnectedId: string
}

export function useTaskTags({ task, onTaskUpdate, userConnectedId }: UseTaskTagsProps) {
  const [newTagName, setNewTagName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const addTag = async () => {
    const trimmed = newTagName.trim()

    if (!trimmed) return

    const alreadyExists = task.tags.some(
      (tag: any) => tag.label.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (alreadyExists) {
      toast.error('Cette étiquette existe déjà')
      return
    }

    setIsLoading(true)

    try {
      const newLabel = {
        name: trimmed,
        color: null,
        createdById: userConnectedId,
        taskId: task.id
      }

      const { data: label, status } = await axios.post('/api/label', newLabel)

      if (status === 200 || status === 201) {
        onTaskUpdate({
          tags: [...task.tags, label.label]
        })
        setNewTagName('')
        toast.success('Étiquette ajoutée avec succès')
      } else {
        toast.error('Une erreur est survenue')
      }
    } catch (error: any) {
      console.error('Add tag error:', error)
      toast.error(error?.response?.data?.message || "Erreur lors de l'ajout")
    } finally {
      setIsLoading(false)
    }
  }

  const removeTag = (tagNameToRemove: string) => {
    onTaskUpdate({
      tags: task.tags.filter((tag) => tag.name.toLowerCase() !== tagNameToRemove.toLowerCase())
    })
  }

  return {
    newTagName,
    setNewTagName,
    addTag,
    removeTag,
    isLoading
  }
}

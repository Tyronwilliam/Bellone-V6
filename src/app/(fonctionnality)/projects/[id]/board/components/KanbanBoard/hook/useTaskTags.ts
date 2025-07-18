'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { DeleteLabelInput } from '@/infrastructure/label/labelInterface'

interface UseTaskTagsProps {
  task: TaskWithAssigneeAndTags
  setEditedTask: Dispatch<SetStateAction<TaskWithAssigneeAndTags | null>>
  onTaskUpdate: (updates: Partial<TaskWithAssigneeAndTags>) => void
  currentUserId: string
}

export function useTaskTags({
  task,
  setEditedTask,
  onTaskUpdate,
  currentUserId
}: UseTaskTagsProps) {
  const [newTagName, setNewTagName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const addTag = async () => {
    const trimmed = newTagName.trim()

    if (!trimmed) return

    const alreadyExists = task.tags?.some(
      (tag: any) => tag.label.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (alreadyExists) {
      toast.error('Label already exist')
      return
    }

    setIsLoading(true)

    try {
      const newLabel = {
        name: trimmed,
        color: null,
        createdById: currentUserId,
        taskId: task.id
      }

      const { data: label, status } = await axios.post('/api/label', newLabel)

      if (status === 200 || status === 201) {
        console.log(label, 'Label')
        console.log('TAGS ARRAY', [...task.tags, label.label])
        setEditedTask((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            tags: [...task.tags, label.label]
          }
        })
        task?.tags?.map((tag) => console.log(tag))
        // onTaskUpdate({
        //   tags: [...task.tags, label.label]
        // })
        setNewTagName('')
        toast.success('Label added')
      }
    } catch (error: any) {
      console.error('Add tag error:', error)
      toast.error(error?.response?.data?.message || 'Error adding tag')
    } finally {
      setIsLoading(false)
    }
  }

  const removeTag = async (tagId: string) => {
    try {
      setIsLoading(true)

      const data: DeleteLabelInput = {
        tagId: tagId,
        taskId: task.id
      }
      const { status } = await axios.delete('/api/label', { data })

      if (status === 200) {
        setEditedTask((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            //@ts-ignore
            tags: prev.tags.filter((tag) => tag.label_id !== tagId)
          }
        })
        toast.success('Label unlink from task ')
      }
    } catch (error: any) {
      console.error('Delete label error:', error)
      toast.error(error?.response?.data?.message || 'Error delete label')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    newTagName,
    setNewTagName,
    addTag,
    removeTag,
    isLoading
  }
}

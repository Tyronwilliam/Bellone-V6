'use client'

import type { KanbanData, TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { UpdateTaskInput } from '@/infrastructure/task/taskInterface'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

export function useKanbanData(initialData: KanbanData) {
  const [data, setData] = useState<KanbanData>(initialData)

  const getTasksForColumn = (columnId: string) =>
    data.tasks.filter((task) => task.columnId === columnId)

  const handleAddTask = async (columnId: string, title: string) => {
    if (!columnId || !title.trim()) {
      return toast.error('Le titre ou la colonne est manquant.')
    }

    try {
      const response = await axios.post<TaskWithAssigneeAndTags>('/api/tasks/addTask', {
        title,
        columnId,
        client_id: initialData.clients.id // vérifie ici que c’est bien défini
      })
      console.log(response, 'ADD TASK')

      const newTask = response.data

      setData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }))

      toast.success('Tâche ajoutée avec succès')
    } catch (error: any) {
      console.error('Erreur lors de la création de tâche :', error)
      toast.error(error?.response?.data?.message || 'Erreur lors de la création')
    }
  }

  const handleSaveTask = async (taskInput: UpdateTaskInput) => {
    console.log(taskInput, 'TASK INPUT')
    try {
      const { data: updatedTaskResponse, status } = await axios.patch(
        '/api/tasks/addTask',
        taskInput
      )

      if (status === 200) {
        toast.success('Tâche modifiée avec succès')

        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === updatedTaskResponse.id ? updatedTaskResponse : task
          )
        }))
      } else {
        toast.error('Une erreur est survenue')
      }
    } catch (error: any) {
      console.error('Update task error:', error)
      toast.error(error?.response?.data?.message || 'Erreur lors de la modification')
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId)
    }))
  }

  const handleDeleteColumn = (columnId: string) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
      tasks: prev.tasks.filter((task) => task.columnId !== columnId)
    }))
  }

  const handleRenameColumn = (columnId: string, newName: string) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col.id === columnId ? { ...col, name: newName } : col))
    }))
  }

  return {
    data,
    setData,
    getTasksForColumn,
    handleAddTask,
    handleSaveTask,
    handleDeleteTask,
    handleDeleteColumn,
    handleRenameColumn
  }
}

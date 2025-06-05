'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import type { KanbanData, TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import type { Task } from '@prisma/prisma'

export function useKanbanData(initialData: KanbanData) {
  const [data, setData] = useState<KanbanData>(initialData)

  const getTasksForColumn = (columnId: string) =>
    data.tasks.filter((task) => task.columnId === columnId)

  const handleAddTask = async (columnId: string, title: string) => {
    const columnTasks = getTasksForColumn(columnId)
    const taskData = {
      title,
      columnId,
      client_id: initialData.clients.id,
      order: columnTasks.length
    }
    try {
      const newTask: TaskWithAssigneeAndTags = await axios.post('/api/tasks/addTask', taskData)
      setData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }))
      toast.success('Tâche ajoutée avec succès')
    } catch (error) {
      toast.error('Erreur lors de la création')
    }
  }

  const handleSaveTask = (updatedTask: TaskWithAssigneeAndTags) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    }))
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

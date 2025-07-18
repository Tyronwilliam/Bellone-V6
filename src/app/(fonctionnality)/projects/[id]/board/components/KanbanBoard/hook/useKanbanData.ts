'use client'

import type { KanbanData, TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { UpdateTaskInput } from '@/infrastructure/task/taskInterface'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { addColumnAction } from '../action'
import type { Column as ColumnType } from '@prisma/prisma'

export function useKanbanData(initialData: KanbanData) {
  const [data, setData] = useState<KanbanData>(initialData)

  // Data processing
  const columns = data.columns
    .filter((col: ColumnType) => col.boardId === initialData.boards[0]?.id)
    .sort((a, b) => a.order - b.order)

  const getTasksForColumn = (columnId: string) =>
    data.tasks.filter((task) => task.columnId === columnId)

  const handleAddTask = async (columnId: string, title: string) => {
    if (!columnId || !title.trim()) {
      return toast.error('Title or Column id is missing')
    }

    try {
      const response = await axios.post<TaskWithAssigneeAndTags>('/api/tasks/addTask', {
        title,
        columnId,
        client_id: initialData.clients.id
      })
      if (response?.status === 200) {
        const newTask = response.data

        setData((prev) => ({
          ...prev,
          tasks: [...prev.tasks, newTask]
        }))

        toast.success('Task added')
      }
    } catch (error: any) {
      console.error('Error while adding task :', error)
      toast.error(error?.response?.data?.message || 'Creation error')
    }
  }

  const handleSaveTask = async (taskInput: UpdateTaskInput) => {
    try {
      const { data: updatedTaskResponse, status } = await axios.patch(
        '/api/tasks/addTask',
        taskInput
      )

      if (status === 200) {
        toast.success('Tâche modifiée avec succès')
        console.log(updatedTaskResponse, '/api/tasks/addTask')

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
  const handleAddColumn = async (name: string, color?: string) => {
    const body = {
      name: name,
      boardId: initialData.boards[0]?.id,
      order: columns.length,
      position: columns.length,
      color: color
    }
    const res = await addColumnAction(body)

    if (!res.success || !res.column) {
      toast.error(res.error)
    } else {
      toast.success('Column added')
      setData((prev) => ({
        ...prev,
        columns: [...prev.columns, res.column]
      }))
    }
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
    columns,
    getTasksForColumn,
    handleAddTask,
    handleSaveTask,
    handleDeleteTask,
    handleDeleteColumn,
    handleRenameColumn,
    handleAddColumn
  }
}

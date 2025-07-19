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
      const response = await axios.post<TaskWithAssigneeAndTags>('/api/tasks/withAuth', {
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
        '/api/tasks/noAuth',
        taskInput
      )

      if (status === 200) {
        toast.success('Task updated')
        console.log(updatedTaskResponse, '/api/tasks/noAuth')

        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === updatedTaskResponse.id ? updatedTaskResponse : task
          )
        }))
      } else {
        toast.error('Error')
      }
    } catch (error: any) {
      console.error('Update task error:', error)
      toast.error(error?.response?.data?.message || 'Error while updating task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      let data = { id: taskId }

      const response = await axios.delete('/api/tasks/noAuth', { data })

      if (response.status === 200) {
        toast.success('Task Deleted')

        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((task) => task.id !== taskId)
        }))
      } else {
        toast.error('Error')
      }
    } catch (error: any) {
      console.error('Delete task error:', error)
      toast.error(error?.response?.data?.message || 'Error while deleting task')
    }
  }

  const handleAddColumn = async (name: string, color?: string) => {
    const body = {
      name,
      boardId: initialData.boards[0]?.id,
      order: columns.length,
      position: columns.length,
      color
    }

    const res = await addColumnAction(body)

    if (!res.success || !res.column) {
      toast.error(res.error || 'Error while adding column')
      return
    }

    toast.success('Column added')
    setData((prev) => ({
      ...prev,
      columns: [...prev.columns, res.column]
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

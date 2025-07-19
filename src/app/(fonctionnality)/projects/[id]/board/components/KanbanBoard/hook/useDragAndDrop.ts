'use client'

import type React from 'react'

import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { KanbanData, TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { Task } from '@prisma/prisma'

export function useDragAndDrop(
  data: KanbanData,
  setData: React.Dispatch<React.SetStateAction<KanbanData>>
) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<TaskWithAssigneeAndTags | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    // Si c'est une tâche, on la stocke pour l'overlay
    if (active.data.current?.type === 'task') {
      const task = data.tasks.find((t) => t.id === active.id)
      setActiveTask(task || null)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'task'
    const isOverTask = over.data.current?.type === 'task'
    const isOverColumn = over.data.current?.type === 'column'

    if (!isActiveTask) return

    // Déplacer une tâche vers une autre tâche
    if (isActiveTask && isOverTask) {
      setData((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId)
        const overIndex = prev.tasks.findIndex((t) => t.id === overId)

        const activeTask = prev.tasks[activeIndex]
        const overTask = prev.tasks[overIndex]

        if (activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId
        }

        return {
          ...prev,
          tasks: arrayMove(prev.tasks, activeIndex, overIndex)
        }
      })
    }

    // Déplacer une tâche vers une colonne vide
    if (isActiveTask && isOverColumn) {
      setData((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId)
        const activeTask = prev.tasks[activeIndex]

        if (activeTask.columnId !== overId) {
          activeTask.columnId = overId
        }

        return {
          ...prev,
          tasks: [...prev.tasks]
        }
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveColumn = active.data.current?.type === 'column'

    // Réorganiser les colonnes
    if (isActiveColumn) {
      setData((prev) => {
        const activeIndex = prev.columns.findIndex((c) => c.id === activeId)
        const overIndex = prev.columns.findIndex((c) => c.id === overId)

        const reorderedColumns = arrayMove(prev.columns, activeIndex, overIndex)
        const updatedColumns = reorderedColumns.map((col: any, index: number) => ({
          ...col,
          order: index
        }))

        return {
          ...prev,
          columns: updatedColumns
        }
      })
    }

    // Réorganiser les tâches dans la même colonne
    const isActiveTask = active.data.current?.type === 'task'
    const isOverTask = over.data.current?.type === 'task'

    if (isActiveTask && isOverTask) {
      const activeTask = data.tasks.find((t) => t.id === activeId)
      const overTask = data.tasks.find((t) => t.id === overId)

      if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
        setData((prev: KanbanData) => {
          const columnTasks = prev.tasks
            .filter((t) => t.columnId === activeTask.columnId)
            .sort((a, b) => a.order - b.order)

          const activeIndex = columnTasks.findIndex((t) => t.id === activeId)
          const overIndex = columnTasks.findIndex((t) => t.id === overId)

          const reorderedTasks = arrayMove(columnTasks, activeIndex, overIndex)
          const updatedTasks = reorderedTasks.map((task, index: number) => ({
            ...task,
            order: index
          }))

          return {
            ...prev,
            tasks: prev.tasks.map((task: TaskWithAssigneeAndTags) => {
              const updatedTask = updatedTasks.find((t: Task) => t.id === task.id)
              return updatedTask || task
            })
          }
        })
      }
    }
  }

  return {
    activeId,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  }
}

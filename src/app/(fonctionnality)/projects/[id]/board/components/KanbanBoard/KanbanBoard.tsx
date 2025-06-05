'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import type { KanbanData, TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import type { Column as ColumnType, Task } from '@prisma/prisma'

// Hooks

// Components
import { Column } from './components/Column/Column'
import { AddColumnForm } from './components/AddColumnForm'
import { BoardHeader } from './components/BoardHeader'
import { DragOverlayContent } from './components/DragOverlayContent'
import { useKanbanSensors } from './hook/useKanbanSensors'
import { useKanbanData } from './hook/useKanbanData'
import { useDragAndDrop } from './hook/useDragAndDrop'
import { TaskDetailsModal } from './components/TaskDetailsModal/TaskDetailsModal'
import { addColumnAction } from './action'
import { toast } from 'sonner'

interface KanbanBoardProps {
  initialData: KanbanData
}

const KanbanBoard = ({ initialData }: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<TaskWithAssigneeAndTags | null>(null)
  console.log(initialData, 'initialData')

  // Custom hooks
  const sensors = useKanbanSensors()
  const {
    data,
    setData,
    getTasksForColumn,
    handleAddTask,
    handleSaveTask,
    handleDeleteTask,
    handleDeleteColumn,
    handleRenameColumn
  } = useKanbanData(initialData)

  const { activeId, activeTask, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(
    data,
    setData
  )

  // Validation
  const boardId = initialData.boards[0]?.id
  if (!boardId) {
    return <div>Board ID Missing</div>
  }

  // Data processing
  const columns = data.columns
    .filter((col: ColumnType) => col.boardId === boardId)
    .sort((a, b) => a.order - b.order)

  const handleAddColumn = async (name: string, color?: string) => {
    const body = {
      name: name,
      boardId: boardId,
      order: columns.length,
      position: columns.length,
      color: color
    }
    const res = await addColumnAction(body)

    if (!res.success || !res.column) {
      toast.error(res.error)
    } else {
      toast.success('Colonne ajoutée !')
      setData((prev) => ({
        ...prev,
        columns: [...prev.columns, res.column]
      }))
    }
  }

  return (
    <>
      <div className="w-full h-full p-6">
        <BoardHeader projectName={initialData.projects.name} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4">
            <SortableContext
              items={columns.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={getTasksForColumn(column.id)}
                  users={data.users}
                  clients={data.clients}
                  index={index}
                  onTaskClick={setSelectedTask}
                  onAddTask={handleAddTask}
                  onDeleteColumn={handleDeleteColumn}
                  onRenameColumn={handleRenameColumn}
                />
              ))}
            </SortableContext>

            <AddColumnForm onAddColumn={handleAddColumn} />
          </div>

          <DragOverlay>
            <DragOverlayContent activeTask={activeTask} users={data.users} client={data.clients} />
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        users={data.users}
        clients={data.clients}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  )
}

export { KanbanBoard }

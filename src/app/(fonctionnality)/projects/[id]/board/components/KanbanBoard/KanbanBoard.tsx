'use client'

import type { KanbanData, TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'

// Hooks

// Components
import { User } from 'next-auth'
import { AddColumnForm } from './components/AddColumnForm'
import { BoardHeader } from './components/BoardHeader'
import { Column } from './components/Column/Column'
import { DragOverlayContent } from './components/DragOverlayContent'
import { TaskDetailsModal } from './components/TaskDetailsModal/TaskDetailsModal'
import { useDragAndDrop } from './hook/useDragAndDrop'
import { useKanbanData } from './hook/useKanbanData'
import { useKanbanSensors } from './hook/useKanbanSensors'

interface KanbanBoardProps {
  initialData: KanbanData
  currentUser: User
}

const KanbanBoard = ({ initialData, currentUser }: KanbanBoardProps) => {
  // Validation
  const boardId = initialData.boards[0]?.id
  if (!boardId) {
    return <div>Board ID Missing</div>
  }

  const [selectedTask, setSelectedTask] = useState<TaskWithAssigneeAndTags | null>(null)
  const handleCloseTaskModal = (editedTask: TaskWithAssigneeAndTags) => {
    const updatedTasks = data.tasks.map((t) => (t.id === editedTask?.id ? editedTask : t))

    const newData: KanbanData = {
      ...data,
      tasks: updatedTasks
    }

    setData(newData)
    setSelectedTask(null)
  }
  // Custom hooks
  const sensors = useKanbanSensors()
  const {
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
  } = useKanbanData(initialData)

  const { activeId, activeTask, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(
    data,
    setData
  )

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
        isOpen={!!selectedTask}
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        currentUser={currentUser}
      />
    </>
  )
}

export { KanbanBoard }

'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TaskCard } from '../TaskCard/TaskCard'
import type { Column as ColumnType, Task, User, Client } from '@prisma/prisma'
import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'

interface ColumnProps {
  column: ColumnType
  tasks: TaskWithAssigneeAndTags[]
  users: User[]
  clients: Client
  index: number
  onTaskClick: (task: TaskWithAssigneeAndTags) => void
  onAddTask: (columnId: string, title: string) => void
  onDeleteColumn: (columnId: string) => void
  onRenameColumn: (columnId: string, newName: string) => void
}

export function Column({
  column,
  tasks,
  users,
  clients,
  index,
  onTaskClick,
  onAddTask,
  onDeleteColumn,
  onRenameColumn
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.name)

  // Hook pour rendre la colonne draggable
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  })

  // Hook pour rendre la colonne droppable pour les tâches
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle.trim())
      setNewTaskTitle('')
      setIsAddingTask(false)
    }
  }

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== column.name) {
      onRenameColumn(column.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

  return (
    <Card
      ref={(node) => {
        setSortableRef(node)
        setDroppableRef(node)
      }}
      style={style}
      className={`w-80 flex-shrink-0 bg-muted/30 rounded-b-lg rounded-t-sm ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardHeader
        {...attributes}
        {...listeners}
        className="pb-3 flex flex-row items-center justify-between cursor-grab active:cursor-grabbing"
      >
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') {
                setEditTitle(column.name)
                setIsEditing(false)
              }
            }}
            className="h-8 font-semibold"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="font-semibold text-sm">{column.name}</h3>
        )}

        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {tasks.length}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Renommer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteColumn(column.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="min-h-[100px] max-h-[calc(100vh-300px)] overflow-y-auto transition-[height] duration-300 ease-in-out">
          <SortableContext
            items={sortedTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                assignee={users.find((u) => u.id === task.assigneeId)}
                client={clients}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Task */}
        {isAddingTask ? (
          <div className="mt-2 space-y-2">
            <Input
              placeholder="Titre de la tâche..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask()
                if (e.key === 'Escape') {
                  setIsAddingTask(false)
                  setNewTaskTitle('')
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask}>
                Ajouter
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingTask(false)
                  setNewTaskTitle('')
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 justify-start text-muted-foreground"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une tâche
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Client, ColumnType, Task, User } from '../type'
import { TaskCard } from '../TaskCard/TaskCard'

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  users: User[]
  clients: Client[]
  index: number
  onTaskClick: (task: Task) => void
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
    <Draggable draggableId={column.id} index={index}>
      {(provided: any) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-80 flex-shrink-0 bg-muted/30"
        >
          <CardHeader
            {...provided.dragHandleProps}
            className="pb-3 flex flex-row items-center justify-between"
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
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteColumn(column.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Droppable droppableId={column.id} type="task">
              {(provided: any, snapshot: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[100px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-muted/50 rounded-md' : ''
                  }`}
                >
                  {sortedTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      assignee={users.find((u) => u.id === task.assigneeId)}
                      client={clients.find((c) => c.id === task.client_id)}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

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
      )}
    </Draggable>
  )
}

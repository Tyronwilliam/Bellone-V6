'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { Board, Client, ColumnType, KanbanData, Project, Task, User } from './type'
import { Column } from './Column/Column'
import { TaskDetailsModal } from './TaskDetailsModal/TaskDetailsModal'
import mockData from '@/utils/mockData.json'
import { useSearchParams } from 'next/navigation'

const mockProjects: Project[] = mockData.projects
const mockClient: Client[] = mockData.clients
const mockUsers: User[] = mockData.users
const mockBoards: Board[] = mockData.boards
const mockColumns: ColumnType[] = mockData.columns
const mockTasks: Task[] = mockData.tasks
// Données mockées
const initialData: KanbanData = {
  clients: mockClient,
  users: mockUsers,
  projects: mockProjects,
  boards: mockBoards,
  columns: mockColumns,
  tasks: mockTasks
}

export function KanbanBoard() {
  const [data, setData] = useState<KanbanData>(initialData)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')
  // KEEEP FOR REAL TIME DATA
  const searchParams = useSearchParams()
  //   const boardId = searchParams.get('id')
  // KEEEP FOR REAL TIME DATA

  const boardId = 'b1' // Pour cet exemple
  if (boardId === null) return

  const columns = data.columns
    .filter((col) => col.boardId === boardId)
    .sort((a, b) => a.order - b.order)

  const getTasksForColumn = (columnId: string) =>
    data.tasks.filter((task) => task.columnId === columnId)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result

    if (!destination) return

    // Si on dépose au même endroit, ne rien faire
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (type === 'column') {
      // Réorganiser les colonnes
      const newColumns = Array.from(columns)
      const [reorderedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, reorderedColumn)

      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index
      }))

      setData((prev) => ({
        ...prev,
        columns: prev.columns.map(
          (col) => updatedColumns.find((updated) => updated.id === col.id) || col
        )
      }))
      return
    }

    if (type === 'task') {
      const sourceColumnId = source.droppableId
      const destColumnId = destination.droppableId

      // Trouver la tâche déplacée
      const taskToMove = data.tasks.find((task) => task.id === draggableId)

      if (!taskToMove) return

      // Créer une copie de toutes les tâches
      const newTasks = [...data.tasks]

      if (sourceColumnId === destColumnId) {
        // Réorganiser dans la même colonne
        const columnTasks = newTasks
          .filter((task) => task.columnId === sourceColumnId)
          .sort((a, b) => a.order - b.order)

        // Retirer la tâche de sa position actuelle
        const updatedColumnTasks = columnTasks.filter((task) => task.id !== draggableId)

        // Insérer la tâche à sa nouvelle position
        updatedColumnTasks.splice(destination.index, 0, taskToMove)

        // Mettre à jour les ordres
        const reorderedTasks = updatedColumnTasks.map((task, index) => ({
          ...task,
          order: index
        }))

        // Mettre à jour l'état
        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) => {
            if (task.columnId === sourceColumnId) {
              const updatedTask = reorderedTasks.find((t) => t.id === task.id)
              return updatedTask || task
            }
            return task
          })
        }))
      } else {
        // Déplacer vers une autre colonne

        // 1. Mettre à jour la tâche déplacée avec sa nouvelle colonne et son nouvel ordre
        const updatedTask = {
          ...taskToMove,
          columnId: destColumnId
        }

        // 2. Obtenir les tâches de la colonne source (sans la tâche déplacée)
        const sourceTasks = newTasks
          .filter((task) => task.columnId === sourceColumnId && task.id !== draggableId)
          .sort((a, b) => a.order - b.order)

        // 3. Obtenir les tâches de la colonne destination
        const destTasks = newTasks
          .filter((task) => task.columnId === destColumnId && task.id !== draggableId)
          .sort((a, b) => a.order - b.order)

        // 4. Insérer la tâche dans la colonne destination
        destTasks.splice(destination.index, 0, updatedTask)

        // 5. Réorganiser les ordres dans les deux colonnes
        const updatedSourceTasks = sourceTasks.map((task, index) => ({
          ...task,
          order: index
        }))

        const updatedDestTasks = destTasks.map((task, index) => ({
          ...task,
          order: index
        }))

        // 6. Mettre à jour l'état
        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) => {
            // Si c'est la tâche déplacée
            if (task.id === draggableId) {
              const destTask = updatedDestTasks.find((t) => t.id === draggableId)
              return destTask || task
            }

            // Si c'est une tâche de la colonne source
            if (task.columnId === sourceColumnId) {
              const sourceTask = updatedSourceTasks.find((t) => t.id === task.id)
              return sourceTask || task
            }

            // Si c'est une tâche de la colonne destination
            if (task.columnId === destColumnId) {
              const destTask = updatedDestTasks.find((t) => t.id === task.id)
              return destTask || task
            }

            return task
          })
        }))
      }
    }
  }

  const handleAddTask = (columnId: string, title: string) => {
    const columnTasks = getTasksForColumn(columnId)
    const newTask: Task = {
      id: `t${Date.now()}`,
      columnId,
      title,
      client_id: data.clients[0].id, // Client par défaut
      tags: [],
      order: columnTasks.length
    }

    setData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }))
  }

  const handleSaveTask = (updatedTask: Task) => {
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

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: ColumnType = {
        id: `col${Date.now()}`,
        boardId,
        name: newColumnName.trim(),
        order: columns.length
      }

      setData((prev) => ({
        ...prev,
        columns: [...prev.columns, newColumn]
      }))

      setNewColumnName('')
      setIsAddingColumn(false)
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

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{mockProjects[0].name}</h1>
          {/* <p className="text-muted-foreground">Gérez vos tâches</p> */}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Droppable droppableId="board" type="column" direction="horizontal">
              {(provided: any) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-4">
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
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Ajouter une colonne */}
            <div className="flex-shrink-0">
              {isAddingColumn ? (
                <div className="w-80 p-4 bg-muted/30 rounded-lg">
                  <Input
                    placeholder="Nom de la colonne..."
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddColumn()
                      if (e.key === 'Escape') {
                        setIsAddingColumn(false)
                        setNewColumnName('')
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={handleAddColumn}>
                      Ajouter
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingColumn(false)
                        setNewColumnName('')
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-80 h-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                  onClick={() => setIsAddingColumn(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une colonne
                </Button>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>{' '}
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

'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import type { UpdateTaskInput } from '@/infrastructure/task/taskInterface'
import { Trash2 } from 'lucide-react'
import type { User as UserAuth } from 'next-auth'

import { TaskTagsSection } from './task-tags-section'
import { TaskDescriptionSection } from './task-description-section'
import { TaskAssigneeSection } from './task-assignee-section'
import { TaskDueDateSection } from './task-due-date-section'
import { User } from '@prisma/prisma'
import { useTaskTags } from '../../hook/useTaskTags'
import { TaskTitleEditor } from './task-title-editor-section'
import { useTaskEditor } from '../../hook/useTaskEditor'

interface TaskDetailsModalProps {
  task: TaskWithAssigneeAndTags | null
  users: User[]
  isOpen: boolean
  onClose: () => void
  onSave: (task: UpdateTaskInput) => void
  onDelete: (taskId: string) => void
  userConnected: UserAuth
}

export function TaskDetailsModal({
  task,
  users,
  isOpen,
  onClose,
  onSave,
  onDelete,
  userConnected
}: TaskDetailsModalProps) {
  const { editedTask, updateTask, resetTask, hasChanges } = useTaskEditor(task)

  const taskTags = useTaskTags({
    task: editedTask!,
    onTaskUpdate: updateTask,
    userConnectedId: userConnected.id!
  })

  if (!task || !editedTask) return null

  const handleSave = () => {
    onSave(editedTask as UpdateTaskInput)
    onClose()
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  const handleClose = () => {
    resetTask()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="lg:min-w-[60%] max-h-[90vh] p-8">
        <DialogHeader>
          <DialogTitle>
            <TaskTitleEditor
              title={editedTask.title}
              onTitleChange={(title) => updateTask({ title })}
            />
          </DialogTitle>
          <DialogDescription className="sr-only">Modifier le nom de la task</DialogDescription>
        </DialogHeader>

        <section className="flex gap-4 w-full">
          <div className="space-y-6 flex-1 min-w-[70%]">
            <TaskTagsSection
              tags={editedTask.tags}
              newTagName={taskTags.newTagName}
              onNewTagNameChange={taskTags.setNewTagName}
              onAddTag={taskTags.addTag}
              onRemoveTag={taskTags.removeTag}
              isLoading={taskTags.isLoading}
            />

            <TaskDescriptionSection
              description={editedTask.description}
              onDescriptionChange={(description) => updateTask({ description })}
            />
          </div>

          <aside className="flex-1 flex flex-col gap-4 items-end">
            <TaskAssigneeSection
              assigneeId={editedTask.assigneeId}
              users={users}
              onAssigneeChange={(assigneeId) => updateTask({ assigneeId })}
            />

            <TaskDueDateSection
              dueDate={editedTask.dueDate}
              onDueDateChange={(dueDate) => updateTask({ dueDate })}
            />
          </aside>
        </section>

        <DialogFooter className="flex gap-4 justify-between pt-4">
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!hasChanges}>
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
          </div>

          <Button variant="destructive" onClick={handleDelete} className="w-fit">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

import { User } from '@prisma/prisma'
import { useTaskEditor } from '../../hook/useTaskEditor'
import { useTaskTags } from '../../hook/useTaskTags'
import { TaskAssigneeSection } from './task-assignee-section'
import { TaskDescriptionSection } from './task-description-section'
import { TaskDueDateSection } from './task-due-date-section'
import { TaskTagsSection } from './task-tags-section'
import { TaskTitleEditor } from './task-title-editor-section'
import NewTag from './NewTag'
import { Label } from '@/components/ui/label'

interface TaskDetailsModalProps {
  task: TaskWithAssigneeAndTags | null
  users: User[]
  isOpen: boolean
  onClose: () => void
  onSave: (task: UpdateTaskInput) => void
  onDelete: (taskId: string) => void
  currentUser: UserAuth
}

export function TaskDetailsModal({
  task,
  users,
  isOpen,
  onClose,
  onSave,
  onDelete,
  currentUser
}: TaskDetailsModalProps) {
  const { editedTask, setEditedTask, updateTask, resetTask, hasChanges, isLoading } =
    useTaskEditor(task)

  const taskTags = useTaskTags({
    task: editedTask!,
    setEditedTask: setEditedTask,
    currentUserId: currentUser.id!
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
      <DialogContent className="min-w-[600px] max-h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle>
            <TaskTitleEditor
              title={editedTask.title}
              onTitleChange={(title) => updateTask({ title })}
            />
          </DialogTitle>
          <DialogDescription className="sr-only">Change task title</DialogDescription>
        </DialogHeader>

        <section className="w-full gap-4 grid grid-cols-6">
          <div className="space-y-6 col-span-4">
            <div className="space-y-2">
              <Label>Labels</Label>
              <div className="flex gap-2">
                <TaskTagsSection
                  tags={editedTask.tags}
                  onRemoveTag={taskTags.removeTag}
                  isLoading={taskTags.isLoading}
                />
                <NewTag
                  newTagName={taskTags.newTagName}
                  onNewTagNameChange={taskTags.setNewTagName}
                  onAddTag={taskTags.addTag}
                  isLoading={isLoading}
                  setNewColor={taskTags.setNewColor}
                  newColor={taskTags.newColor}
                />
              </div>
            </div>

            <TaskDescriptionSection
              description={editedTask.description}
              onDescriptionChange={(description) => updateTask({ description })}
            />
          </div>

          <div className="w-full  flex flex-col gap-4 col-span-2">
            <TaskAssigneeSection
              assignee={editedTask}
              users={users}
              onAssigneeChange={(assigneeId) => updateTask({ assigneeId })}
              isLoading={isLoading}
            />

            <TaskDueDateSection
              dueDate={editedTask.dueDate}
              onDueDateChange={(dueDate) => updateTask({ dueDate })}
            />
          </div>
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

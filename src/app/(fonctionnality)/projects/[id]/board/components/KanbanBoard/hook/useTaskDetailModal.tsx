import type { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import type { UpdateTaskInput } from '@/infrastructure/task/taskInterface'
import type { User as UserAuth } from 'next-auth'
import { useTaskEditor } from './useTaskEditor'
import { useTaskTags } from './useTaskTags'

export function useTaskDetailsModalLogic({
  task,
  onSave,
  onDelete,
  onClose,
  currentUser
}: {
  task: TaskWithAssigneeAndTags | null
  onSave: (task: UpdateTaskInput) => void
  onDelete: (taskId: string) => void
  onClose: (editedTask: TaskWithAssigneeAndTags) => void
  currentUser: UserAuth
}) {
  const { editedTask, setEditedTask, updateTask, resetTask, hasChanges, isLoading } =
    useTaskEditor(task)

  const taskTags = useTaskTags({
    task: editedTask!,
    setEditedTask,
    currentUserId: currentUser.id!
  })

  const handleSave = () => {
    onSave(editedTask as UpdateTaskInput)
    onClose(editedTask!)
  }

  const handleDelete = () => {
    onDelete(task!.id)
    onClose(editedTask!)
  }

  const handleClose = () => {
    resetTask()
    onClose(editedTask!)
  }

  return {
    editedTask,
    setEditedTask,
    updateTask,
    taskTags,
    isLoading,
    handleSave,
    handleDelete,
    handleClose,
    hasChanges
  }
}

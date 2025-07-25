'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Client, User } from '@prisma/prisma'
import { cn } from 'lib/utils/classnames'
import { Calendar } from 'lucide-react'
import { TaskTagsSection } from '../TaskDetailsModal/task-tags-section'

interface TaskCardProps {
  task: TaskWithAssigneeAndTags
  index: number
  assignee?: User
  client: Client
  onClick: () => void
  isDragging?: boolean
}

export function TaskCard({
  task,
  index,
  assignee,
  client,
  onClick,
  isDragging = false
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
  const isDueSoon =
    task.dueDate &&
    new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    new Date(task.dueDate) >= new Date()

  const dragging = isDragging || isSortableDragging
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
        dragging ? 'opacity-50 rotate-2 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent>
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

        {/* Tags */}
        <TaskTagsSection
          tags={task.tags}
          onRemoveTag={() => {}}
          isModal={false}
          badgeClassName={cn('text-xs')}
        />
        {/* Due Date Preview */}
        <DueDatePreview dueDate={task.dueDate} isDueSoon={isDueSoon} isOverdue={isOverdue} />

        {/* Footer */}
        <div className="flex items-center justify-end mt-3">
          {/* <span className="text-xs text-muted-foreground">{client.firstName}</span> */}
          <AvatarPreview assignee={assignee} />
        </div>
      </CardContent>
    </Card>
  )
}
type DueDatePreviewProps = {
  dueDate: Date | null
  isOverdue: boolean | null
  isDueSoon: boolean | null
}
export const DueDatePreview = ({ dueDate, isDueSoon, isOverdue }: DueDatePreviewProps) => {
  return (
    <div className="space-y-1">
      {dueDate && (
        <div
          className={`flex items-center gap-1 text-xs ${
            isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-muted-foreground'
          }`}
        >
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(dueDate).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
        </div>
      )}
    </div>
  )
}

export const AvatarPreview = ({ assignee }: { assignee?: User }) => {
  const getInitials = () => {
    if (assignee?.name && assignee.name.trim() !== '') {
      return assignee.name
        .split(' ')
        .map((n) => n[0]?.toUpperCase())
        .join('')
    } else if (assignee?.email) {
      return assignee.email[0]?.toUpperCase() || '?'
    } else {
      return '?'
    }
  }

  return (
    assignee && (
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
      </Avatar>
    )
  )
}

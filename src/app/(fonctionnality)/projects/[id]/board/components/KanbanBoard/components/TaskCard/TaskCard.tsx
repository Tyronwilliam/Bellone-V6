'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, DollarSign } from 'lucide-react'
import type { Client, Label, Task, User } from '@prisma/prisma'
import { Badge } from '@/components/ui/badge'
import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { cn } from 'lib/utils/classnames'

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
      <CardContent className="p-3">
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

        {/* Tags */}
        <BadgePreview tags={task.tags} />

        {/* Due Date Preview */}
        <DueDatePreview dueDate={task.dueDate} isDueSoon={isDueSoon} isOverdue={isOverdue} />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
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

export const BadgePreview = ({ tags }: { tags: Label[] }) => {
  return (
    tags &&
    tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.slice(0, 3).map((tag: any) => {
          if (!tag) return null
          return (
            <Badge
              key={tag.label.id}
              variant="secondary"
              className={cn('text-xs', tag.label.color && `bg-[${tag.label.color}]`)}
            >
              {tag.label.name}
            </Badge>
          )
        })}{' '}
      </div>
    )
  )
}
export const AvatarPreview = ({ assignee }: { assignee?: User }) => {
  return (
    assignee && (
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">
          {assignee?.name
            ? assignee.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            : '?'}
        </AvatarFallback>
      </Avatar>
    )
  )
}

'use client'

import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { Client, User } from '@prisma/prisma'
import { TaskCard } from './TaskCard/TaskCard'

interface DragOverlayContentProps {
  activeTask: TaskWithAssigneeAndTags | null
  users: User[]
  client: Client
}

export function DragOverlayContent({ activeTask, users, client }: DragOverlayContentProps) {
  if (!activeTask) return null

  return (
    <TaskCard
      task={activeTask}
      index={0}
      assignee={users.find((u) => u.id === activeTask.assigneeId)}
      client={client}
      onClick={() => {}}
    />
  )
}

'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { User } from '@prisma/prisma'
import { Delete, UserIcon } from 'lucide-react'

interface TaskAssigneeSectionProps {
  assignee: TaskWithAssigneeAndTags
  users: User[]
  onAssigneeChange: (assigneeId: string | null) => void
  isLoading: boolean
}

export function TaskAssigneeSection({
  assignee,
  users,
  onAssigneeChange,
  isLoading
}: TaskAssigneeSectionProps) {
  const currentAssignee = users.find((u) => u.id === assignee.assigneeId)

  return (
    <div className="space-y-2 w-full">
      <Label className="mx-auto w-fit text-sm" htmlFor="assignee">
        Members
      </Label>
      <div className="relative">
        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Select
          disabled={isLoading}
          onValueChange={(value) => onAssigneeChange(value === 'none' ? null : value)}
        >
          <SelectTrigger className="pl-10 w-full min-h-[40px]">
            {' '}
            {/* Fix taille ici */}
            <SelectValue placeholder={currentAssignee?.email ?? 'Add members'} />
          </SelectTrigger>
          <SelectContent>
            {assignee.assignee !== null && (
              <SelectItem value="none">
                {assignee.assignee?.email} <Delete className="inline ml-1 w-4 h-4" />
              </SelectItem>
            )}
            {users?.length > 0 &&
              users?.map(
                (user) =>
                  user.id !== assignee.assigneeId && (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  )
              )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

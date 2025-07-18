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
import { useState, useEffect } from 'react'

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
  const [selectedAssignee, setSelectedAssignee] = useState<string>('none')

  useEffect(() => {
    setSelectedAssignee(assignee.assigneeId ?? 'none')
  }, [assignee.assigneeId])

  const selectedUser = users.find((user) => user.id === selectedAssignee)

  return (
    <div className="space-y-2 w-full">
      <Label className="mx-auto w-fit text-sm" htmlFor="assignee">
        Members
      </Label>
      <div className="relative">
        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Select
          disabled={isLoading}
          value={selectedAssignee}
          onValueChange={(value) => {
            setSelectedAssignee(value)
            onAssigneeChange(value === 'none' ? null : value)
          }}
        >
          <SelectTrigger className="pl-10 w-full min-h-[40px]">
            <SelectValue
              placeholder="Add members"
              children={
                selectedAssignee === 'none' ? 'Add members' : (selectedUser?.email ?? 'Unknown')
              }
            />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) =>
              user.id === selectedAssignee ? (
                <SelectItem value="none" key={selectedAssignee ?? 'none'}>
                  {assignee.assignee?.email ? (
                    <>
                      {assignee.assignee.email}
                      <Delete className="inline ml-1 w-4 h-4" />
                    </>
                  ) : (
                    'Add members'
                  )}
                </SelectItem>
              ) : (
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

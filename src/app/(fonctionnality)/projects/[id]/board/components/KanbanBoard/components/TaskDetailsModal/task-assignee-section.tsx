'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { User } from '@prisma/prisma'
import { UserIcon } from 'lucide-react'

interface TaskAssigneeSectionProps {
  assigneeId: string | null
  users: User[]
  onAssigneeChange: (assigneeId: string | null) => void
}

export function TaskAssigneeSection({
  assigneeId,
  users,
  onAssigneeChange
}: TaskAssigneeSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="w-fit text-right ml-auto text-sm" htmlFor="assignee">
        Assigné à
      </Label>
      <div className="relative">
        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Select
          value={assigneeId || 'none'}
          onValueChange={(value) => onAssigneeChange(value === 'none' ? null : value)}
        >
          <SelectTrigger className="pl-10">
            <SelectValue placeholder="Sélectionner un utilisateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

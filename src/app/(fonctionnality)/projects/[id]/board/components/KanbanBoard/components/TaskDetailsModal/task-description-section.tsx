'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'
import { Dispatch, SetStateAction } from 'react'

interface TaskDescriptionSectionProps {
  description: string | null
  onDescriptionChange: Dispatch<SetStateAction<TaskWithAssigneeAndTags | null>>
}

export function TaskDescriptionSection({
  description,
  onDescriptionChange
}: TaskDescriptionSectionProps) {
  return (
    <div className="space-y-2 flex-1">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        className="resize-none min-h-[370px]"
        value={description || ''}
        onChange={(e) => {
          onDescriptionChange((prev) => {
            if (!prev) return null
            return {
              ...prev,
              description: e.target.value
            }
          })
        }}
      />
    </div>
  )
}

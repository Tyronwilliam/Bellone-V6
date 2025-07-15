'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TaskDescriptionSectionProps {
  description: string | null
  onDescriptionChange: (description: string) => void
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
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
    </div>
  )
}

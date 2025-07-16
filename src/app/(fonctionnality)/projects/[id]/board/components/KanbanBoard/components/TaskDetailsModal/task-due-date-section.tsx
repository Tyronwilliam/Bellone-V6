'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'

interface TaskDueDateSectionProps {
  dueDate: Date | null
  onDueDateChange: (date: Date | null) => void
}

export function TaskDueDateSection({ dueDate, onDueDateChange }: TaskDueDateSectionProps) {
  const formatted = dueDate ? new Date(dueDate).toLocaleDateString('fr-FR') : ''

  return (
    <div className="space-y-2 flex flex-col w-full">
      <Label className="mx-auto w-fit text-sm">Due date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left pl-10 bg-transparent">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {dueDate ? formatted : <span className="text-muted-foreground">Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate ? new Date(dueDate) : undefined}
            onSelect={(selected) => onDueDateChange(selected ?? null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

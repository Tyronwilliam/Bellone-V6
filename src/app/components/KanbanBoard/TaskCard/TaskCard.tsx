'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock, DollarSign } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import { Client, LabelInterface, Task, User } from '../type'
import mockData from '@/utils/mockData.json'

const mockLabel: LabelInterface[] = mockData.labels
interface TaskCardProps {
  task: Task
  index: number
  assignee?: User
  client?: Client
  onClick: () => void
}

export function TaskCard({ task, index, assignee, client, onClick }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
  const isDueSoon =
    task.dueDate &&
    new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    new Date(task.dueDate) >= new Date()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: any, snapshot: any) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
          }`}
          onClick={onClick}
        >
          <CardContent className="p-3">
            <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.tags.map((tag) => {
                  const label = mockLabel?.find((label) => label.id === tag)
                  console.log(label, tag)
                  if (!label) return null
                  return (
                    <Badge key={label.name} variant="secondary" className="text-xs">
                      {label.name}
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-1">
              {task.price && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span>{task.price}€</span>
                </div>
              )}

              {/* {task.duration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.duration}</span>
                </div>
              )} */}

              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    isOverdue
                      ? 'text-red-600'
                      : isDueSoon
                        ? 'text-orange-600'
                        : 'text-muted-foreground'
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">{client?.name}</span>
              {assignee && (
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {assignee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

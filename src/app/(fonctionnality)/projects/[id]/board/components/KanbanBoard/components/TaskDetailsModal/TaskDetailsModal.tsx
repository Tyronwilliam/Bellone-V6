'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, EuroIcon, Tag, Trash2, UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Client, Label as LabelType, Task, User } from '@prisma/prisma'
import { TaskWithAssigneeAndTags } from '@/lib/board/queries'
import { Badge } from '@/components/ui/badge'

interface TaskDetailsModalProps {
  task: TaskWithAssigneeAndTags | null
  users: User[]
  clients: Client
  isOpen: boolean
  onClose: () => void
  onSave: (task: TaskWithAssigneeAndTags) => void
  onDelete: (taskId: string) => void
}

export function TaskDetailsModal({
  task,
  users,
  clients,
  isOpen,
  onClose,
  onSave,
  onDelete
}: TaskDetailsModalProps) {
  const [editedTask, setEditedTask] = useState<TaskWithAssigneeAndTags | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task })
    }
  }, [task])

  if (!task || !editedTask) return null

  const handleSave = () => {
    onSave(editedTask)
    onClose()
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  const addTag = () => {
    const trimmed = newTag.trim()

    // Empêche les doublons par nom
    const alreadyExists = editedTask.tags.some(
      (tag) => tag.label.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (trimmed && !alreadyExists) {
      const newLabel: LabelType = {
        id: crypto.randomUUID(), // ou autre générateur si nécessaire
        name: trimmed,
        color: null // ou une couleur par défaut
      }

      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, { label: newLabel }]
      })

      setNewTag('')
    }
  }

  const removeTag = (tagNameToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter(
        (tag) => tag.label.name.toLowerCase() !== tagNameToRemove.toLowerCase()
      )
    })
  }

  const assignee = users.find((u) => u.id === editedTask.assigneeId)
  // const client = clients.find((c) => c.id === editedTask.client_id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-[60%] max-h-[90vh] p-8">
        <DialogHeader>
          <DialogTitle>
            {/* Titre */}
            <textarea
              id="title"
              ref={textareaRef}
              value={editedTask.title}
              onChange={(e) => {
                setEditedTask({ ...editedTask, title: e.target.value })
                const textarea = textareaRef.current
                if (textarea) {
                  textarea.style.height = 'auto'
                  textarea.style.height = textarea.scrollHeight + 'px'
                }
              }}
              rows={1}
              className="w-full h-auto resize-none overflow-hidden !text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0 focus-visible:outline-none leading-tight"
              placeholder="Titre de la tâche"
            />
          </DialogTitle>{' '}
          <DialogDescription className="sr-only">Modifier le nom de la task</DialogDescription>
        </DialogHeader>
        <section className="flex gap-4 w-full">
          <div className="space-y-6 flex-1 min-w-[70%]">
            {/* LABELS */}
            <Etiquettes
              editedTask={editedTask}
              removeTag={removeTag}
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
            />
            {/* Description */}
            {/* Ajouter le MARKDOWN */}
            <div className="space-y-2 flex-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="rezize-none min-h-[370px]"
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                // rows={4}
              />
            </div>
          </div>
          <aside className="flex-1 flex flex-col gap-4 items-end">
            {/* Assignee Users to Task */}
            <SelectUser editedTask={editedTask} setEditedTask={setEditedTask} users={users} />
            {/* Date Due */}
            <DateComponent editedTask={editedTask} setEditedTask={setEditedTask} />

            <Price editedTask={editedTask} setEditedTask={setEditedTask} />
          </aside>
        </section>{' '}
        {/* Actions */}
        <div className="flex gap-4 justify-between pt-4">
          <div className="flex gap-2">
            <Button onClick={handleSave}>Sauvegarder</Button>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>{' '}
          <Button variant="destructive" onClick={handleDelete} className="w-fit">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
type EtiquettesProps = {
  editedTask: TaskWithAssigneeAndTags
  removeTag: (tagName: string) => void
  newTag: string
  setNewTag: React.Dispatch<React.SetStateAction<string>>
  addTag: () => void
}

export function Etiquettes({ editedTask, removeTag, newTag, setNewTag, addTag }: EtiquettesProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAdd = () => {
    if (newTag.trim()) {
      addTag()
      setIsOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {editedTask.tags.map((tag) => {
          const label: LabelType = tag.label

          if (!label) return null

          return (
            <Badge
              key={label.name}
              variant="secondary"
              className="cursor-pointer text-sm rounded-none p-2 capitalize"
            >
              {label.name}
              <button onClick={() => removeTag(label.name)} className="ml-1 hover:text-red-600">
                x
              </button>
            </Badge>
          )
        })}

        {/* Modale déclenchée par ce bouton */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-fit h-full self-end rounded-none shadow-none"
              onClick={() => setIsOpen(true)}
            >
              +
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle étiquette</DialogTitle>
              <DialogDescription className="sr-only">
                Donnez un nom à la nouvelle étiquette à ajouter.
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-2">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdd()
                  }
                }}
                placeholder="Nouvelle étiquette"
                className="pl-10"
              />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleAdd} disabled={!newTag.trim()}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

type PriceProps = {
  editedTask: TaskWithAssigneeAndTags
  setEditedTask: (taks: TaskWithAssigneeAndTags) => void
}
const Price = ({ editedTask, setEditedTask }: PriceProps) => {
  return (
    <div className="space-y-2">
      <Label className="w-fit text-right ml-auto" htmlFor="Price">
        Prix (€)
      </Label>
      <div className="relative  w-40">
        <EuroIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="price"
          type="number"
          value={editedTask.price || ''}
          onChange={(e) => {
            const value = e.target.value
            const numericValue = Number(value)

            if (value === '' || (!isNaN(numericValue) && numericValue <= 99999)) {
              setEditedTask({
                ...editedTask,
                price: value ? numericValue : null
              })
            }
          }}
          onWheel={(e) => e.currentTarget.blur()} // empêche la molette
          onKeyDown={(e) => {
            const invalidKeys = ['e', 'E', '+', '-', '.']
            if (invalidKeys.includes(e.key)) {
              e.preventDefault()
            }
          }}
          className="pl-10"
          min={0}
          max={99999}
          step={1}
        />
      </div>
    </div>
  )
}
const DateComponent = ({ editedTask, setEditedTask }: PriceProps) => {
  const formatted = editedTask.dueDate
    ? new Date(editedTask.dueDate).toLocaleDateString('fr-FR')
    : ''

  return (
    <div className="space-y-2 flex flex-col w-40">
      <Label className="w-fit text-right ml-auto text-sm">Date d’échéance</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left pl-10">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {editedTask.dueDate ? (
              // format(editedTask.dueDate, 'dd/MM/yyyy')
              formatted
            ) : (
              <span className="text-muted-foreground">Date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            // className="w-full"
            selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
            onSelect={(selected) =>
              setEditedTask({
                ...editedTask,
                dueDate: selected ?? null // transforme undefined → null
              })
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

type SelectUserProps = PriceProps & {
  users: User[]
}
const SelectUser = ({ editedTask, setEditedTask, users }: SelectUserProps) => {
  return (
    <div className="space-y-2">
      <Label className="w-fit text-right ml-auto text-sm" htmlFor="assignee">
        Assigné à
      </Label>
      <div className="relative">
        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Select
          value={editedTask.assigneeId || 'none'}
          onValueChange={(value) =>
            setEditedTask({
              ...editedTask,
              assigneeId: value ?? null
            })
          }
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

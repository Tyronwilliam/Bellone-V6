'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Calendar, Clock, DollarSign, UserIcon, Building2, Tag, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Client, Task, User } from '../type'

interface TaskDetailsModalProps {
  task: Task | null
  users: User[]
  clients: Client[]
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
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
  const [editedTask, setEditedTask] = useState<Task | null>(null)
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
    if (newTag.trim() && !editedTask.tags.includes(newTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter((tag) => tag !== tagToRemove)
    })
  }

  const assignee = users.find((u) => u.id === editedTask.assigneeId)
  const client = clients.find((c) => c.id === editedTask.client_id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la tâche</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={4}
            />
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  value={editedTask.price || ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      price: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="duration">Durée estimée</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="duration"
                  value={editedTask.duration || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, duration: e.target.value })}
                  placeholder="ex: 2h, 1j"
                  className="pl-10"
                />
              </div>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={editedTask.dueDate || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assigné à</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={editedTask.assigneeId || 'none'}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      assigneeId: value === 'none' ? undefined : value
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
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select
                value={editedTask.client_id || 'none'}
                onValueChange={(value) =>
                  setEditedTask({ ...editedTask, client_id: value === 'none' ? undefined : value })
                }
              >
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Étiquettes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedTask.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Nouvelle étiquette"
                  className="pl-10"
                />
              </div>
              <Button onClick={addTag} variant="outline">
                Ajouter
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSave}>Sauvegarder</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

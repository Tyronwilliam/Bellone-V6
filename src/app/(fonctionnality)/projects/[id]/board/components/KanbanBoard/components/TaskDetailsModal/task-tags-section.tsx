'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskTagsSectionProps {
  tags: any[]
  newTagName: string
  onNewTagNameChange: (name: string) => void
  onAddTag: () => void
  onRemoveTag: (tagId: string) => void
  isLoading?: boolean
}

export function TaskTagsSection({
  tags,
  newTagName,
  onNewTagNameChange,
  onAddTag,
  onRemoveTag,
  isLoading = false
}: TaskTagsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag()
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Étiquettes</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag: any) => {
          if (!tag.label) return null

          const tagColor = tag.label.color
          const tagName = tag.label.name
          const tagId = tag.label.id

          return (
            <Badge
              key={tagId}
              variant="secondary"
              className={cn(
                'cursor-pointer text-sm rounded-none p-2 capitalize',
                tagColor && `bg-[${tagColor}]`
              )}
              style={tagColor ? { backgroundColor: tagColor } : undefined}
            >
              {tagName}
              <button
                onClick={() => onRemoveTag(tagId)}
                className="ml-1 hover:text-red-600"
                disabled={isLoading}
              >
                ×
              </button>
            </Badge>
          )
        })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-fit h-full self-end rounded-none shadow-none bg-transparent"
              disabled={isLoading}
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
                value={newTagName}
                onChange={(e) => onNewTagNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Nouvelle étiquette"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleAddTag} disabled={!newTagName.trim() || isLoading}>
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

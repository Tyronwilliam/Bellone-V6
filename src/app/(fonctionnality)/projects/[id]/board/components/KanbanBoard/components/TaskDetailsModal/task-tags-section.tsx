'use client'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import NewTag from './NewTag'

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
  return (
    <div className="space-y-2">
      <Label>Labels</Label>
      <div className="flex flex-wrap gap-2 mb-2 overflow-scroll">
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

        {/* NEW TAG */}
        <NewTag
          newTagName={newTagName}
          onNewTagNameChange={onNewTagNameChange}
          onAddTag={onAddTag}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

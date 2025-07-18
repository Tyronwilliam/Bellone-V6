'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TaskTagsSectionProps {
  tags: any[]
  onRemoveTag: (tagId: string) => void
  isLoading?: boolean
}

export function TaskTagsSection({ tags, onRemoveTag, isLoading = false }: TaskTagsSectionProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2 ">
      {tags?.map((tag: any) => {
        if (!tag.label) return null

        const tagColor = tag?.label.color
        const tagName = tag?.label.name
        const tagId = tag?.label.id

        return (
          <Badge
            key={tagId}
            variant="secondary"
            className={cn('cursor-pointer text-sm rounded-none p-2 capitalize')}
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
    </div>
  )
}

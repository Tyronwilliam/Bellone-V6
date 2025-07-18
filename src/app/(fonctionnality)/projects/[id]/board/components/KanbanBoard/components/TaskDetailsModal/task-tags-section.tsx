'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import CustomBadge from './CustomBadge'
import { TaskTag } from '@/infrastructure/board/boardInterface'

interface TaskTagsSectionProps {
  tags: TaskTag[]
  onRemoveTag: (tagId: string) => void
  isModal: boolean
  badgeClassName: string
  isLoading?: boolean
}

export function TaskTagsSection({
  tags,
  onRemoveTag,
  isModal,
  badgeClassName,
  isLoading = false
}: TaskTagsSectionProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2 ">
      {tags?.map((tag: any) => {
        if (!tag.label) return null

        const tagColor = tag?.label.color
        const tagName = tag?.label.name
        const tagId = tag?.label.id

        return (
          <CustomBadge tagColor={tagColor ? tagColor : ''} key={tagId} className={badgeClassName}>
            {tagName}
            {isModal && (
              <button
                onClick={() => onRemoveTag(tagId)}
                className="ml-1 hover:text-red-600"
                disabled={isLoading}
              >
                ×
              </button>
            )}
          </CustomBadge>
        )
      })}
    </div>
  )
}

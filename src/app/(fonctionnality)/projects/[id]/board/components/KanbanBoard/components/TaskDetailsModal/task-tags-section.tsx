'use client'

import { TaskTag } from '@/infrastructure/board/boardInterface'
import { Label } from '@prisma/prisma'
import CustomBadge from './CustomBadge'

interface TaskTagsSectionProps {
  tags: TaskTag[]
  onRemoveTag: (tagId: string) => void
  isModal: boolean
  badgeClassName: string
  children: React.ReactNode
  onClickBadge?: (tag: Label) => void
  isLoading?: boolean
}

export function TaskTagsSection({
  tags,
  onRemoveTag,
  isModal,
  badgeClassName,
  isLoading = false,
  onClickBadge,
  children,
  ...props
}: TaskTagsSectionProps) {
  return (
    <div className="relative flex flex-wrap gap-2 mb-2 ">
      {tags?.map((tag: any) => {
        if (!tag.label) return null

        const tagColor = tag?.label.color
        const tagName = tag?.label.name
        const tagId = tag?.label.id

        return (
          <CustomBadge
            tagColor={tagColor ? tagColor : ''}
            key={tagId}
            className={badgeClassName}
            onClick={() => onClickBadge && onClickBadge(tag.label)}
            {...props}
          >
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
      {children}
    </div>
  )
}

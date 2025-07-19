import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import CustomBadge from './CustomBadge'
import { cn } from '@/lib/utils'
import PreviewLabel from './preview-badge'

export const LABEL_COLORS = [
  { name: 'Bleu', hex: '#3b82f6' },
  { name: 'Rouge', hex: '#ef4444' },
  { name: 'Vert', hex: '#10b981' },
  { name: 'Jaune', hex: '#facc15' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#ec4899' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Lime', hex: '#84cc16' },
  { name: 'Chocolat', hex: '#a16207' },
  { name: 'Gris foncé', hex: '#6b7280' }
]

export default function TagColorPicker({
  tagName,
  newColor,
  setNewColor,
  className
}: {
  tagName: string
  newColor: string
  setNewColor: Dispatch<SetStateAction<string>>
  className?: string
}) {
  return (
    <>
      <PreviewLabel newTagName={tagName} newColor={newColor} setNewColor={setNewColor} />
      <div className={cn('flex flex-wrap w-full h-fit justify-center gap-6 mt-6', className)}>
        {LABEL_COLORS?.map((color) => {
          return (
            <Tooltip key={color.name}>
              <TooltipTrigger asChild className="">
                <Button
                  className={`w-26 h-6 shrink-0`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    setNewColor(color.hex)
                  }}
                ></Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{color.name}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </>
  )
}

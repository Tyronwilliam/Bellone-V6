import React, { Dispatch, SetStateAction } from 'react'
import CustomBadge from './CustomBadge'
import { cn } from 'lib/utils/classnames'
import { Button } from '@/components/ui/button'

interface PreviewLabelProps {
  newTagName: string
  newColor: string
  setNewColor: Dispatch<SetStateAction<string>>
}
export default function PreviewLabel({ newTagName, setNewColor, newColor }: PreviewLabelProps) {
  return (
    (newTagName !== '' || newColor !== '') && (
      <CustomBadge tagColor={newColor} variant="outline" className={cn('mt-2 p-0')}>
        <Button
          className={`w-full h-full shrink-0  capitalize border-none py-2 rounded-none`}
          style={{
            ...(newColor ? { backgroundColor: newColor } : { backgroundColor: 'transparent' })
          }}
          onClick={() => {
            setNewColor('')
          }}
        >
          {newTagName}
        </Button>{' '}
      </CustomBadge>
    )
  )
}

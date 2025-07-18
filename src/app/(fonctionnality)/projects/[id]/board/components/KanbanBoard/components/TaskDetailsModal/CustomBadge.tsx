import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import React from 'react'

interface CustomBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tagColor?: string
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline'
}

export default function CustomBadge({
  tagColor,
  children,
  className,
  variant = 'secondary',
  ...props
}: CustomBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn('cursor-pointer text-sm rounded-none capitalize ', className)}
      style={{
        ...(tagColor ? { backgroundColor: tagColor } : {}),
        color: 'var(--foreground)'
      }}
      {...props}
    >
      {children}
    </Badge>
  )
}

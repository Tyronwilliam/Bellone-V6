'use client'

import { useEffect, useState } from 'react'
import { KanbanBoard } from '@/app/(fonctionnality)/projects/[id]/board/components/KanbanBoard/KanbanBoard'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from 'next-auth'
import { KanbanData } from '@/infrastructure/board/boardInterface'

interface ClientKanbanWrapperProps {
  initialData: KanbanData
  userConnected: User
}

export function ClientKanbanWrapper({ initialData, userConnected }: ClientKanbanWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-80 flex-shrink-0">
              <Skeleton className="h-10 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <KanbanBoard initialData={initialData} userConnected={userConnected} />
}

'use client'

import { formatDate } from '@/app/utils/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FullProject } from '@/infrastructure/project/projectQueries'
import { Kanban } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Entete({ project }: { project: FullProject }) {
  const router = useRouter()

  if (!project) return

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground mt-2">{project.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">Créé le {formatDate(project.created_at)}</Badge>
          <Badge variant="outline">
            {project.boards.length} board{project.boards.length > 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline">
            {project.members.length} membre{project.members.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push(`/projects/${project.id}/settings`)}>
          Paramètres
        </Button>
        <Button onClick={() => router.push(`/projects/${project.id}/board`)}>
          <Kanban className="mr-2 h-4 w-4" />
          Ouvrir le board
        </Button>
      </div>
    </div>
  )
}

import { getKanbanData } from '@/infrastructure/board/queries'
import { ClientKanbanWrapper } from './components/KanbanBoard/components/ClientKanbanBoard'
import { requireAuth } from 'auth-utils'

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireAuth()
  const projectId = id
  try {
    const board = await getKanbanData(projectId)

    if (board === null) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Aucun board assigné</p>
        </div>
      )
    }
    return <ClientKanbanWrapper initialData={board} />
  } catch (error) {
    console.error('Erreur lors du chargement du board:', error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Une erreur est survenue lors du chargement du board.</p>
      </div>
    )
  }
}

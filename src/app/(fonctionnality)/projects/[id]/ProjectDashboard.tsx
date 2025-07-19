'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FullProject } from '@/infrastructure/project/projectQueries'
import { Kanban, Plus } from 'lucide-react'
import type { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import ClientInformation from './components/ClientInformation'
import Entete from './components/Entete'
import { FinancialOverview } from './components/FinancialOverview'
import MembersInformation from './components/MembersInformation'
import StatisticGeneral from './components/StatisticGeneral'

export interface StatsTask {
  total: number
  completed: number
  inProgress: number
  overdue: number
}
export interface FinancialStatTask {
  totalQuoted: number
  totalInvoiced: number
  totalPaid: number
  pendingPayments: number
  quotesAccepted: number
  invoicesPaid: number
}
interface ProjectDashboardProps {
  project: FullProject
  taskStats: StatsTask
  financialStats: FinancialStatTask
  session: Session
}

export function ProjectDashboard({
  project,
  taskStats,
  financialStats,
  session
}: ProjectDashboardProps) {
  const router = useRouter()

  if (!project) return

  const isProjectAdmin = project.members?.some(
    (member) => member.role === 'admin' && member.userId === session.user!.id
  )
  return (
    <div className="space-y-6">
      {/* En-tête du projet */}
      <Entete project={project} />

      {/* Statistiques principales */}
      <StatisticGeneral taskStats={taskStats} financialStats={financialStats} project={project} />
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations client */}
        <ClientInformation project={project} isProjectAdmin={isProjectAdmin} />
        {/* Équipe du projet */}
        <MembersInformation project={project} />
      </div>
      {/* Finances */}
      <FinancialOverview project={project} financialStats={financialStats} />
      {/* Boards et activité récente */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Kanban className="h-5 w-5" />
              Boards du projet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.boards.map((board: any) => (
                <div
                  key={board.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{board.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {board.columns.length} colonnes •{' '}
                      {board.columns.reduce((sum: number, col: any) => sum + col.tasks.length, 0)}{' '}
                      tâches
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/projects/${project.id}/board`)}
                  >
                    Ouvrir
                  </Button>
                </div>
              ))}
              {project.boards.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Kanban className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun board créé</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un board
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              Ici vous pourriez ajouter un feed d'activité
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

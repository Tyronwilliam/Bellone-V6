'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FullProject } from '@/infrastructure/project/projectQueries'
import { AlertTriangle, CheckCircle, Clock, Euro } from 'lucide-react'
import { FinancialStatTask, StatsTask } from '../ProjectDashboard'
import { formatCurrency } from '@/app/utils/format'
export default function StatisticGeneral({
  taskStats,
  project,
  financialStats
}: {
  taskStats: StatsTask
  financialStats: FinancialStatTask
  project: FullProject
}) {
  if (!project) return

  const completionPercentage =
    taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tâches totales</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{taskStats.total}</div>
          <p className="text-xs text-muted-foreground">
            {taskStats.completed} terminées ({Math.round(completionPercentage)}%)
          </p>
          <Progress value={completionPercentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{taskStats.inProgress}</div>
          <p className="text-xs text-muted-foreground">Tâches en progression</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En retard</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
          <p className="text-xs text-muted-foreground">Tâches dépassées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(financialStats.totalPaid, project.client.currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(financialStats.pendingPayments, project.client.currency)} en attente
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

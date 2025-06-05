'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Euro,
  FileText,
  Receipt,
  CreditCard,
  Users,
  Kanban,
  Plus,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  MapPin
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Session } from 'next-auth'

interface ProjectDashboardProps {
  project: any
  taskStats: {
    total: number
    completed: number
    inProgress: number
    overdue: number
  }
  financialStats: {
    totalQuoted: number
    totalInvoiced: number
    totalPaid: number
    pendingPayments: number
    quotesAccepted: number
    invoicesPaid: number
  }
  session: Session
}

export function ProjectDashboard({
  project,
  taskStats,
  financialStats,
  session
}: ProjectDashboardProps) {
  const router = useRouter()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: project.client.currency || 'EUR'
    }).format(amount)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const completionPercentage =
    taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0

  return (
    <div className="space-y-6">
      {/* En-tête du projet */}
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

      {/* Statistiques principales */}
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
            <div className="text-2xl font-bold">{formatCurrency(financialStats.totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(financialStats.pendingPayments)} en attente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {project.client.type === 'COMPANY' ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
              Informations client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">
                {project.client.firstName} {project.client.lastName}
              </h3>
              {project.client.companyName && (
                <p className="text-sm text-muted-foreground">{project.client.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{project.client.email}</span>
              </div>
              {project.client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{project.client.phone}</span>
                </div>
              )}
              {project.client.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={project.client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.client.website}
                  </a>
                </div>
              )}
              {project.client.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {project.client.address}, {project.client.city} {project.client.postalCode}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {project.client.user ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Compte utilisateur lié
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                  Sans compte utilisateur
                </Badge>
              )}
              <Badge variant="outline">
                {project.client.type === 'COMPANY' ? 'Entreprise' : 'Particulier'}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/clients/${project.client.id}`)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir le profil client
            </Button>
          </CardContent>
        </Card>

        {/* Équipe du projet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Équipe du projet
            </CardTitle>
            <CardDescription>{project.members.length} membres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.members.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {member.user.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un membre
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Finances */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Devis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total devisé</span>
                <span className="font-medium">{formatCurrency(financialStats.totalQuoted)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Devis acceptés</span>
                <span className="font-medium">{financialStats.quotesAccepted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total devis</span>
                <span className="font-medium">{project.quotes.length}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau devis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total facturé</span>
                <span className="font-medium">{formatCurrency(financialStats.totalInvoiced)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Factures payées</span>
                <span className="font-medium">{financialStats.invoicesPaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total factures</span>
                <span className="font-medium">{project.invoices.length}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle facture
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total encaissé</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(financialStats.totalPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">En attente</span>
                <span className="font-medium text-orange-600">
                  {formatCurrency(financialStats.pendingPayments)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Taux de recouvrement</span>
                <span className="font-medium">
                  {financialStats.totalInvoiced > 0
                    ? Math.round((financialStats.totalPaid / financialStats.totalInvoiced) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Enregistrer un paiement
            </Button>
          </CardContent>
        </Card>
      </div>

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
                    onClick={() =>
                      router.push(`/projects/${project.id}/board`)
                    }
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

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Ici vous pourriez ajouter un feed d'activité */}
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

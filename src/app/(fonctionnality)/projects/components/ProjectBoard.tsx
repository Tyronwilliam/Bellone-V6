'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import mockData from '@/utils/mockData.json'
import { Building2, CalendarDays, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Types basés sur votre schéma de base de données
interface Project {
  id: string
  name: string
  description: string | null
  client_id: string
  created_at: string
}

const mockProjects: Project[] = mockData.projects
// Données mockées pour la démonstration

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ProjectsBoard() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
        <p className="text-muted-foreground mt-2">Gérez et consultez tous vos projets en cours</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Liste des Projets
          </CardTitle>
          <CardDescription>
            {mockProjects.length} projet{mockProjects.length > 1 ? 's' : ''} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[120px]">Client ID</TableHead>
                  <TableHead className="w-[150px]">Date de création</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/projects/${project.id}/board`)}
                  >
                    <TableCell className="font-mono text-sm">{project.id}</TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {project.description ? (
                        <span className="text-sm text-muted-foreground">
                          {project.description.length > 80
                            ? `${project.description.substring(0, 80)}...`
                            : project.description}
                        </span>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Aucune description
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-xs">{project.client_id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(project.created_at)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projets</p>
                <p className="text-2xl font-bold">{mockProjects.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clients Uniques</p>
                <p className="text-2xl font-bold">
                  {new Set(mockProjects.map((p) => p.client_id)).size}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ce Mois</p>
                <p className="text-2xl font-bold">
                  {
                    mockProjects.filter(
                      (p) => new Date(p.created_at).getMonth() === new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

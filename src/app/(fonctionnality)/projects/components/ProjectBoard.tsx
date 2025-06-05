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
import { Building2, CalendarDays, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Project } from '@prisma/prisma'
import { Client } from '@prisma/prisma'
import { useEffect, useState } from 'react'
import CreateProject from './CreateProject'
import { Button } from '@/components/ui/button'

export type ProjectAndClient = Project & { client: Client }
export type PartialClient = {
  id: string
  email: string
  firstName: string
  companyName: string | null
}
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
type ProjectBoardProps = {
  projects: ProjectAndClient[]
  clients?: PartialClient[]
}

export default function ProjectsBoard({ projects, clients }: ProjectBoardProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    console.log(projects, 'PROJECTS')
  }, [])
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
        <p className="text-muted-foreground mt-2">Gérez et consultez tous vos projets en cours</p>
        {!isOpen && (
          <Button type="button" className="w-fit" onClick={() => setIsOpen(true)}>
            Créer un nouveau projet
          </Button>
        )}{' '}
      </div>

      {isOpen && (
        <section className="absolute w-full h-full left-1/2 -translate-x-1/2 bg-accent-background z-50">
          <div>
            <CreateProject clients={clients} closeAsModal={() => setIsOpen(false)} />
          </div>
        </section>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Liste des Projets
          </CardTitle>
          <CardDescription>
            {projects.length} projet{projects.length > 1 ? 's' : ''} au total
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
                  <TableHead className="w-[120px]">Client</TableHead>
                  <TableHead className="w-[150px]">Date de création</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: ProjectAndClient, index) => (
                  <TableRow
                    key={project.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/projects/${project.id}/board`)}
                  >
                    <TableCell className="font-mono text-sm">{index + 1}</TableCell>
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
                        <span className="font-mono text-xs">{project.client.firstName}</span>
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
                <p className="text-2xl font-bold">{projects.length}</p>
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
                  {new Set(projects.map((p) => p.client_id)).size}
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
                    projects.filter(
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

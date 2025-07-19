'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FullProject } from '@/infrastructure/project/projectQueries'
import { Session, User } from 'next-auth'
import { Building2, ExternalLink, Globe, Mail, MapPin, Phone, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from 'lib/utils/classnames'

export default function ClientInformation({
  project,
  isProjectAdmin
}: {
  project: FullProject
  isProjectAdmin: boolean
}) {
  if (!project) return
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {project.client.type === 'COMPANY' ? (
            <Building2 className="h-5 w-5" />
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
          Informations client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">
            {project.client.firstName}

            {isProjectAdmin && project.client.lastName}
          </h3>
          {project.client.companyName && (
            <p className="text-sm text-muted-foreground">{project.client.companyName}</p>
          )}
        </div>

        <div className="space-y-2">
          {isProjectAdmin && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{project.client.email}</span>
            </div>
          )}
          {project.client.phone && isProjectAdmin && (
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
            <div
              className={cn(
                'flex items-center gap-2 text-sm',
                !isProjectAdmin ? 'blur-sm pointer-events-none select-none' : ''
              )}
            >
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
        {isProjectAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/clients/${project.client.id}`)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir le profil client
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FullProject } from '@/infrastructure/project/projectQueries'
import {
    Plus,
    Users
} from 'lucide-react'

export default function MembersInformation({ project }: { project: FullProject }) {
  if (!project) return

  return (
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
  )
}

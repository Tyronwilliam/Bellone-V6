// app/projects/page.tsx
import { prisma } from '@/infrastructure/prisma'
import { requireAuth } from 'auth-utils'
import { getAllClientsCreatedByUser } from './action'
import { CreateProject } from './components/CreateProject'
import ProjectsBoard from './components/ProjectBoard'

export const revalidate = 60

export default async function ProjectsPage() {
  const session = await requireAuth()
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          //Session is always true since requireAuth redirect to signIn if no session
          userId: session.user!.id
        }
      }
    },
    include: {
      client: true,
      members: {
        include: {
          user: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  })
  const { clients } = await getAllClientsCreatedByUser()

  if (projects.length === 0 && clients) return <CreateProject clients={clients} />

  return <ProjectsBoard projects={projects} clients={clients} />
}

// app/projects/page.tsx
import { prisma } from '@/lib/prisma'
import { requireAuth } from 'auth-utils'
import ProjectsBoard, { PartialClient } from './components/ProjectBoard'
import { getAllClientsCreatedByUser } from './action'
import CreateProject from './components/CreateProject'

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
    }
  })
  const { clients } = await getAllClientsCreatedByUser()
  console.log(clients, 'CLIENT ')

  if (projects.length === 0 && clients) return <CreateProject clients={clients}  />

  return <ProjectsBoard projects={projects} clients={clients} />
}

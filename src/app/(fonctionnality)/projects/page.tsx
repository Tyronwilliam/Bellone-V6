// app/projects/page.tsx
import { prisma } from '@/lib/prisma'
import ProjectsBoard from './components/ProjectBoard/ProjectBoard'

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: true
    }
  })

  return <ProjectsBoard projects={projects} />
}

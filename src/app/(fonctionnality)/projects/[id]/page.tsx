import { findUniqueProject, FullProject } from '@/infrastructure/project/projectQueries'
import { requireAuth } from 'auth-utils'
import { redirect } from 'next/navigation'
import { ProjectDashboard } from './ProjectDashboard'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await requireAuth()

  const { id: projectId } = await params

  //   const hasAccess = await verifyProjectAccess(projectId, session.user!.id)
  //   if (!hasAccess) {
  //     redirect('/projects?error=access-denied')
  //   }

  try {
    const project: FullProject = await findUniqueProject(projectId)
    if (!project) {
      redirect('/projects?error=not-found')
    }

    //  les statistiques des tâches
    const allTasks = project.boards.flatMap((board) =>
      board.columns.flatMap((column) => column.tasks)
    )

    const taskStats = {
      total: allTasks.length,
      completed: allTasks.filter((task) => task.done === true).length,
      inProgress: allTasks.filter((task) => task.done !== true).length,
      overdue: allTasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date()).length
    }

    //  les statistiques financières
    const financialStats = {
      totalQuoted: project.quotes.reduce((sum, quote) => sum + quote.totalAmount, 0),
      totalInvoiced: project.invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0),
      totalPaid: project.invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0),
      pendingPayments: project.invoices.reduce(
        (sum, invoice) => sum + (invoice.totalAmount - invoice.paidAmount),
        0
      ),
      quotesAccepted: project.quotes.filter((quote) => quote.status === 'ACCEPTED').length,
      invoicesPaid: project.invoices.filter((invoice) => invoice.status === 'PAID').length
    }

    return (
      <ProjectDashboard
        project={project}
        taskStats={taskStats}
        financialStats={financialStats}
        session={session}
      />
    )
  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error)
    redirect('/projects?error=server-error')
  }
}

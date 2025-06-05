import { prisma } from '@/lib/prisma'
import { requireAuth } from 'auth-utils'
import { redirect } from 'next/navigation'
import { ProjectDashboard } from './components/ProjectDashboard'

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
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          include: {
            user: true // Si le client a un compte utilisateur
          }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        boards: {
          include: {
            columns: {
              include: {
                tasks: {
                  include: {
                    assignee: {
                      select: { id: true, name: true, avatar: true }
                    },
                    tags: {
                      include: {
                        label: true
                      }
                    }
                  }
                }
              },
              orderBy: { order: 'asc' }
            },
            _count: {
              select: { columns: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        quotes: {
          include: {
            items: true,
            _count: {
              select: { items: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          include: {
            items: true,
            payments: true,
            _count: {
              select: { items: true, payments: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        labels: {
          include: {
            label: true
          },
          where: {
            isFavorite: true
          },
          take: 10
        }
      }
    })

    if (!project) {
      redirect('/projects?error=not-found')
    }

    //  les statistiques des tâches
    const allTasks = project.boards.flatMap((board) =>
      board.columns.flatMap((column) => column.tasks)
    )

    const taskStats = {
      total: allTasks.length,
      completed: allTasks.filter((task) => {
        // Supposons que les tâches dans la dernière colonne sont terminées
        const lastColumnIndex = Math.max(
          ...project.boards.flatMap((board) => board.columns.map((col) => col.order))
        )
        const taskColumn = project.boards
          .flatMap((board) => board.columns)
          .find((col) => col.id === task.columnId)
        return taskColumn?.order === lastColumnIndex
      }).length,
      inProgress: allTasks.filter((task) => {
        const taskColumn = project.boards
          .flatMap((board) => board.columns)
          .find((col) => col.id === task.columnId)
        return (
          taskColumn?.order !== 0 &&
          taskColumn?.order !==
            Math.max(...project.boards.flatMap((board) => board.columns.map((col) => col.order)))
        )
      }).length,
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

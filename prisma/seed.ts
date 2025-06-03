import { prisma } from '@/lib/prisma'

async function main() {
  // USERS
  const alice = await prisma.user.create({
    data: {
      email: 'alice@acme.com',
      name: 'Alice Martin',
      role: 'client',
      created_at: new Date('2024-10-01T08:00:00Z')
    }
  })

  const max = await prisma.user.create({
    data: {
      email: 'max@freelance.dev',
      name: 'Max Durand',
      role: 'developer',
      created_at: new Date('2024-11-12T10:30:00Z')
    }
  })

  const sophie = await prisma.user.create({
    data: {
      email: 'sophie@designx.com',
      name: 'Sophie Lemay',
      role: 'client',
      created_at: new Date('2024-11-15T09:00:00Z')
    }
  })

  const leo = await prisma.user.create({
    data: {
      email: 'leo@studio.dev',
      name: 'Leo Petit',
      role: 'designer',
      created_at: new Date('2024-12-01T15:45:00Z')
    }
  })

  // CLIENTS
  const acme = await prisma.client.create({
    data: {
      company: 'Acme Corp',
      name: 'Alice Martin',
      contact_id: alice.id
    }
  })

  const designx = await prisma.client.create({
    data: {
      company: 'DesignX Agency',
      name: 'Sophie Lemay',
      contact_id: sophie.id
    }
  })

  // PROJECTS
  const project1 = await prisma.project.create({
    data: {
      name: 'Refonte site vitrine',
      description: "Rework du site d'Acme Corp",
      client_id: acme.id,
      created_at: new Date('2024-12-10T12:00:00Z')
    }
  })

  await prisma.project.create({
    data: {
      name: 'Développement Front SASS',
      description: 'Rework du site DesignX Agency',
      client_id: designx.id,
      created_at: new Date('2024-12-10T12:00:00Z')
    }
  })

  // PROJECT MEMBERS
  await prisma.projectMember.createMany({
    data: [
      { user_id: max.id, projectId: project1.id },
      { user_id: leo.id, projectId: project1.id }
    ]
  })

  // BOARD
  const board = await prisma.board.create({
    data: {
      name: 'Développement Front',
      projectId: project1.id,
      created_by_id: max.id
    }
  })

  // COLUMNS
  await prisma.column.createMany({
    data: [
      { name: 'À faire', position: 1, boardId: board.id, order: 0 },
      { name: 'En cours', position: 2, boardId: board.id, order: 1 },
      { name: 'En attente', position: 3, boardId: board.id, order: 2 },
      { name: 'Terminé', position: 4, boardId: board.id, order: 3 }
    ]
  })

  const columns = await prisma.column.findMany({
    where: { boardId: board.id },
    orderBy: { position: 'asc' }
  })

  const col1 = columns[0]
  const col3 = columns[2]

  // TASKS
  const task1 = await prisma.task.create({
    data: {
      columnId: col1.id,
      title: "Créer la page d'accueil",
      description: 'Maquettage + intégration responsive',
      price: 300,
      dueDate: null,
      assigneeId: max.id,
      client_id: acme.id,
      order: 0
    }
  })

  const task2 = await prisma.task.create({
    data: {
      columnId: col3.id,
      title: 'Ajouter formulaire de contact',
      description: 'Formulaire avec validation et envoi d’email',
      price: 120,
      dueDate: new Date('2025-01-08T00:00:00Z'),
      assigneeId: max.id,
      client_id: null,
      order: 0
    }
  })

  // LABELS
  await prisma.label.createMany({
    data: [
      { name: 'Prioritaire', color: '#ff0000' },
      { name: 'Client', color: '#00aaff' }
    ]
  })

  const labels = await prisma.label.findMany({ orderBy: { name: 'asc' } })
  const prioritaire = labels.find((l: any) => l.name === 'Prioritaire')!
  const clientLabel = labels.find((l: any) => l.name === 'Client')!

  // TASK_LABELS
  await prisma.taskLabel.createMany({
    data: [
      { task_id: task1.id, label_id: prioritaire.id },
      { task_id: task2.id, label_id: clientLabel.id }
    ]
  })

  console.log('✅ Seed terminé avec succès.')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Erreur dans le seed :', e)
    prisma.$disconnect().finally(() => process.exit(1))
  })

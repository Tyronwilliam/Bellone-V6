import {
  PrismaClient,
  ClientType,
  QuoteStatus,
  InvoiceStatus,
  PaymentMethod
} from './src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Fonction helper pour nettoyer une table si elle existe
  async function safeDeleteMany(modelName: string, deleteFunction: () => Promise<any>) {
    try {
      await deleteFunction()
      console.log(`✅ Table ${modelName} nettoyée`)
    } catch (error: any) {
      if (error.code === 'P2021') {
        console.log(`⚠️ Table ${modelName} n'existe pas encore, ignorée`)
      } else {
        throw error
      }
    }
  }

  // Nettoyer la base de données dans l'ordre des dépendances
  console.log('🧹 Nettoyage de la base de données...')

  await safeDeleteMany('Payment', () => prisma.payment.deleteMany())
  await safeDeleteMany('InvoiceItem', () => prisma.invoiceItem.deleteMany())
  await safeDeleteMany('Invoice', () => prisma.invoice.deleteMany())
  await safeDeleteMany('QuoteItem', () => prisma.quoteItem.deleteMany())
  await safeDeleteMany('Quote', () => prisma.quote.deleteMany())
  await safeDeleteMany('TaskLabel', () => prisma.taskLabel.deleteMany())
  await safeDeleteMany('Task', () => prisma.task.deleteMany())
  await safeDeleteMany('Column', () => prisma.column.deleteMany())
  await safeDeleteMany('ProjectLabel', () => prisma.projectLabel.deleteMany())
  await safeDeleteMany('Board', () => prisma.board.deleteMany())
  await safeDeleteMany('ProjectMember', () => prisma.projectMember.deleteMany())
  await safeDeleteMany('Project', () => prisma.project.deleteMany())
  await safeDeleteMany('Client', () => prisma.client.deleteMany())
  await safeDeleteMany('Label', () => prisma.label.deleteMany())
  await safeDeleteMany('Session', () => prisma.session.deleteMany())
  await safeDeleteMany('Account', () => prisma.account.deleteMany())
  await safeDeleteMany('VerificationToken', () => prisma.verificationToken.deleteMany())
  await safeDeleteMany('User', () => prisma.user.deleteMany())

  console.log('🧹 Base de données nettoyée')

  // 1. Créer des utilisateurs
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@bellone.com',
        name: 'Admin Bellone',
        role: 'admin',
        username: 'admin',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'john.doe@bellone.com',
        name: 'John Doe',
        role: 'developer',
        username: 'johndoe',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'marie.martin@bellone.com',
        name: 'Marie Martin',
        role: 'designer',
        username: 'mariemartin',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'paul.durand@bellone.com',
        name: 'Paul Durand',
        role: 'project_manager',
        username: 'pauldurand',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'client@acmecorp.com',
        name: 'Sophie Acme',
        role: 'client',
        username: 'sophieacme',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'contact@techstart.com',
        name: 'Marc TechStart',
        role: 'client',
        username: 'marctechstart',
        emailVerified: new Date()
      }
    })
  ])

  console.log('👥 Utilisateurs créés')

  // 2. Créer des clients (avec la nouvelle structure)
  const clients = await Promise.all([
    // Client entreprise avec compte utilisateur
    prisma.client.create({
      data: {
        type: ClientType.COMPANY,
        email: 'contact@acmecorp.com',
        firstName: 'Sophie',
        lastName: 'Acme',
        phone: '+33 1 23 45 67 89',
        companyName: 'Acme Corporation',
        siret: '12345678901234',
        vatNumber: 'FR12345678901',
        website: 'https://acmecorp.com',
        address: '123 Avenue des Champs-Élysées',
        city: 'Paris',
        postalCode: '75008',
        country: 'France',
        currency: 'EUR',
        taxRate: 20.0,
        userId: users[4].id, // Sophie Acme a un compte
        createdById: users[0].id, // Admin
        notes: 'Client principal, très réactif'
      }
    }),
    // Client entreprise sans compte utilisateur
    prisma.client.create({
      data: {
        type: ClientType.COMPANY,
        email: 'contact@techstart.com',
        firstName: 'Marc',
        lastName: 'Dubois',
        phone: '+33 2 34 56 78 90',
        companyName: 'TechStart Solutions',
        siret: '98765432109876',
        vatNumber: 'FR98765432109',
        website: 'https://techstart.com',
        address: '456 Rue de la Technologie',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France',
        currency: 'EUR',
        taxRate: 20.0,
        createdById: users[0].id, // Admin
        notes: 'Startup prometteuse, paiements rapides'
      }
    }),
    // Client particulier
    prisma.client.create({
      data: {
        type: ClientType.INDIVIDUAL,
        email: 'pierre.martin@gmail.com',
        firstName: 'Pierre',
        lastName: 'Martin',
        phone: '+33 6 12 34 56 78',
        address: '789 Rue des Particuliers',
        city: 'Marseille',
        postalCode: '13000',
        country: 'France',
        currency: 'EUR',
        taxRate: 0.0, // Pas de TVA pour les particuliers
        createdById: users[0].id, // Admin
        notes: 'Client particulier pour site vitrine'
      }
    }),
    // Client entreprise étrangère
    prisma.client.create({
      data: {
        type: ClientType.COMPANY,
        email: 'info@globaltech.be',
        firstName: 'Anna',
        lastName: 'Van Der Berg',
        phone: '+32 2 123 45 67',
        companyName: 'Global Tech Belgium',
        vatNumber: 'BE0123456789',
        website: 'https://globaltech.be',
        address: '100 Avenue Louise',
        city: 'Bruxelles',
        postalCode: '1000',
        country: 'Belgique',
        currency: 'EUR',
        taxRate: 21.0, // TVA belge
        createdById: users[0].id, // Admin
        notes: 'Client international, facturation en anglais'
      }
    })
  ])

  console.log('🏢 Clients créés')

  // 3. Créer des labels globaux
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: 'Urgent',
        color: '#ef4444',
        description: 'Tâche urgente à traiter en priorité',
        createdById: users[0].id,
        usageCount: 15
      }
    }),
    prisma.label.create({
      data: {
        name: 'Bug',
        color: '#dc2626',
        description: 'Correction de bug',
        createdById: users[1].id,
        usageCount: 23
      }
    }),
    prisma.label.create({
      data: {
        name: 'Feature',
        color: '#16a34a',
        description: 'Nouvelle fonctionnalité',
        createdById: users[1].id,
        usageCount: 18
      }
    }),
    prisma.label.create({
      data: {
        name: 'Design',
        color: '#8b5cf6',
        description: 'Tâche de design/UI/UX',
        createdById: users[2].id,
        usageCount: 12
      }
    }),
    prisma.label.create({
      data: {
        name: 'Backend',
        color: '#0ea5e9',
        description: 'Développement backend',
        createdById: users[1].id,
        usageCount: 20
      }
    }),
    prisma.label.create({
      data: {
        name: 'Frontend',
        color: '#06b6d4',
        description: 'Développement frontend',
        createdById: users[1].id,
        usageCount: 17
      }
    }),
    prisma.label.create({
      data: {
        name: 'Testing',
        color: '#f59e0b',
        description: 'Tests et validation',
        createdById: users[3].id,
        usageCount: 8
      }
    }),
    prisma.label.create({
      data: {
        name: 'Documentation',
        color: '#6b7280',
        description: 'Rédaction de documentation',
        createdById: users[3].id,
        usageCount: 5
      }
    }),
    prisma.label.create({
      data: {
        name: 'Review',
        color: '#ec4899',
        description: 'Révision et validation client',
        createdById: users[3].id,
        usageCount: 10
      }
    }),
    prisma.label.create({
      data: {
        name: 'Deployment',
        color: '#84cc16',
        description: 'Déploiement et mise en production',
        createdById: users[1].id,
        usageCount: 6
      }
    })
  ])

  console.log('🏷️ Labels créés')

  // 4. Créer des projets
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Site E-commerce Acme',
        description:
          "Développement d'une plateforme e-commerce complète avec panier et paiement en ligne",
        client_id: clients[0].id
      }
    }),
    prisma.project.create({
      data: {
        name: 'Application Mobile TechStart',
        description: 'Application mobile native pour la gestion des commandes et suivi client',
        client_id: clients[1].id
      }
    }),
    prisma.project.create({
      data: {
        name: 'Site Vitrine Pierre Martin',
        description: 'Site vitrine pour artisan menuisier avec galerie photos',
        client_id: clients[2].id
      }
    }),
    prisma.project.create({
      data: {
        name: 'API REST Global Tech',
        description: "Développement d'une API REST pour l'intégration avec des services tiers",
        client_id: clients[3].id
      }
    })
  ])

  console.log('📁 Projets créés')

  // 5. Créer des membres de projet
  const projectMembers = await Promise.all([
    // Projet 1 - Site E-commerce
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[0].id, // Admin
        role: 'admin'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[1].id, // John Doe
        role: 'developer'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[2].id, // Marie Martin
        role: 'designer'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[4].id, // Sophie Acme (client avec compte)
        role: 'client'
      }
    }),

    // Projet 2 - App Mobile
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[0].id, // Admin
        role: 'admin'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[1].id, // John Doe
        role: 'developer'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[3].id, // Paul Durand
        role: 'project_manager'
      }
    }),

    // Projet 3 - Site Vitrine (pas de membre client car pas de compte)
    prisma.projectMember.create({
      data: {
        projectId: projects[2].id,
        userId: users[0].id, // Admin
        role: 'admin'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[2].id,
        userId: users[2].id, // Marie Martin
        role: 'designer'
      }
    }),

    // Projet 4 - API REST
    prisma.projectMember.create({
      data: {
        projectId: projects[3].id,
        userId: users[0].id, // Admin
        role: 'admin'
      }
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[3].id,
        userId: users[1].id, // John Doe
        role: 'developer'
      }
    })
  ])

  console.log('👥 Membres de projet créés')

  // 6. Associer des labels aux projets avec personnalisations
  const projectLabels = await Promise.all([
    // Projet 1 - Site E-commerce
    prisma.projectLabel.create({
      data: {
        projectId: projects[0].id,
        labelId: labels[0].id, // Urgent
        addedById: users[0].id,
        isFavorite: true,
        colorOverride: '#ff0000' // Rouge plus vif
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[0].id,
        labelId: labels[1].id, // Bug
        addedById: users[1].id,
        isFavorite: false
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[0].id,
        labelId: labels[2].id, // Feature
        addedById: users[1].id,
        isFavorite: true,
        colorOverride: '#00aa00' // Vert personnalisé
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[0].id,
        labelId: labels[3].id, // Design
        addedById: users[2].id,
        isFavorite: true
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[0].id,
        labelId: labels[4].id, // Backend
        addedById: users[1].id,
        isFavorite: false
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[0].id,
        labelId: labels[5].id, // Frontend
        addedById: users[1].id,
        isFavorite: false
      }
    }),

    // Projet 2 - App Mobile
    prisma.projectLabel.create({
      data: {
        projectId: projects[1].id,
        labelId: labels[0].id, // Urgent
        addedById: users[0].id,
        isFavorite: true
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[1].id,
        labelId: labels[2].id, // Feature
        addedById: users[1].id,
        isFavorite: true
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[1].id,
        labelId: labels[6].id, // Testing
        addedById: users[3].id,
        isFavorite: false,
        colorOverride: '#ffa500' // Orange personnalisé
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[1].id,
        labelId: labels[8].id, // Review
        addedById: users[3].id,
        isFavorite: true
      }
    }),

    // Projet 3 - Site Vitrine
    prisma.projectLabel.create({
      data: {
        projectId: projects[2].id,
        labelId: labels[3].id, // Design
        addedById: users[2].id,
        isFavorite: true
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[2].id,
        labelId: labels[5].id, // Frontend
        addedById: users[2].id,
        isFavorite: false
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[2].id,
        labelId: labels[8].id, // Review
        addedById: users[0].id,
        isFavorite: false
      }
    }),

    // Projet 4 - API REST
    prisma.projectLabel.create({
      data: {
        projectId: projects[3].id,
        labelId: labels[4].id, // Backend
        addedById: users[1].id,
        isFavorite: true
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[3].id,
        labelId: labels[6].id, // Testing
        addedById: users[1].id,
        isFavorite: true
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[3].id,
        labelId: labels[7].id, // Documentation
        addedById: users[1].id,
        isFavorite: false,
        colorOverride: '#888888' // Gris personnalisé
      }
    }),
    prisma.projectLabel.create({
      data: {
        projectId: projects[3].id,
        labelId: labels[9].id, // Deployment
        addedById: users[1].id,
        isFavorite: false
      }
    })
  ])

  console.log('🏷️ Labels associés aux projets avec personnalisations')

  // 7. Créer des devis
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        number: 'QUO-2025-001',
        title: 'Devis Site E-commerce Acme',
        description:
          "Développement complet d'une plateforme e-commerce avec toutes les fonctionnalités modernes",
        clientId: clients[0].id,
        projectId: projects[0].id,
        status: QuoteStatus.ACCEPTED,
        subtotal: 15000,
        taxAmount: 3000,
        totalAmount: 18000,
        validUntil: new Date('2025-08-31'),
        sentAt: new Date('2025-06-01'),
        acceptedAt: new Date('2025-06-05'),
        createdById: users[0].id,
        notes: 'Devis accepté rapidement, client très motivé',
        terms: 'Paiement en 3 fois : 30% à la commande, 40% à mi-parcours, 30% à la livraison'
      }
    }),
    prisma.quote.create({
      data: {
        number: 'QUO-2025-002',
        title: 'Devis Application Mobile TechStart',
        description: 'Application mobile native iOS et Android',
        clientId: clients[1].id,
        projectId: projects[1].id,
        status: QuoteStatus.SENT,
        subtotal: 25000,
        taxAmount: 5000,
        totalAmount: 30000,
        validUntil: new Date('2025-07-31'),
        sentAt: new Date('2025-06-15'),
        createdById: users[0].id,
        notes: 'En attente de retour client',
        terms: 'Paiement en 4 fois selon avancement'
      }
    }),
    prisma.quote.create({
      data: {
        number: 'QUO-2025-003',
        title: 'Devis Site Vitrine Menuiserie',
        description: 'Site vitrine avec galerie photos et formulaire de contact',
        clientId: clients[2].id,
        projectId: projects[2].id,
        status: QuoteStatus.ACCEPTED,
        subtotal: 2500,
        taxAmount: 0, // Particulier, pas de TVA
        totalAmount: 2500,
        validUntil: new Date('2025-07-15'),
        sentAt: new Date('2025-06-10'),
        acceptedAt: new Date('2025-06-12'),
        createdById: users[0].id,
        notes: 'Client particulier, paiement comptant',
        terms: 'Paiement à la livraison'
      }
    })
  ])

  console.log('📋 Devis créés')

  // 8. Créer des lignes de devis
  const quoteItems = await Promise.all([
    // Devis 1 - E-commerce
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[0].id,
        description: 'Développement frontend React/Next.js',
        quantity: 1,
        unitPrice: 8000,
        totalPrice: 8000,
        order: 1
      }
    }),
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[0].id,
        description: 'Développement backend API REST',
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000,
        order: 2
      }
    }),
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[0].id,
        description: 'Intégration paiement Stripe',
        quantity: 1,
        unitPrice: 2000,
        totalPrice: 2000,
        order: 3
      }
    }),

    // Devis 2 - Mobile App
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[1].id,
        description: 'Développement application iOS',
        quantity: 1,
        unitPrice: 12000,
        totalPrice: 12000,
        order: 1
      }
    }),
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[1].id,
        description: 'Développement application Android',
        quantity: 1,
        unitPrice: 10000,
        totalPrice: 10000,
        order: 2
      }
    }),
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[1].id,
        description: 'API backend et synchronisation',
        quantity: 1,
        unitPrice: 3000,
        totalPrice: 3000,
        order: 3
      }
    }),

    // Devis 3 - Site Vitrine
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[2].id,
        description: 'Design et développement site vitrine',
        quantity: 1,
        unitPrice: 2000,
        totalPrice: 2000,
        order: 1
      }
    }),
    prisma.quoteItem.create({
      data: {
        quoteId: quotes[2].id,
        description: 'Formation et mise en ligne',
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        order: 2
      }
    })
  ])

  console.log('📝 Lignes de devis créées')

  // 9. Créer des factures
  const invoices = await Promise.all([
    // Facture basée sur le devis accepté
    prisma.invoice.create({
      data: {
        number: 'INV-2025-001',
        title: 'Facture Site E-commerce Acme - Acompte',
        description: 'Acompte de 30% pour le développement du site e-commerce',
        clientId: clients[0].id,
        projectId: projects[0].id,
        quoteId: quotes[0].id,
        status: InvoiceStatus.PAID,
        subtotal: 4500,
        taxAmount: 900,
        totalAmount: 5400,
        paidAmount: 5400,
        issueDate: new Date('2025-06-06'),
        dueDate: new Date('2025-06-21'),
        paidAt: new Date('2025-06-08'),
        createdById: users[0].id,
        notes: 'Acompte payé rapidement',
        terms: 'Paiement sous 15 jours'
      }
    }),
    // Facture pour le client particulier
    prisma.invoice.create({
      data: {
        number: 'INV-2025-002',
        title: 'Facture Site Vitrine Menuiserie',
        description: 'Site vitrine complet avec galerie photos',
        clientId: clients[2].id,
        projectId: projects[2].id,
        quoteId: quotes[2].id,
        status: InvoiceStatus.SENT,
        subtotal: 2500,
        taxAmount: 0,
        totalAmount: 2500,
        paidAmount: 0,
        issueDate: new Date('2025-06-20'),
        dueDate: new Date('2025-07-05'),
        createdById: users[0].id,
        notes: 'Facture envoyée, en attente de paiement',
        terms: 'Paiement sous 15 jours'
      }
    })
  ])

  console.log('🧾 Factures créées')

  // 10. Créer des lignes de facture
  const invoiceItems = await Promise.all([
    // Facture 1 - Acompte E-commerce
    prisma.invoiceItem.create({
      data: {
        invoiceId: invoices[0].id,
        description: 'Acompte 30% - Développement site e-commerce',
        quantity: 1,
        unitPrice: 4500,
        totalPrice: 4500,
        order: 1
      }
    }),

    // Facture 2 - Site Vitrine
    prisma.invoiceItem.create({
      data: {
        invoiceId: invoices[1].id,
        description: 'Design et développement site vitrine',
        quantity: 1,
        unitPrice: 2000,
        totalPrice: 2000,
        order: 1
      }
    }),
    prisma.invoiceItem.create({
      data: {
        invoiceId: invoices[1].id,
        description: 'Formation et mise en ligne',
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        order: 2
      }
    })
  ])

  console.log('📄 Lignes de facture créées')

  // 11. Créer des paiements
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        invoiceId: invoices[0].id,
        amount: 5400,
        currency: 'EUR',
        method: PaymentMethod.BANK_TRANSFER,
        reference: 'VIR-20250608-001',
        paidAt: new Date('2025-06-08'),
        notes: 'Virement reçu rapidement',
        createdById: users[0].id
      }
    })
  ])

  console.log('💰 Paiements créés')

  // 12. Créer des boards
  const boards = await Promise.all([
    prisma.board.create({
      data: {
        name: 'Développement E-commerce',
        projectId: projects[0].id,
        created_by_id: users[0].id
      }
    }),
    prisma.board.create({
      data: {
        name: 'Sprint Mobile App',
        projectId: projects[1].id,
        created_by_id: users[3].id
      }
    }),
    prisma.board.create({
      data: {
        name: 'Design Site Vitrine',
        projectId: projects[2].id,
        created_by_id: users[2].id
      }
    })
  ])

  console.log('📋 Boards créés')

  // 13. Créer quelques colonnes et tâches
  const columns = await Promise.all([
    // Board 1 - E-commerce
    prisma.column.create({
      data: {
        name: 'À faire',
        order: 0,
        position: 0,
        color: '#3b82f6',
        boardId: boards[0].id
      }
    }),
    prisma.column.create({
      data: {
        name: 'En cours',
        order: 1,
        position: 1,
        color: '#f59e0b',
        boardId: boards[0].id
      }
    }),
    prisma.column.create({
      data: {
        name: 'Terminé',
        order: 2,
        position: 2,
        color: '#10b981',
        boardId: boards[0].id
      }
    }),

    // Board 2 - Mobile App
    prisma.column.create({
      data: {
        name: 'Backlog',
        order: 0,
        position: 0,
        color: '#6b7280',
        boardId: boards[1].id
      }
    }),
    prisma.column.create({
      data: {
        name: 'Sprint',
        order: 1,
        position: 1,
        color: '#3b82f6',
        boardId: boards[1].id
      }
    }),
    prisma.column.create({
      data: {
        name: 'Review',
        order: 2,
        position: 2,
        color: '#ec4899',
        boardId: boards[1].id
      }
    })
  ])

  console.log('📊 Colonnes créées')

  const tasks = await Promise.all([
    // Tâches Board 1 - E-commerce
    prisma.task.create({
      data: {
        title: "Développer l'authentification utilisateur",
        description: 'Implémenter le système de connexion/inscription avec JWT',
        price: 1200,
        dueDate: new Date('2025-07-20'),
        order: 0,
        columnId: columns[1].id, // En cours
        assigneeId: users[1].id, // John Doe
        client_id: clients[0].id,
        createdById: users[0].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Intégrer le système de paiement Stripe',
        description: 'Configuration et intégration de Stripe pour les paiements',
        price: 1500,
        dueDate: new Date('2025-08-01'),
        order: 0,
        columnId: columns[0].id, // À faire
        assigneeId: users[1].id, // John Doe
        client_id: clients[0].id,
        createdById: users[0].id
      }
    }),
    prisma.task.create({
      data: {
        title: "Design de l'interface utilisateur",
        description: "Créer les maquettes et prototypes de l'interface",
        price: 800,
        dueDate: new Date('2025-07-15'),
        order: 0,
        columnId: columns[2].id, // Terminé
        assigneeId: users[2].id, // Marie Martin
        client_id: clients[0].id,
        createdById: users[0].id
      }
    }),

    // Tâches Board 2 - Mobile App
    prisma.task.create({
      data: {
        title: "Architecture de l'application mobile",
        description: "Définir l'architecture technique et les technologies",
        price: 2000,
        dueDate: new Date('2025-07-30'),
        order: 0,
        columnId: columns[4].id, // Sprint
        assigneeId: users[1].id, // John Doe
        client_id: clients[1].id,
        createdById: users[3].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Tests utilisateurs',
        description: 'Organiser et analyser les tests utilisateurs',
        price: 600,
        dueDate: new Date('2025-08-15'),
        order: 0,
        columnId: columns[3].id, // Backlog
        assigneeId: users[3].id, // Paul Durand
        client_id: clients[1].id,
        createdById: users[3].id
      }
    })
  ])

  console.log('✅ Tâches créées')

  // 14. Associer des labels aux tâches
  const taskLabels = await Promise.all([
    // Tâche 1 - Authentification (Urgent + Backend)
    prisma.taskLabel.create({
      data: {
        task_id: tasks[0].id,
        label_id: labels[0].id // Urgent
      }
    }),
    prisma.taskLabel.create({
      data: {
        task_id: tasks[0].id,
        label_id: labels[4].id // Backend
      }
    }),

    // Tâche 2 - Stripe (Feature + Backend)
    prisma.taskLabel.create({
      data: {
        task_id: tasks[1].id,
        label_id: labels[2].id // Feature
      }
    }),
    prisma.taskLabel.create({
      data: {
        task_id: tasks[1].id,
        label_id: labels[4].id // Backend
      }
    }),

    // Tâche 3 - Design UI (Design)
    prisma.taskLabel.create({
      data: {
        task_id: tasks[2].id,
        label_id: labels[3].id // Design
      }
    }),

    // Tâche 4 - Architecture (Feature + Backend)
    prisma.taskLabel.create({
      data: {
        task_id: tasks[3].id,
        label_id: labels[2].id // Feature
      }
    }),
    prisma.taskLabel.create({
      data: {
        task_id: tasks[3].id,
        label_id: labels[4].id // Backend
      }
    }),

    // Tâche 5 - Tests (Testing + Review)
    prisma.taskLabel.create({
      data: {
        task_id: tasks[4].id,
        label_id: labels[6].id // Testing
      }
    }),
    prisma.taskLabel.create({
      data: {
        task_id: tasks[4].id,
        label_id: labels[8].id // Review
      }
    })
  ])

  console.log('🏷️ Labels associés aux tâches')

  console.log('🎉 Seeding terminé avec succès!')
  console.log(`
📊 Résumé:
- ${users.length} utilisateurs créés
- ${clients.length} clients créés (entreprises et particuliers)
- ${labels.length} labels globaux créés
- ${projects.length} projets créés
- ${projectLabels.length} associations projet-label avec personnalisations
- ${quotes.length} devis créés avec ${quoteItems.length} lignes
- ${invoices.length} factures créées avec ${invoiceItems.length} lignes
- ${payments.length} paiements enregistrés
- ${boards.length} boards créés
- ${columns.length} colonnes créées
- ${tasks.length} tâches créées
- ${taskLabels.length} associations tâche-label

🏷️ Système de labels simplifié:
- Labels globaux communautaires
- Association uniquement aux projets (avec personnalisations)
- Héritage automatique pour tous les boards du projet
- Association directe aux tâches
- Couleurs personnalisées et favoris par projet
- Compteur d'utilisation global

💼 Types de clients:
- Entreprises avec compte utilisateur
- Entreprises sans compte utilisateur  
- Particuliers
- Clients étrangers

🧾 Facturation:
- Devis avec statuts (brouillon, envoyé, accepté, refusé)
- Factures liées aux devis
- Paiements avec différentes méthodes
- Gestion TVA selon le type de client
  `)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

'use server'

import { cleanFalsyFields } from '@/app/utils/request'
import { prisma } from '@/infrastructure/prisma'
import { createProjectWithBoard } from '@/infrastructure/project/queries'
import { ClientType } from '@prisma/prisma'
import { requireAuth } from 'auth-utils'
import { revalidatePath } from 'next/cache'

// Get Session
async function getAuthUser() {
  const session = await requireAuth()

  if (!session || !session.user) {
    throw new Error('Non authentifié')
  }

  return session.user
}
//
export type ProjectPost = {
  name: string
  description?: string
  clientId: string
  hiddenForClient?: boolean
}
// Add project
export async function addProject(data: ProjectPost) {
  const user = await getAuthUser()
  try {
    const userId = user.id
    const newProject = await createProjectWithBoard({
      userId: userId!,
      name: data.name,
      description: data.description,
      client_id: data.clientId,
      hiddenForClient: data.hiddenForClient
    })
    //Refresh the page to see change page Project is partial cache
    revalidatePath('/projects')

    return { success: true, newProject }
  } catch (e) {
    console.error('Erreur ajout projet:', e)
    return { success: false, error: 'Erreur lors de la création du projet.' }
  }
}
// Get all Clients associate to the User
export async function getAllClientsCreatedByUser(fullData = false) {
  const user = await getAuthUser()
  try {
    const clients = await prisma.client.findMany({
      where: {
        createdById: user.id
      },
      select: fullData
        ? undefined
        : {
            id: true,
            email: true,
            firstName: true,
            companyName: true
          }
    })

    return { success: true, clients }
  } catch (error) {
    console.error('Erreur récupération clients:', error)
    return { success: false, error: 'Erreur lors de la récupération des clients.' }
  }
}
export type NewClientInput = {
  type: ClientType
  email: string
  firstName: string
  lastName?: string
  phone?: string
  companyName?: string
  siret?: string
  vatNumber?: string
  website?: string
  address?: string
  city?: string
  postalCode?: string
  country: string
  currency: 'EUR' | 'DOLLAR'
  taxRate?: number
  notes?: string
  isActive: boolean
  projectId?: string // <- optionnel si on veut l’ajouter à un projet
}
export async function createClientWithOptionalUser(input: NewClientInput) {
  const user = await getAuthUser()
  if (!user) return { success: false, error: 'Utilisateur non authentifié' }
  let client
  try {
    // 1. Check si utilisateur existe avec cet email to link it
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    })
    const existingClient = await prisma.client.findFirst({
      where: { email: input.email }
    })

    const clientData: any = {
      type: input.type,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      companyName: input.companyName,
      siret: input.siret,
      vatNumber: input.vatNumber,
      website: input.website,
      address: input.address,
      city: input.city,
      postalCode: input.postalCode,
      country: input.country,
      currency: input.currency,
      taxRate: input.taxRate,
      notes: input.notes,
      isActive: input.isActive,
      createdById: user.id
    }

    if (existingUser) {
      clientData.userId = existingUser.id
    }
    if (existingClient) {
      client = await prisma.client.update({
        where: {
          id: existingClient.id
        },
        data: cleanFalsyFields(clientData)
      })
    } else {
      client = await prisma.client.create({
        data: clientData
      })
    }

    // 4. Si projetId et que le Client existe en tant qu'User le lié en tant que ProjectMember User sinon lien deja etablie dans Project via client_id
    if (input.projectId && existingUser) {
      await prisma.projectMember.create({
        data: {
          userId: existingUser.id,
          projectId: input.projectId,
          role: 'Client'
        }
      })
    }
    revalidatePath('/projects')

    return { success: true, client }
  } catch (err) {
    console.error('Erreur création client:', err)
    return { success: false, error: 'Erreur lors de la création du client.' }
  }
}

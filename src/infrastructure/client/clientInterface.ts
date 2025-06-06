import { Client, Project } from '@prisma/prisma'

export type ProjectAndClient = Project & { client: Client }
export type PartialClient = {
  id: string
  email: string
  firstName: string
  companyName: string | null
}

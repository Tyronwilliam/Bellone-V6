import { Board, Client, Invoice, Label, Quote } from '@prisma/prisma'

export type ProjectInput = {
  userId: string
  name: string
  description?: string
  client_id: string
  hiddenForClient?: boolean
}

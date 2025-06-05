// export interface Label {
//   id: string
//   name: string
//   color?: string
//   usageCount: number
//   source?: 'project' | 'board' | 'global'
//   isFavorite?: boolean
// }

import { Label } from '@prisma/prisma'

export interface LabelLibraryProps {
  projectLabels: Label[]
  boardLabels: Label[]
  popularLabels: Label[]
  onCreateLabel: (data: { name: string; color?: string; scope: 'project' | 'board' }) => void
  onAddExistingLabel: (labelId: string, scope: 'project' | 'board') => void
  onToggleFavorite: (labelId: string, scope: 'project' | 'board') => void
}
// Récupérer tous les labels globaux (bibliothèque)
export type LabelScope = 'all' | 'user' | 'board'

export interface GetAllLabelsOptions {
  userId: string
  boardId: string
  search?: string
  scope?: LabelScope
  page?: number
  pageSize?: number
}

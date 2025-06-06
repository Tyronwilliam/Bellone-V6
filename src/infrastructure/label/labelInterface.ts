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

export interface LabelInput {
  name: string
  createdById: string
  color: string | null
}
////////////////////// V0

export interface Label {
  id: string
  name: string
  color: string | null
  description: string | null
  usageCount: number
  createdAt: string
  createdBy: {
    name: string | null
    email: string
  }
}

export interface ProjectLabel {
  id: string
  projectId: string
  labelId: string
  isFavorite: boolean
  label: Label
}

export interface BoardLabel {
  id: string
  boardId: string
  labelId: string
  isFavorite: boolean
  colorOverride: string | null
  label: Label
}

export interface LabelWithSource extends Label {
  source?: 'global' | 'project' | 'board'
  isFavorite?: boolean
  colorOverride?: string | null
}

export interface LabelBrowserProps {
  projectId?: string
  boardId?: string
  onLabelSelect?: (label: Label) => void
  onClose?: () => void
}

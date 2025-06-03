'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

interface AddColumnFormProps {
  onAddColumn: (name: string, color?: string) => void
}

export function AddColumnForm({ onAddColumn }: AddColumnFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [columnName, setColumnName] = useState('')

  const handleSubmit = () => {
    if (columnName.trim()) {
      onAddColumn(columnName.trim())
      setColumnName('')
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setColumnName('')
  }

  if (isAdding) {
    return (
      <div className="w-80 p-4 bg-muted/30 rounded-lg flex-shrink-0">
        <Input
          placeholder="Nom de la colonne..."
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') handleCancel()
          }}
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={handleSubmit}>
            Ajouter
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0">
      <Button
        variant="ghost"
        className="w-80 h-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une colonne
      </Button>
    </div>
  )
}

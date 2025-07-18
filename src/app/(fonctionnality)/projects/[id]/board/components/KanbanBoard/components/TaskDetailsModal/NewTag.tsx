import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tag } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import TagColorPicker from './tag-color-picker'
interface TaskTagsSectionProps {
  newTagName: string
  onNewTagNameChange: (name: string) => void
  onAddTag: () => void
  newColor: string
  setNewColor: Dispatch<SetStateAction<string>>
  isLoading?: boolean
}

export default function NewTag({
  newTagName,
  onNewTagNameChange,
  onAddTag,
  newColor,
  setNewColor,
  isLoading
}: TaskTagsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag()
      setIsDialogOpen(false)
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-fit h-full self-end rounded-none shadow-none bg-transparent mb-2"
          disabled={isLoading}
        >
          +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-fit">
        <DialogHeader>
          <DialogTitle>Add a Label :</DialogTitle>
          <DialogDescription className="sr-only">
            Give a name to the new label to add.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-2 w-full h-full">
          <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={newTagName}
            onChange={(e) => onNewTagNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTag()
              }
            }}
            placeholder="Ex : Waiting"
            className="pl-10"
            disabled={isLoading}
          />
          <TagColorPicker newTagName={newTagName} newColor={newColor} setNewColor={setNewColor} />
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleAddTag} disabled={!newTagName.trim() || isLoading}>
            {isLoading ? 'Adding...' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

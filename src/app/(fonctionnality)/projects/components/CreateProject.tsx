'use client'
import { CardCustom } from '@/components/custom/CardCustom'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { addProject, ProjectPost } from '../action'
import { CreateClientForm } from './CreateClientForm'
import { PartialClient } from './ProjectBoard'
import { SelectComponent } from './SelectComponent'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const createProjectSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Veuillez selectionner un client'),
  hiddenForClient: z.boolean().optional()
})
export type ProjectFormValues = z.infer<typeof createProjectSchema>

type CreateProjectProps = {
  clients?: PartialClient[]
  closeAsModal?: () => void
}

export function CreateProject({ clients, closeAsModal }: CreateProjectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const toggle = () => setIsOpen(!isOpen)
  const close = () => {
    if (closeAsModal) return closeAsModal()
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      hiddenForClient: false,
      clientId: ''
    },
    mode: 'onChange'
  })
  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true)
    try {
      const result = await addProject(data as ProjectPost)

      if (result.success) {
        toast.success('Project créé avec succès')
        if (result.newProject) router.push(`/projects/${result.newProject.id}`)
      } else {
        toast.error(result.error || 'Erreur lors de la création du Project')
      }
    } catch (error) {
      console.error('Erreur lors de la création du Project:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <CardCustom className="w-full max-w-3xl mx-auto" title="Créer un nouveau projet">
      <Form {...form}>
        <form id="project-form" onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
          <div className="grid grid-cols-1 gap-4 ">
            {/* Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Refonte du Site Acme" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Refonte su Site Vitrine dans le cadre d'une amélioration visuelle..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Select Client*/}
            {clients && clients?.length > 0 && (
              <div className="max-w-[250px]">
                <SelectComponent
                  placeholder="Attribuer un client au projet"
                  className="w-full"
                  content={clients}
                  name="clientId"
                  control={form.control}
                />
              </div>
            )}
            {!isOpen && (
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setIsOpen(true)
                  }}
                >
                  Ajouter un client
                </Button>
              </div>
            )}
            <FormField
              control={form.control}
              name="hiddenForClient"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Client actif</FormLabel>
                    <FormDescription>Activer pour masquer le Kanban au client</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      {isOpen && <CreateClientForm onSuccess={toggle} onCancel={toggle} />}{' '}
      <CardFooter className="w-full flex gap-2 justify-end">
        {closeAsModal && (
          <Button variant="destructive" className="" type="button" onClick={close}>
            Annuler
          </Button>
        )}
        <Button type="submit" form="project-form">
          Créer un projet
        </Button>
      </CardFooter>
    </CardCustom>
  )
}
type ModalCreateProjectProps = {
  isOpen: boolean
  toggle: () => void
  clients?: PartialClient[]
}
export const ModalCreateProject = ({ isOpen, toggle, clients }: ModalCreateProjectProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button type="button" className="w-fit" onClick={toggle}>
          Créer un nouveau projet
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full md:min-w-3xl md:h-fit md:max-h-[80%] md:w-[512px] !overflow-y-scroll">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only ">Créer un projet</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>{' '}
        </DialogHeader>

        <CreateProject clients={clients} closeAsModal={toggle} />
      </DialogContent>
    </Dialog>
  )
}

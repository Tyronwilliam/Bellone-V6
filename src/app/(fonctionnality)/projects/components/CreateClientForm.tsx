'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

import { CardCustom } from '@/components/custom/CardCustom'
import { ClientType } from '@prisma/prisma'
import { createClientWithOptionalUser, NewClientInput } from '../action'
import { ClientFormTabs } from './components-create-client/ClientFormTabs'
import { ClientTypeSelector } from './components-create-client/ClientTypeSelector'

// Schéma de validation avec Zod
const clientSchema = z
  .object({
    type: z.enum([ClientType.INDIVIDUAL, ClientType.COMPANY]),
    email: z.string().email('Email invalide'),
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().optional(),
    phone: z
      .string()
      .regex(/^\d*$/, 'Uniquement des chiffres')
      .max(10, 'Veuillez entrer un numéro valide')
      .optional(),
    companyName: z.string().optional(),
    siret: z
      .string()
      .regex(/^\d*$/, 'Uniquement des chiffres')
      .max(14, 'Veuillez entrer un numéro siret valide')
      .optional(),
    vatNumber: z
      .union([z.literal(''), z.string().regex(/^[A-Z0-9]{8,20}$/, 'Format TVA invalide')])
      .optional(),
    website: z.string().url('URL invalide').optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().regex(/^\d*$/, 'Uniquement des chiffres').optional(),
    country: z.string().optional(),
    currency: z.enum(['EUR', 'USD']),
    taxRate: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
    isActive: z.boolean(),
    projectId: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const { vatNumber, country } = data

    if (vatNumber !== undefined && vatNumber !== '') {
      if (country === 'FR' && !/^FR[A-Z0-9]{2}\d{9}$/.test(vatNumber)) {
        ctx.addIssue({
          path: ['vatNumber'],
          code: z.ZodIssueCode.custom,
          message: 'Format FR invalide : FR + 2 lettres/chiffres + 9 chiffres'
        })
      }

      if (!/^[A-Z0-9]{8,20}$/.test(vatNumber)) {
        ctx.addIssue({
          path: ['vatNumber'],
          code: z.ZodIssueCode.custom,
          message: 'Format TVA invalide : uniquement lettres/chiffres, 8 à 20 caractères'
        })
      }
    }
  })

export type ClientFormValues = z.infer<typeof clientSchema>

interface CreateClientFormProps {
  projectId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateClientForm({ projectId, onSuccess, onCancel }: CreateClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type: ClientType.COMPANY,
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      companyName: '',
      siret: '',
      vatNumber: '',
      website: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      currency: 'EUR',
      taxRate: 20,
      notes: '',
      isActive: true,
      projectId: projectId
    }
  })
  const { errors, isDirty } = form.formState
  // Récupérer le type de client pour afficher/masquer certains champs
  const clientType = form.watch('type')
  const isCompany = clientType === ClientType.COMPANY

  async function onSubmit(data: ClientFormValues) {
    setIsSubmitting(true)
    try {
      const result = await createClientWithOptionalUser(data as NewClientInput)

      if (result.success) {
        toast.success('Client créé avec succès')
        if (onSuccess && result.client) {
          onSuccess()
        }
      } else {
        toast.error(result.error || 'Erreur lors de la création du client')
      }
    } catch (error) {
      console.error('Erreur lors de la création du client:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CardCustom
      title="Nouveau client"
      description="Créez un nouveau client pour votre entreprise. Les clients peuvent être des particuliers ou des entreprises."
      className="w-full max-w-4xl mx-auto  mb-4"
    >
      <Separator className="mb-6" />
      {Object.keys(errors).length > 0 && isDirty && (
        <p className="text-destructive text-sm text-center">Formulaire non valide</p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-6">
            {/* Type de client */}
            <ClientTypeSelector form={form} isCompany={isCompany} isSubmitting={isSubmitting} />

            {/* Onglets avec les informations du client */}
            <ClientFormTabs
              control={form.control}
              isCompany={isCompany}
              isSubmitting={isSubmitting}
            />

            <Separator className="my-4" />

            {/* Boutons d'action */}
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={onCancel} disabled={isSubmitting} type="button">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer le client
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </CardCustom>
  )
}

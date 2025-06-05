import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ClientType } from '@prisma/prisma'
import { Building2, User } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { ClientFormValues } from '../CreateClientForm'

type ClientTypeSelectorProps = {
  form: UseFormReturn<ClientFormValues>
  isCompany: boolean
  isSubmitting: boolean
}
export const ClientTypeSelector = ({ form, isCompany, isSubmitting }: ClientTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de client</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={ClientType.INDIVIDUAL}>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Particulier</span>
                </div>
              </SelectItem>
              <SelectItem value={ClientType.COMPANY}>
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Entreprise</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            {isCompany
              ? 'Une entreprise avec des informations fiscales'
              : "Un particulier sans informations d'entreprise"}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

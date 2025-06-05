
import {
  FormControl,
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


import { Control } from 'react-hook-form'
import { PartialClient } from './ProjectBoard'

interface SelectComponentProps {
  placeholder?: string
  className?: string
  content: PartialClient[] // ou un type plus générique avec au moins `email: string`
  control: Control<any> // ou `Control<YourFormType>` pour typer précisément
  name: string
}

export function SelectComponent({
  placeholder = 'Sélectionner un client',
  className,
  content,
  control,
  name
}: SelectComponentProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>Client</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {content.map((item) => (
                <SelectItem key={item.email} value={item.id}>
                  {item.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

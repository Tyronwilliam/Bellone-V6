export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(amount)
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

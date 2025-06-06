'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Receipt, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/app/utils/format'
import { FullProject } from '@/infrastructure/project/projectQueries'
import { FinancialStatTask } from './ProjectDashboard'

type FinancialOverviewProps = {
  project: FullProject
  financialStats: FinancialStatTask
}

export function FinancialOverview({ project, financialStats }: FinancialOverviewProps) {
  if (!project) return

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Devis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Devis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total devisé</span>
              <span className="font-medium">
                {formatCurrency(financialStats.totalQuoted, project.client.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Devis acceptés</span>
              <span className="font-medium">{financialStats.quotesAccepted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total devis</span>
              <span className="font-medium">{project.quotes.length}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau devis
          </Button>
        </CardContent>
      </Card>

      {/* Factures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Factures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total facturé</span>
              <span className="font-medium">
                {formatCurrency(financialStats.totalInvoiced, project.client.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Factures payées</span>
              <span className="font-medium">{financialStats.invoicesPaid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total factures</span>
              <span className="font-medium">{project.invoices.length}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </CardContent>
      </Card>

      {/* Paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total encaissé</span>
              <span className="font-medium text-green-600">
                {formatCurrency(financialStats.totalPaid, project.client.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">En attente</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(financialStats.pendingPayments, project.client.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Taux de recouvrement</span>
              <span className="font-medium">
                {financialStats.totalInvoiced > 0
                  ? Math.round((financialStats.totalPaid / financialStats.totalInvoiced) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Enregistrer un paiement
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

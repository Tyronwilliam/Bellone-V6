import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '../components/AppSidebar/AppSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full h-screen relative overflow-auto p-2">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger className="w-14 h-14" />
          {children}
        </main>
      </SidebarProvider>
    </main>
  )
}

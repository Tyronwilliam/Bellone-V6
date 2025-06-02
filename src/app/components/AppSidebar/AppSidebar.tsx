'use client'

import { Home, Settings, Users, CreditCard, Bell, MessageSquare, LogOut } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import ThemeToggle from '@/app/ThemeToggle'

// Menu items.
const items = [
  {
    title: 'Projects',
    url: '/projects',
    icon: Home
  },
  {
    title: 'Messages',
    url: '/messages',
    icon: MessageSquare
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: Bell
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: Users
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings
  },
  {
    title: 'Plan',
    url: '/plan',
    icon: CreditCard
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">B</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Bellone</span>
            <span className="truncate text-xs text-muted-foreground">SaaS Platform</span>
          </div>{' '}
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut />
                <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

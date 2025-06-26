"use client"

import Link from "next/link"
import { LayoutDashboard, Users, Truck, ShoppingCart, AreaChart, Settings, Map, LogOut, Scan } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "collections", label: "Collections", icon: Truck },
    { id: "smartbins", label: "Smart Bins", icon: Scan },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: AreaChart },
    { id: "routes", label: "Route Optimization", icon: Map },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>
          <span className="text-lg font-bold">Sortify Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)}>
                <button>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <LogOut className="h-5 w-5" />
                <span>Back to App</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { HeaderClient } from './header-client'
import { CommandPalette } from '@/components/command-palette'
import type { AuthUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

type AppShellProps = {
  children: React.ReactNode
  user: AuthUser | null
}

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless open */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <Sidebar
          isAdmin={isAdmin}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <HeaderClient
          user={user}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <CommandPalette />
    </div>
  )
}

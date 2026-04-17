'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Columns3,
  Calendar,
  CheckSquare,
  FileText,
  MessageSquare,
  MessagesSquare,
  Bell,
  Settings,
  Shield,
  ChevronDown,
  Anchor,
  Activity,
  BarChart3,
  Users,
  Scale,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Projectes',
    href: '/projects',
    icon: <FolderKanban className="h-5 w-5" />,
  },
  {
    title: 'Tasques',
    href: '/tasks',
    icon: <ListTodo className="h-5 w-5" />,
  },
  {
    title: 'Kanban',
    href: '/kanban',
    icon: <Columns3 className="h-5 w-5" />,
  },
  {
    title: 'Calendari',
    href: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Checklists',
    href: '/checklists',
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Fòrum',
    href: '/forum',
    icon: <MessagesSquare className="h-5 w-5" />,
  },
  {
    title: 'Xat',
    href: '/chat',
    icon: <MessageSquare className="h-5 w-5" />,
  },
]

const analyticsItems: NavItem[] = [
  {
    title: 'Activitat',
    href: '/activity',
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: 'Informes',
    href: '/reports',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'Carrega',
    href: '/workload',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Comparador',
    href: '/compare',
    icon: <Scale className="h-5 w-5" />,
  },
  {
    title: 'Assoliments',
    href: '/achievements',
    icon: <Trophy className="h-5 w-5" />,
  },
]

const adminItems: NavItem[] = [
  {
    title: 'Panel Admin',
    href: '/admin',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: 'Configuració',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

type SidebarProps = {
  isAdmin?: boolean
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ isAdmin = false, collapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const [adminOpen, setAdminOpen] = useState(true)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Anchor className="h-6 w-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">MatePro</span>
            <span className="text-xs text-muted-foreground">Organiza, controla, fluye.</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Analytics Section */}
        {!collapsed && (
          <div className="mt-6">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Analitica
            </div>
            <ul className="mt-1 space-y-1">
              {analyticsItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && !collapsed && (
          <div className="mt-6">
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <span>Administració</span>
              <ChevronDown
                className={cn(
                  'ml-auto h-4 w-4 transition-transform',
                  adminOpen && 'rotate-180'
                )}
              />
            </button>
            {adminOpen && (
              <ul className="mt-1 space-y-1">
                {adminItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/notifications"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === '/notifications'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <Bell className="h-5 w-5" />
          {!collapsed && <span>Notificacions</span>}
        </Link>
      </div>
    </aside>
  )
}

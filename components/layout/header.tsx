'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import type { AuthUser } from '@/lib/auth'

type HeaderProps = {
  user: AuthUser | null
  onMenuToggle?: () => void
  notificationCount?: number
}

export function Header({ user, onMenuToggle, notificationCount = 0 }: HeaderProps) {
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cercar projectes, tasques..."
              className="h-10 w-80 rounded-lg border border-input bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
            {searchOpen && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-border bg-popover p-2 shadow-lg">
                <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                  Escriu per cercar...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Mobile search toggle */}
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Link>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted"
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white',
                  getAvatarColor(user.name)
                )}
              >
                {getInitials(user.name)}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-popover p-1 shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      El meu perfil
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Configuració
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Tancar sessió
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

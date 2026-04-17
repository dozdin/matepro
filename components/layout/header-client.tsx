"use client"

import { useAppStore } from "@/lib/store"
import { Header } from "./header"
import type { AuthUser } from "@/lib/auth"

type HeaderClientProps = {
  user: AuthUser | null
  onMenuToggle?: () => void
}

export function HeaderClient({ user, onMenuToggle }: HeaderClientProps) {
  const notifications = useAppStore((state) => state.notifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  return <Header user={user} onMenuToggle={onMenuToggle} notificationCount={unreadCount} />
}

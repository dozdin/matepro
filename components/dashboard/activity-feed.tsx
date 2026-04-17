import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageSquare, FileText, UserPlus, Edit, AlertTriangle } from 'lucide-react'
import { cn, getInitials, getAvatarColor, formatRelativeTime } from '@/lib/utils'

type ActivityItem = {
  id: string
  type: 'task_completed' | 'comment' | 'document' | 'user_joined' | 'task_updated' | 'task_blocked'
  user: { name: string; avatar?: string }
  content: string
  target?: { name: string; href: string }
  timestamp: Date
}

// Mock data
const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    user: { name: 'Marc Puig' },
    content: 'ha completat la tasca',
    target: { name: 'Desmuntatge de la coberta', href: '/tasks/tsk_001' },
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: '2',
    type: 'comment',
    user: { name: 'Anna Vidal' },
    content: 'ha comentat a',
    target: { name: 'Reparació estructural del casc', href: '/tasks/tsk_002' },
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
  },
  {
    id: '3',
    type: 'document',
    user: { name: 'Jordi García' },
    content: 'ha pujat un document a',
    target: { name: 'Velero Clàssic', href: '/projects/prj_001' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '4',
    type: 'task_updated',
    user: { name: 'Pere Font' },
    content: 'ha actualitzat',
    target: { name: 'Instal·lació electrònica', href: '/tasks/tsk_005' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: '5',
    type: 'task_blocked',
    user: { name: 'Laura Serra' },
    content: 'ha marcat com bloquejada',
    target: { name: 'Laminat del casc', href: '/tasks/tsk_009' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
]

const activityIcons = {
  task_completed: { icon: CheckCircle2, color: 'bg-success/20 text-success' },
  comment: { icon: MessageSquare, color: 'bg-accent/20 text-accent' },
  document: { icon: FileText, color: 'bg-primary/20 text-primary' },
  user_joined: { icon: UserPlus, color: 'bg-success/20 text-success' },
  task_updated: { icon: Edit, color: 'bg-warning/20 text-warning' },
  task_blocked: { icon: AlertTriangle, color: 'bg-destructive/20 text-destructive' },
}

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold">Activitat Recent</h2>
        <Link
          href="/activity"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Veure tot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const { icon: Icon, color } = activityIcons[activity.type]
          return (
            <div key={activity.id} className="flex gap-3 p-4">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white mr-1.5 align-middle',
                      getAvatarColor(activity.user.name)
                    )}
                  >
                    {getInitials(activity.user.name)}
                  </span>
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {activity.content}{' '}
                  {activity.target && (
                    <Link
                      href={activity.target.href}
                      className="font-medium text-primary hover:underline"
                    >
                      {activity.target.name}
                    </Link>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

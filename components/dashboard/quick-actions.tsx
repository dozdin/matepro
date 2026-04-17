import Link from 'next/link'
import { Plus, FolderPlus, ListPlus, CalendarPlus, FileUp } from 'lucide-react'

const actions = [
  {
    title: 'Nou Projecte',
    description: 'Crear un projecte nou',
    href: '/projects/new',
    icon: FolderPlus,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    title: 'Nova Tasca',
    description: 'Afegir una tasca',
    href: '/tasks/new',
    icon: ListPlus,
    color: 'bg-accent/10 text-accent hover:bg-accent/20',
  },
  {
    title: 'Nou Esdeveniment',
    description: 'Programar al calendari',
    href: '/calendar/new',
    icon: CalendarPlus,
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
  {
    title: 'Pujar Document',
    description: 'Afegir arxiu o plànol',
    href: '/documents/new',
    icon: FileUp,
    color: 'bg-success/10 text-success hover:bg-success/20',
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={`group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm ${action.color}`}
        >
          <div className="rounded-lg bg-background p-2">
            <action.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-card-foreground group-hover:text-foreground">
              {action.title}
            </p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

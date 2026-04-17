// Status types
export type ProjectStatus = 'planificacio' | 'en_curs' | 'pausat' | 'completat' | 'cancelat'
export type TaskStatus = 'pendent' | 'en_curs' | 'revisio' | 'completat' | 'bloquejat'
export type Priority = 'baixa' | 'normal' | 'alta' | 'critica'
export type UserRole = 'admin' | 'cap_projecte' | 'operari' | 'visitant'

// Label mappings
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planificacio: 'Planificació',
  en_curs: 'En Curs',
  pausat: 'Pausat',
  completat: 'Completat',
  cancelat: 'Cancel·lat',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendent: 'Pendent',
  en_curs: 'En Curs',
  revisio: 'Revisió',
  completat: 'Completat',
  bloquejat: 'Bloquejat',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
  critica: 'Crítica',
}

// Alias for consistency
export const TASK_PRIORITY_LABELS = PRIORITY_LABELS

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  cap_projecte: 'Cap de Projecte',
  operari: 'Operari',
  visitant: 'Visitant',
}

// Status colors for CSS classes
export const STATUS_COLORS: Record<TaskStatus | ProjectStatus, string> = {
  pendent: 'status-pending',
  en_curs: 'status-in-progress',
  revisio: 'status-pending',
  completat: 'status-completed',
  bloquejat: 'status-blocked',
  planificacio: 'status-pending',
  pausat: 'status-blocked',
  cancelat: 'status-blocked',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  baixa: 'priority-low',
  normal: 'priority-medium',
  alta: 'priority-high',
  critica: 'priority-critical',
}

// Navigation items
export type NavItem = {
  title: string
  href: string
  icon: string
  badge?: number
  children?: NavItem[]
}

// Dashboard stats
export type DashboardStats = {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTask: number
  teamMembers: number
  unreadNotifications: number
}

// Calendar event types
export type CalendarEventType = 'reunio' | 'entrega' | 'revisio' | 'festiu' | 'altre'

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  reunio: 'Reunió',
  entrega: 'Entrega',
  revisio: 'Revisió',
  festiu: 'Festiu',
  altre: 'Altre',
}

export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  reunio: '#3b82f6',
  entrega: '#f97316',
  revisio: '#8b5cf6',
  festiu: '#22c55e',
  altre: '#6b7280',
}

// Document categories
export type DocumentCategory = 'planol' | 'manual' | 'certificat' | 'foto' | 'informe' | 'altre'

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  planol: 'Plànol',
  manual: 'Manual',
  certificat: 'Certificat',
  foto: 'Fotografia',
  informe: 'Informe',
  altre: 'Altre',
}

// Forum category colors
export const FORUM_CATEGORY_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
]

// Notification types
export type NotificationType = 
  | 'task_assigned' 
  | 'task_updated' 
  | 'comment' 
  | 'mention' 
  | 'deadline' 
  | 'forum_reply' 
  | 'chat_message' 
  | 'system'

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  task_assigned: 'Tasca assignada',
  task_updated: 'Tasca actualitzada',
  comment: 'Nou comentari',
  mention: 'Menció',
  deadline: 'Termini proper',
  forum_reply: 'Resposta al fòrum',
  chat_message: 'Nou missatge',
  system: 'Sistema',
}

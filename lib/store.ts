"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { nanoid } from "./nanoid"

export type Priority = "baixa" | "normal" | "alta" | "critica"
export type TaskStatus = "pendent" | "en_curs" | "revisio" | "completat" | "bloquejat"
export type ProjectStatus = "planificacio" | "en_curs" | "pausat" | "completat" | "cancelat"

export interface Project {
  id: string
  name: string
  clientName: string
  status: ProjectStatus
  priority: Priority
  progress: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  description: string
  teamSize: number
  managerId: string
  managerName: string
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  id: string
  author: string
  authorId: string
  content: string
  createdAt: string
}

export interface TaskChecklistItem {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  code?: string
  title: string
  description: string
  projectId: string
  projectName: string
  status: TaskStatus
  priority: Priority
  assigneeId: string | null
  assigneeName: string | null
  dueDate: string | null
  startDate: string | null
  createdAt: string
  updatedAt: string
  estimatedHours: number | null
  actualHours: number | null
  tags?: string[]
  comments?: TaskComment[]
  checklist?: TaskChecklistItem[]
  dependencies?: string[]
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  type: "task" | "meeting" | "delivery" | "holiday" | "other"
  startDate: string
  endDate: string
  allDay: boolean
  location: string
  projectId: string | null
  createdAt: string
}

export interface Checklist {
  id: string
  name: string
  projectId: string | null
  projectName: string | null
  items: ChecklistItem[]
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  completedAt: string | null
  completedBy: string | null
  notes: string
}

export interface Document {
  id: string
  name: string
  description: string
  category: "plans" | "contracts" | "reports" | "photos" | "videos" | "other"
  projectId: string | null
  projectName: string | null
  size: number
  mimeType: string
  uploadedBy: string
  createdAt: string
  tags: string[]
}

export interface ForumThread {
  id: string
  title: string
  content: string
  categoryId: string
  categoryName: string
  categoryColor: string
  authorId: string
  authorName: string
  authorRole: string
  votes: number
  userVote: number
  replyCount: number
  viewCount: number
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  lastReplyAt: string
  replies: ForumReply[]
}

export interface ForumReply {
  id: string
  threadId: string
  parentId: string | null
  content: string
  authorId: string
  authorName: string
  authorRole: string
  votes: number
  userVote: number
  createdAt: string
}

export interface ChatMessage {
  id: string
  channelId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  edited: boolean
}

export interface ChatChannel {
  id: string
  name: string
  type: "public" | "private" | "direct"
  description: string
  memberIds: string[]
  lastMessageAt: string | null
  unreadCount: number
}

export interface Notification {
  id: string
  type: "task" | "mention" | "project" | "message" | "system"
  title: string
  description: string
  read: boolean
  actionUrl: string | null
  createdAt: string
  priority?: "low" | "normal" | "high" | "urgent"
  relatedTaskId?: string
  relatedProjectId?: string
  relatedUserId?: string
  snoozedUntil?: string | null
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "cap_projecte" | "operari" | "visitant"
  roleLabel: string
  department: string
  status: "active" | "inactive" | "pending"
  phone: string
  avatarUrl: string | null
  lastActive: string
  createdAt: string
  points?: number
  streak?: number
  achievements?: string[]
}

export type ActivityType =
  | "task_created"
  | "task_completed"
  | "task_status_changed"
  | "project_created"
  | "project_updated"
  | "comment_added"
  | "document_uploaded"
  | "checklist_completed"
  | "forum_post"
  | "user_joined"
  | "achievement_unlocked"

export interface Activity {
  id: string
  type: ActivityType
  actorId: string
  actorName: string
  targetType: "task" | "project" | "document" | "checklist" | "forum" | "user"
  targetId: string
  targetName: string
  description: string
  metadata?: Record<string, string | number | boolean>
  reactions?: Record<string, string[]>
  createdAt: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  condition: string
}

interface AppState {
  projects: Project[]
  tasks: Task[]
  events: CalendarEvent[]
  checklists: Checklist[]
  documents: Document[]
  threads: ForumThread[]
  messages: ChatMessage[]
  channels: ChatChannel[]
  notifications: Notification[]
  users: User[]
  activities: Activity[]
  achievements: Achievement[]

  // Projects
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => string
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Tasks
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => string
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  updateTaskStatus: (id: string, status: TaskStatus) => void
  addComment: (taskId: string, comment: Omit<TaskComment, "id" | "createdAt">) => void

  // Events
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => string
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void

  // Checklists
  addChecklist: (checklist: Omit<Checklist, "id" | "createdAt" | "updatedAt">) => string
  updateChecklist: (id: string, data: Partial<Checklist>) => void
  deleteChecklist: (id: string) => void
  addChecklistItem: (checklistId: string, text: string) => void
  toggleChecklistItem: (checklistId: string, itemId: string, userName: string) => void
  deleteChecklistItem: (checklistId: string, itemId: string) => void
  updateChecklistItem: (checklistId: string, itemId: string, data: Partial<ChecklistItem>) => void

  // Documents
  addDocument: (doc: Omit<Document, "id" | "createdAt">) => string
  deleteDocument: (id: string) => void

  // Forum
  addThread: (thread: Omit<ForumThread, "id" | "createdAt" | "lastReplyAt" | "replies" | "votes" | "userVote" | "replyCount" | "viewCount" | "isPinned" | "isLocked">) => string
  voteThread: (id: string, vote: number) => void
  addReply: (threadId: string, content: string, parentId: string | null, author: { id: string; name: string; role: string }) => void
  voteReply: (threadId: string, replyId: string, vote: number) => void

  // Chat
  addMessage: (message: Omit<ChatMessage, "id" | "createdAt" | "edited">) => void
  deleteMessage: (id: string) => void

  // Notifications
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  deleteNotification: (id: string) => void
  snoozeNotification: (id: string, until: string) => void
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void

  // Users
  addUser: (user: Omit<User, "id" | "createdAt" | "lastActive">) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  toggleUserStatus: (id: string) => void

  // Activities
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => void
  reactToActivity: (activityId: string, userId: string, emoji: string) => void

  // Gamification
  awardPoints: (userId: string, points: number) => void
  unlockAchievement: (userId: string, achievementId: string) => void

  // Reset
  resetStore: () => void
}

const now = new Date().toISOString()

const seedProjects: Project[] = [
  {
    id: "prj_001",
    name: "Iot Luxe 18m",
    clientName: "Hidalgo Shipping S.L.",
    status: "en_curs",
    priority: "alta",
    progress: 65,
    budget: 850000,
    spent: 552500,
    startDate: "2026-01-15",
    endDate: "2026-09-30",
    description: "Construccio d'un iot de luxe de 18 metres amb acabats premium i tecnologia avanzada.",
    teamSize: 8,
    managerId: "demo-manager",
    managerName: "Ana Garcia",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: now,
  },
  {
    id: "prj_002",
    name: "Velero Classic",
    clientName: "Martinez & Fills",
    status: "en_curs",
    priority: "critica",
    progress: 40,
    budget: 450000,
    spent: 180000,
    startDate: "2026-02-01",
    endDate: "2026-07-15",
    description: "Restauracio completa d'un velero classic de 14 metres.",
    teamSize: 5,
    managerId: "demo-manager",
    managerName: "Ana Garcia",
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: now,
  },
  {
    id: "prj_003",
    name: "Manteniment Flota",
    clientName: "Port de Barcelona",
    status: "en_curs",
    priority: "normal",
    progress: 80,
    budget: 120000,
    spent: 96000,
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    description: "Manteniment periodic de la flota del Port de Barcelona.",
    teamSize: 4,
    managerId: "demo-manager",
    managerName: "Ana Garcia",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: now,
  },
  {
    id: "prj_004",
    name: "Catamaran Esportiu",
    clientName: "Club Nautic Costa Brava",
    status: "planificacio",
    priority: "normal",
    progress: 10,
    budget: 280000,
    spent: 28000,
    startDate: "2026-04-01",
    endDate: "2026-10-30",
    description: "Disseny i construccio d'un catamaran esportiu.",
    teamSize: 3,
    managerId: "demo-admin",
    managerName: "Carlos Martinez",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: now,
  },
  {
    id: "prj_005",
    name: "Llanxa Pesca 8m",
    clientName: "Pesqueres Units",
    status: "completat",
    priority: "normal",
    progress: 100,
    budget: 95000,
    spent: 91500,
    startDate: "2025-09-01",
    endDate: "2026-01-30",
    description: "Llanxa de pesca artesanal amb motor dièsel.",
    teamSize: 3,
    managerId: "demo-manager",
    managerName: "Ana Garcia",
    createdAt: "2025-08-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
]

const seedTasks: Task[] = [
  {
    id: "tsk_001",
    title: "Disseny i plànols",
    description: "Crear els plànols detallats del iot amb totes les especificacions técniques",
    projectId: "prj_001",
    projectName: "Iot Luxe 18m",
    status: "en_curs",
    priority: "critica",
    assigneeId: "user_jordi",
    assigneeName: "Jordi Garcia",
    dueDate: "2026-04-15",
    startDate: "2026-03-01",
    createdAt: "2026-02-25T00:00:00Z",
    updatedAt: now,
    estimatedHours: 120,
    actualHours: 85,
  },
  {
    id: "tsk_002",
    title: "Reparacio estructural del casc",
    description: "Reparar les parts estructurals del casc amb materials compostos",
    projectId: "prj_002",
    projectName: "Velero Classic",
    status: "en_curs",
    priority: "critica",
    assigneeId: "user_marc",
    assigneeName: "Marc Puig",
    dueDate: "2026-04-15",
    startDate: "2026-03-10",
    createdAt: "2026-03-05T00:00:00Z",
    updatedAt: now,
    estimatedHours: 80,
    actualHours: 45,
  },
  {
    id: "tsk_003",
    title: "Tractament anti-corrosio",
    description: "Aplicar tractament anti-corrosio a tota la estructura metàl·lica",
    projectId: "prj_002",
    projectName: "Velero Classic",
    status: "pendent",
    priority: "alta",
    assigneeId: "user_anna",
    assigneeName: "Anna Vidal",
    dueDate: "2026-05-01",
    startDate: null,
    createdAt: "2026-03-20T00:00:00Z",
    updatedAt: now,
    estimatedHours: 40,
    actualHours: null,
    dependencies: ["tsk_002"],
  },
  {
    id: "tsk_004",
    title: "Instal·lacio sistema elèctric",
    description: "Muntatge complet del sistema elèctric i electrònic",
    projectId: "prj_001",
    projectName: "Iot Luxe 18m",
    status: "pendent",
    priority: "alta",
    assigneeId: "user_pere",
    assigneeName: "Pere Soler",
    dueDate: "2026-06-01",
    startDate: null,
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: now,
    estimatedHours: 100,
    actualHours: null,
    dependencies: ["tsk_001"],
  },
  {
    id: "tsk_005",
    title: "Revisio motors principals",
    description: "Revisio completa dels motors i sistema de propulsio",
    projectId: "prj_003",
    projectName: "Manteniment Flota",
    status: "completat",
    priority: "normal",
    assigneeId: "user_marc",
    assigneeName: "Marc Puig",
    dueDate: "2026-03-30",
    startDate: "2026-03-15",
    createdAt: "2026-03-10T00:00:00Z",
    updatedAt: "2026-03-28T00:00:00Z",
    estimatedHours: 30,
    actualHours: 28,
  },
  {
    id: "tsk_006",
    title: "Pintura casc exterior",
    description: "Pintar el casc exterior amb dues capes d'antifouling",
    projectId: "prj_003",
    projectName: "Manteniment Flota",
    status: "revisio",
    priority: "normal",
    assigneeId: "user_anna",
    assigneeName: "Anna Vidal",
    dueDate: "2026-04-10",
    startDate: "2026-03-25",
    createdAt: "2026-03-20T00:00:00Z",
    updatedAt: now,
    estimatedHours: 50,
    actualHours: 48,
  },
  {
    id: "tsk_007",
    title: "Seleccio materials premium",
    description: "Seleccionar els materials premium per l'interior del iot",
    projectId: "prj_001",
    projectName: "Iot Luxe 18m",
    status: "completat",
    priority: "alta",
    assigneeId: "user_laura",
    assigneeName: "Laura Fernandez",
    dueDate: "2026-03-20",
    startDate: "2026-03-01",
    createdAt: "2026-02-28T00:00:00Z",
    updatedAt: "2026-03-19T00:00:00Z",
    estimatedHours: 20,
    actualHours: 18,
  },
  {
    id: "tsk_008",
    title: "Inspeccio seguretat anual",
    description: "Realitzar la inspeccio de seguretat anual obligatòria",
    projectId: "prj_003",
    projectName: "Manteniment Flota",
    status: "bloquejat",
    priority: "critica",
    assigneeId: "user_marc",
    assigneeName: "Marc Puig",
    dueDate: "2026-04-05",
    startDate: null,
    createdAt: "2026-03-25T00:00:00Z",
    updatedAt: now,
    estimatedHours: 15,
    actualHours: null,
  },
]

const seedEvents: CalendarEvent[] = [
  {
    id: "evt_001",
    title: "Entrega Iot Luxe",
    description: "Entrega oficial del iot al client",
    type: "delivery",
    startDate: "2026-09-30",
    endDate: "2026-09-30",
    allDay: true,
    location: "Port Barcelona",
    projectId: "prj_001",
    createdAt: now,
  },
  {
    id: "evt_002",
    title: "Reunio equip projecte",
    description: "Reunio setmanal del equip",
    type: "meeting",
    startDate: "2026-04-20T10:00:00Z",
    endDate: "2026-04-20T11:30:00Z",
    allDay: false,
    location: "Sala reunions",
    projectId: null,
    createdAt: now,
  },
  {
    id: "evt_003",
    title: "Revisio casc Velero",
    description: "Revisio estructural del casc",
    type: "task",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    allDay: true,
    location: "Dic sec 2",
    projectId: "prj_002",
    createdAt: now,
  },
]

const seedChecklists: Checklist[] = [
  {
    id: "chk_001",
    name: "Pre-lliurament Iot Luxe",
    projectId: "prj_001",
    projectName: "Iot Luxe 18m",
    createdAt: now,
    updatedAt: now,
    items: [
      { id: "chki_001", text: "Revisar instal·lacio elèctrica", completed: true, completedAt: "2026-03-15T00:00:00Z", completedBy: "Marc Puig", notes: "" },
      { id: "chki_002", text: "Comprovar sistemes de navegacio", completed: true, completedAt: "2026-03-18T00:00:00Z", completedBy: "Pere Soler", notes: "" },
      { id: "chki_003", text: "Inspeccio motors", completed: false, completedAt: null, completedBy: null, notes: "" },
      { id: "chki_004", text: "Prova de navegacio", completed: false, completedAt: null, completedBy: null, notes: "" },
      { id: "chki_005", text: "Documentacio final", completed: false, completedAt: null, completedBy: null, notes: "" },
    ],
  },
  {
    id: "chk_002",
    name: "Seguretat diaria",
    projectId: null,
    projectName: null,
    createdAt: now,
    updatedAt: now,
    items: [
      { id: "chki_006", text: "Revisar EPIs del personal", completed: true, completedAt: now, completedBy: "Miguel Torres", notes: "" },
      { id: "chki_007", text: "Comprovar extintors", completed: true, completedAt: now, completedBy: "Miguel Torres", notes: "" },
      { id: "chki_008", text: "Inspeccio zones de treball", completed: false, completedAt: null, completedBy: null, notes: "" },
    ],
  },
]

const seedDocuments: Document[] = [
  {
    id: "doc_001",
    name: "Planols_IotLuxe_v2.pdf",
    description: "Planols tècnics del iot",
    category: "plans",
    projectId: "prj_001",
    projectName: "Iot Luxe 18m",
    size: 5242880,
    mimeType: "application/pdf",
    uploadedBy: "Jordi Garcia",
    createdAt: "2026-03-10T00:00:00Z",
    tags: ["planol", "tecnic"],
  },
  {
    id: "doc_002",
    name: "Contracte_Hidalgo.pdf",
    description: "Contracte signat amb el client",
    category: "contracts",
    projectId: "prj_001",
    projectName: "Iot Luxe 18m",
    size: 1048576,
    mimeType: "application/pdf",
    uploadedBy: "Carlos Martinez",
    createdAt: "2026-01-15T00:00:00Z",
    tags: ["contracte", "legal"],
  },
  {
    id: "doc_003",
    name: "Fotos_Progres_Mars.zip",
    description: "Fotos del progres",
    category: "photos",
    projectId: "prj_002",
    projectName: "Velero Classic",
    size: 15728640,
    mimeType: "application/zip",
    uploadedBy: "Marc Puig",
    createdAt: "2026-03-28T00:00:00Z",
    tags: ["fotos", "progres"],
  },
]

const seedThreads: ForumThread[] = [
  {
    id: "thr_001",
    title: "Noves normatives de seguretat 2026",
    content: "Com sabeu, aquest any han entrat en vigor les noves normatives de seguretat per a astillers. Aqui us deixo un resum dels canvis més importants que afecten al nostre dia a dia...",
    categoryId: "cat_normatives",
    categoryName: "Normatives",
    categoryColor: "red",
    authorId: "demo-admin",
    authorName: "Carlos Martinez",
    authorRole: "Administrador",
    votes: 15,
    userVote: 0,
    replyCount: 8,
    viewCount: 142,
    isPinned: true,
    isLocked: false,
    createdAt: "2026-04-10T10:00:00Z",
    lastReplyAt: "2026-04-16T15:30:00Z",
    replies: [
      {
        id: "rpl_001",
        threadId: "thr_001",
        parentId: null,
        content: "Gràcies per la informacio! Hem d'actualitzar els nostres protocols.",
        authorId: "demo-manager",
        authorName: "Ana Garcia",
        authorRole: "Project Manager",
        votes: 5,
        userVote: 0,
        createdAt: "2026-04-10T11:30:00Z",
      },
    ],
  },
  {
    id: "thr_002",
    title: "Consells per treballar amb fibra de carboni",
    content: "Despres de 15 anys treballant amb fibra de carboni, vull compartir alguns consells que m'han estat molt útils...",
    categoryId: "cat_tecnic",
    categoryName: "Tècnic",
    categoryColor: "blue",
    authorId: "user_marc",
    authorName: "Marc Puig",
    authorRole: "Supervisor",
    votes: 23,
    userVote: 0,
    replyCount: 12,
    viewCount: 285,
    isPinned: false,
    isLocked: false,
    createdAt: "2026-04-08T09:15:00Z",
    lastReplyAt: "2026-04-15T14:00:00Z",
    replies: [],
  },
  {
    id: "thr_003",
    title: "Dubte sobre el nou sistema de checklist",
    content: "Algú em pot explicar com funcionen les checklists compartides? Vull crear una per a tot l'equip...",
    categoryId: "cat_ajuda",
    categoryName: "Ajuda",
    categoryColor: "green",
    authorId: "user_anna",
    authorName: "Anna Vidal",
    authorRole: "Operari",
    votes: 3,
    userVote: 0,
    replyCount: 4,
    viewCount: 45,
    isPinned: false,
    isLocked: false,
    createdAt: "2026-04-14T16:20:00Z",
    lastReplyAt: "2026-04-15T10:45:00Z",
    replies: [],
  },
]

const seedChannels: ChatChannel[] = [
  {
    id: "ch_general",
    name: "general",
    type: "public",
    description: "Canal general de l'empresa",
    memberIds: ["demo-admin", "demo-manager", "demo-operari"],
    lastMessageAt: now,
    unreadCount: 0,
  },
  {
    id: "ch_iot_luxe",
    name: "projecte-iot-luxe",
    type: "public",
    description: "Canal del projecte Iot Luxe",
    memberIds: ["demo-admin", "demo-manager"],
    lastMessageAt: now,
    unreadCount: 2,
  },
  {
    id: "ch_direccio",
    name: "direccio",
    type: "private",
    description: "Canal privat de direccio",
    memberIds: ["demo-admin", "demo-manager"],
    lastMessageAt: now,
    unreadCount: 0,
  },
]

const seedMessages: ChatMessage[] = [
  {
    id: "msg_001",
    channelId: "ch_general",
    authorId: "demo-admin",
    authorName: "Carlos Martinez",
    content: "Bon dia equip! Recordeu la reunio setmanal demà a les 10h.",
    createdAt: "2026-04-16T08:00:00Z",
    edited: false,
  },
  {
    id: "msg_002",
    channelId: "ch_general",
    authorId: "demo-manager",
    authorName: "Ana Garcia",
    content: "Bon dia Carlos! Confirmat, hi serem.",
    createdAt: "2026-04-16T08:15:00Z",
    edited: false,
  },
  {
    id: "msg_003",
    channelId: "ch_iot_luxe",
    authorId: "demo-manager",
    authorName: "Ana Garcia",
    content: "Els planols v2 ja estan aprovats per el client. Podem començar la fase 3.",
    createdAt: "2026-04-15T14:30:00Z",
    edited: false,
  },
]

const seedNotifications: Notification[] = [
  {
    id: "ntf_001",
    type: "task",
    title: "Nova tasca assignada",
    description: "Ana Garcia t'ha assignat: Tractament anti-corrosio",
    read: false,
    actionUrl: "/tasks/tsk_003",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    priority: "high",
    relatedTaskId: "tsk_003",
    relatedUserId: "user_ana",
  },
  {
    id: "ntf_002",
    type: "mention",
    title: "Menció al fòrum",
    description: "Marc Puig t'ha mencionat a: Consells fibra de carboni",
    read: false,
    actionUrl: "/forum/thr_002",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: "normal",
    relatedUserId: "user_marc",
  },
  {
    id: "ntf_003",
    type: "project",
    title: "Projecte actualitzat",
    description: "El projecte 'Iot Luxe 18m' ha passat al 65% de progrès",
    read: true,
    actionUrl: "/projects/prj_001",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    priority: "low",
    relatedProjectId: "prj_001",
  },
  {
    id: "ntf_004",
    type: "message",
    title: "Nou missatge directe",
    description: "Carlos Martinez: Pots revisar els planols?",
    read: false,
    actionUrl: "/chat",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    priority: "normal",
    relatedUserId: "demo-admin",
  },
  {
    id: "ntf_005",
    type: "task",
    title: "Tasca proxima al venciment",
    description: "La tasca 'Disseny i plànols' venç en 2 dies",
    read: false,
    actionUrl: "/tasks/tsk_001",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    priority: "urgent",
    relatedTaskId: "tsk_001",
  },
  {
    id: "ntf_006",
    type: "system",
    title: "Backup complet",
    description: "El backup automatic s'ha completat correctament",
    read: true,
    actionUrl: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    priority: "low",
  },
]

const seedUsers: User[] = [
  {
    id: "demo-admin",
    name: "Carlos Martinez",
    email: "admin@maximyachts.com",
    role: "admin",
    roleLabel: "Administrador",
    department: "Direccio",
    status: "active",
    phone: "+34 600 000 001",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "demo-manager",
    name: "Ana Garcia",
    email: "manager@maximyachts.com",
    role: "cap_projecte",
    roleLabel: "Project Manager",
    department: "Projectes",
    status: "active",
    phone: "+34 600 000 002",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "demo-operari",
    name: "Miguel Torres",
    email: "operari@maximyachts.com",
    role: "operari",
    roleLabel: "Operari",
    department: "Produccio",
    status: "active",
    phone: "+34 600 000 003",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-02-10T00:00:00Z",
  },
  {
    id: "user_marc",
    name: "Marc Puig",
    email: "marc.puig@maximyachts.com",
    role: "operari",
    roleLabel: "Supervisor",
    department: "Produccio",
    status: "active",
    phone: "+34 600 000 004",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-05-05T00:00:00Z",
  },
  {
    id: "user_anna",
    name: "Anna Vidal",
    email: "anna.vidal@maximyachts.com",
    role: "operari",
    roleLabel: "Operari",
    department: "Carpinteria",
    status: "active",
    phone: "+34 600 000 005",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-04-12T00:00:00Z",
  },
  {
    id: "user_jordi",
    name: "Jordi Garcia",
    email: "jordi.garcia@maximyachts.com",
    role: "cap_projecte",
    roleLabel: "Enginyer",
    department: "Disseny",
    status: "active",
    phone: "+34 600 000 006",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-06-20T00:00:00Z",
  },
  {
    id: "user_pere",
    name: "Pere Soler",
    email: "pere.soler@maximyachts.com",
    role: "operari",
    roleLabel: "Electricista",
    department: "Electricitat",
    status: "active",
    phone: "+34 600 000 007",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2023-07-10T00:00:00Z",
  },
  {
    id: "user_laura",
    name: "Laura Fernandez",
    email: "laura.fernandez@maximyachts.com",
    role: "admin",
    roleLabel: "Administracio",
    department: "Administracio",
    status: "pending",
    phone: "+34 600 000 008",
    avatarUrl: null,
    lastActive: now,
    createdAt: "2026-04-15T00:00:00Z",
    points: 50,
    streak: 1,
    achievements: [],
  },
]

// Add points and streaks to all existing users
seedUsers.forEach((u, i) => {
  if (u.points === undefined) u.points = [1250, 890, 2100, 450, 1680, 720, 1120, 50][i] ?? 0
  if (u.streak === undefined) u.streak = [7, 3, 12, 1, 15, 2, 5, 0][i] ?? 0
  if (u.achievements === undefined) u.achievements = []
})

const seedAchievements: Achievement[] = [
  {
    id: "ach_first_task",
    name: "Primera Tasca",
    description: "Completa la teva primera tasca",
    icon: "check-circle",
    points: 10,
    condition: "complete_1_task",
  },
  {
    id: "ach_10_tasks",
    name: "Treballador",
    description: "Completa 10 tasques",
    icon: "zap",
    points: 50,
    condition: "complete_10_tasks",
  },
  {
    id: "ach_50_tasks",
    name: "Expert",
    description: "Completa 50 tasques",
    icon: "award",
    points: 200,
    condition: "complete_50_tasks",
  },
  {
    id: "ach_streak_7",
    name: "Constant",
    description: "Activitat durant 7 dies seguits",
    icon: "flame",
    points: 100,
    condition: "streak_7",
  },
  {
    id: "ach_streak_30",
    name: "Incansable",
    description: "Activitat durant 30 dies seguits",
    icon: "trophy",
    points: 500,
    condition: "streak_30",
  },
  {
    id: "ach_first_project",
    name: "Capita",
    description: "Lidera el teu primer projecte",
    icon: "anchor",
    points: 75,
    condition: "lead_1_project",
  },
  {
    id: "ach_early_bird",
    name: "Matiner",
    description: "Completa una tasca abans de les 8h",
    icon: "sunrise",
    points: 25,
    condition: "early_task",
  },
  {
    id: "ach_team_player",
    name: "Equip",
    description: "Colabora en 5 projectes diferents",
    icon: "users",
    points: 150,
    condition: "collaborate_5",
  },
]

const seedActivities: Activity[] = [
  {
    id: "act_001",
    type: "task_completed",
    actorId: "user_marc",
    actorName: "Marc Puig",
    targetType: "task",
    targetId: "tsk_003",
    targetName: "Soldadura estructura cala",
    description: "ha completat la tasca",
    reactions: { "like": ["user_ana", "user_joan"], "fire": ["user_sofia"] },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "act_002",
    type: "project_created",
    actorId: "user_ana",
    actorName: "Ana Garcia",
    targetType: "project",
    targetId: "prj_003",
    targetName: "Manteniment Flota",
    description: "ha creat un nou projecte",
    reactions: { "like": ["user_marc", "user_joan", "user_sofia"] },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_003",
    type: "document_uploaded",
    actorId: "user_joan",
    actorName: "Joan Marti",
    targetType: "document",
    targetId: "doc_001",
    targetName: "Planos_Iot_Luxe_v3.pdf",
    description: "ha pujat un document",
    reactions: { "like": ["user_ana"] },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_004",
    type: "checklist_completed",
    actorId: "user_sofia",
    actorName: "Sofia Lopez",
    targetType: "checklist",
    targetId: "chk_001",
    targetName: "Revisio seguretat diaria",
    description: "ha completat la checklist",
    reactions: { "like": ["user_marc"], "star": ["user_ana"] },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_005",
    type: "comment_added",
    actorId: "user_marc",
    actorName: "Marc Puig",
    targetType: "task",
    targetId: "tsk_001",
    targetName: "Instalacio motor principal",
    description: "ha comentat",
    metadata: { comment: "He revisat les especificacions tecniques." },
    reactions: {},
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_006",
    type: "task_status_changed",
    actorId: "user_joan",
    actorName: "Joan Marti",
    targetType: "task",
    targetId: "tsk_002",
    targetName: "Revisio electricitat",
    description: "ha canviat l'estat a En curs",
    metadata: { from: "pendent", to: "en_curs" },
    reactions: {},
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_007",
    type: "forum_post",
    actorId: "user_ana",
    actorName: "Ana Garcia",
    targetType: "forum",
    targetId: "thread_001",
    targetName: "Proposta nou sistema de gestio",
    description: "ha creat un tema al forum",
    reactions: { "like": ["user_marc", "user_sofia"] },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_008",
    type: "achievement_unlocked",
    actorId: "user_sofia",
    actorName: "Sofia Lopez",
    targetType: "user",
    targetId: "ach_streak_7",
    targetName: "Constant",
    description: "ha desbloquejat un assoliment",
    reactions: { "fire": ["user_marc", "user_ana", "user_joan"] },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: seedProjects,
      tasks: seedTasks,
      events: seedEvents,
      checklists: seedChecklists,
      documents: seedDocuments,
      threads: seedThreads,
      messages: seedMessages,
      channels: seedChannels,
      notifications: seedNotifications,
      users: seedUsers,
      activities: seedActivities,
      achievements: seedAchievements,

      // Projects
      addProject: (project) => {
        const id = `prj_${nanoid(8)}`
        const newProject: Project = {
          ...project,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ projects: [newProject, ...state.projects] }))
        return id
      },
      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
        })),

      // Tasks
      addTask: (task) => {
        const id = `tsk_${nanoid(8)}`
        const newTask: Task = {
          ...task,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [newTask, ...state.tasks] }))
        return id
      },
      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          ),
        })),

      addComment: (taskId, comment) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...(t.comments || []),
                    {
                      id: `cmt_${nanoid(8)}`,
                      createdAt: new Date().toISOString(),
                      ...comment,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      // Events
      addEvent: (event) => {
        const id = `evt_${nanoid(8)}`
        const newEvent: CalendarEvent = {
          ...event,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ events: [newEvent, ...state.events] }))
        return id
      },
      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

      // Checklists
      addChecklist: (checklist) => {
        const id = `chk_${nanoid(8)}`
        const newChecklist: Checklist = {
          ...checklist,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ checklists: [newChecklist, ...state.checklists] }))
        return id
      },
      updateChecklist: (id, data) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        })),
      deleteChecklist: (id) =>
        set((state) => ({ checklists: state.checklists.filter((c) => c.id !== id) })),
      addChecklistItem: (checklistId, text) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === checklistId
              ? {
                  ...c,
                  items: [
                    ...c.items,
                    {
                      id: `chki_${nanoid(8)}`,
                      text,
                      completed: false,
                      completedAt: null,
                      completedBy: null,
                      notes: "",
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),
      toggleChecklistItem: (checklistId, itemId, userName) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === checklistId
              ? {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId
                      ? {
                          ...i,
                          completed: !i.completed,
                          completedAt: !i.completed ? new Date().toISOString() : null,
                          completedBy: !i.completed ? userName : null,
                        }
                      : i
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),
      deleteChecklistItem: (checklistId, itemId) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === checklistId
              ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
              : c
          ),
        })),
      updateChecklistItem: (checklistId, itemId, data) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === checklistId
              ? {
                  ...c,
                  items: c.items.map((i) => (i.id === itemId ? { ...i, ...data } : i)),
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),

      // Documents
      addDocument: (doc) => {
        const id = `doc_${nanoid(8)}`
        const newDoc: Document = {
          ...doc,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ documents: [newDoc, ...state.documents] }))
        return id
      },
      deleteDocument: (id) =>
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),

      // Forum
      addThread: (thread) => {
        const id = `thr_${nanoid(8)}`
        const newThread: ForumThread = {
          ...thread,
          id,
          votes: 0,
          userVote: 0,
          replyCount: 0,
          viewCount: 0,
          isPinned: false,
          isLocked: false,
          createdAt: new Date().toISOString(),
          lastReplyAt: new Date().toISOString(),
          replies: [],
        }
        set((state) => ({ threads: [newThread, ...state.threads] }))
        return id
      },
      voteThread: (id, vote) =>
        set((state) => ({
          threads: state.threads.map((t) => {
            if (t.id !== id) return t
            const diff = vote - t.userVote
            return { ...t, votes: t.votes + diff, userVote: vote }
          }),
        })),
      addReply: (threadId, content, parentId, author) =>
        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  replies: [
                    ...t.replies,
                    {
                      id: `rpl_${nanoid(8)}`,
                      threadId,
                      parentId,
                      content,
                      authorId: author.id,
                      authorName: author.name,
                      authorRole: author.role,
                      votes: 0,
                      userVote: 0,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  replyCount: t.replyCount + 1,
                  lastReplyAt: new Date().toISOString(),
                }
              : t
          ),
        })),
      voteReply: (threadId, replyId, vote) =>
        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  replies: t.replies.map((r) => {
                    if (r.id !== replyId) return r
                    const diff = vote - r.userVote
                    return { ...r, votes: r.votes + diff, userVote: vote }
                  }),
                }
              : t
          ),
        })),

      // Chat
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg_${nanoid(8)}`,
          createdAt: new Date().toISOString(),
          edited: false,
        }
        set((state) => ({
          messages: [...state.messages, newMessage],
          channels: state.channels.map((c) =>
            c.id === message.channelId
              ? { ...c, lastMessageAt: newMessage.createdAt }
              : c
          ),
        }))
      },
      deleteMessage: (id) =>
        set((state) => ({ messages: state.messages.filter((m) => m.id !== id) })),

      // Notifications
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      snoozeNotification: (id, until) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, snoozedUntil: until, read: true } : n,
          ),
        })),
      addNotification: (notification) => {
        const newNotif: Notification = {
          ...notification,
          id: `ntf_${nanoid(8)}`,
          read: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ notifications: [newNotif, ...state.notifications] }))
      },

      // Users
      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: `usr_${nanoid(8)}`,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, newUser] }))
      },
      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
      toggleUserStatus: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, status: u.status === "active" ? "inactive" : "active" }
              : u
          ),
        })),

      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `act_${nanoid(8)}`,
          createdAt: new Date().toISOString(),
          reactions: activity.reactions ?? {},
        }
        set((state) => ({ activities: [newActivity, ...state.activities].slice(0, 200) }))
      },

      reactToActivity: (activityId, userId, emoji) =>
        set((state) => ({
          activities: state.activities.map((a) => {
            if (a.id !== activityId) return a
            const reactions = { ...(a.reactions || {}) }
            const list = reactions[emoji] || []
            if (list.includes(userId)) {
              reactions[emoji] = list.filter((id) => id !== userId)
              if (reactions[emoji].length === 0) delete reactions[emoji]
            } else {
              reactions[emoji] = [...list, userId]
            }
            return { ...a, reactions }
          }),
        })),

      awardPoints: (userId, points) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, points: (u.points ?? 0) + points } : u
          ),
        })),

      unlockAchievement: (userId, achievementId) =>
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== userId) return u
            if ((u.achievements ?? []).includes(achievementId)) return u
            const achievement = state.achievements.find((a) => a.id === achievementId)
            const extra = achievement?.points ?? 0
            return {
              ...u,
              achievements: [...(u.achievements ?? []), achievementId],
              points: (u.points ?? 0) + extra,
            }
          }),
        })),

      resetStore: () =>
        set({
          projects: seedProjects,
          tasks: seedTasks,
          events: seedEvents,
          checklists: seedChecklists,
          documents: seedDocuments,
          threads: seedThreads,
          messages: seedMessages,
          channels: seedChannels,
          notifications: seedNotifications,
          users: seedUsers,
          activities: seedActivities,
          achievements: seedAchievements,
        }),
    }),
    {
      name: "astillero-pro-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

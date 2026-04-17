import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'cap_projecte', 'operari', 'visitant'] }).notNull().default('operari'),
  department: text('department'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLogin: integer('last_login', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Sessions table
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Projects table
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  clientName: text('client_name'),
  boatModel: text('boat_model'),
  status: text('status', { enum: ['planificacio', 'en_curs', 'pausat', 'completat', 'cancelat'] }).notNull().default('planificacio'),
  priority: text('priority', { enum: ['baixa', 'normal', 'alta', 'critica'] }).notNull().default('normal'),
  startDate: integer('start_date', { mode: 'timestamp' }),
  estimatedEndDate: integer('estimated_end_date', { mode: 'timestamp' }),
  actualEndDate: integer('actual_end_date', { mode: 'timestamp' }),
  progress: real('progress').notNull().default(0),
  managerId: text('manager_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Tasks table
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  parentTaskId: text('parent_task_id'),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['pendent', 'en_curs', 'revisio', 'completat', 'bloquejat'] }).notNull().default('pendent'),
  priority: text('priority', { enum: ['baixa', 'normal', 'alta', 'critica'] }).notNull().default('normal'),
  assigneeId: text('assignee_id').references(() => users.id),
  estimatedHours: real('estimated_hours'),
  actualHours: real('actual_hours'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  position: integer('position').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Task comments
export const taskComments = sqliteTable('task_comments', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Checklists
export const checklists = sqliteTable('checklists', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdById: text('created_by_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Checklist items
export const checklistItems = sqliteTable('checklist_items', {
  id: text('id').primaryKey(),
  checklistId: text('checklist_id').notNull().references(() => checklists.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  completedById: text('completed_by_id').references(() => users.id),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  position: integer('position').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Documents
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  category: text('category', { enum: ['planol', 'manual', 'certificat', 'foto', 'informe', 'altre'] }).notNull().default('altre'),
  uploadedById: text('uploaded_by_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Forum categories
export const forumCategories = sqliteTable('forum_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  color: text('color').notNull().default('#3b82f6'),
  icon: text('icon'),
  position: integer('position').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Forum threads
export const forumThreads = sqliteTable('forum_threads', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => forumCategories.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),
  lastReplyAt: integer('last_reply_at', { mode: 'timestamp' }),
  lastReplyById: text('last_reply_by_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Forum replies
export const forumReplies = sqliteTable('forum_replies', {
  id: text('id').primaryKey(),
  threadId: text('thread_id').notNull().references(() => forumThreads.id, { onDelete: 'cascade' }),
  parentReplyId: text('parent_reply_id'),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  isAcceptedAnswer: integer('is_accepted_answer', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Forum votes
export const forumVotes = sqliteTable('forum_votes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  threadId: text('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  replyId: text('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  voteType: integer('vote_type').notNull(), // 1 for upvote, -1 for downvote
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Chat rooms
export const chatRooms = sqliteTable('chat_rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['public', 'private', 'direct'] }).notNull().default('public'),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  createdById: text('created_by_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Chat room members
export const chatRoomMembers = sqliteTable('chat_room_members', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'member'] }).notNull().default('member'),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  lastReadAt: integer('last_read_at', { mode: 'timestamp' }),
})

// Chat messages
export const chatMessages = sqliteTable('chat_messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  messageType: text('message_type', { enum: ['text', 'image', 'file', 'system'] }).notNull().default('text'),
  fileUrl: text('file_url'),
  replyToId: text('reply_to_id'),
  isEdited: integer('is_edited', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Notifications
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['task_assigned', 'task_updated', 'comment', 'mention', 'deadline', 'forum_reply', 'chat_message', 'system'] }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Activity log
export const activityLog = sqliteTable('activity_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: text('metadata', { mode: 'json' }),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Calendar events
export const calendarEvents = sqliteTable('calendar_events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  allDay: integer('all_day', { mode: 'boolean' }).notNull().default(false),
  type: text('type', { enum: ['reunio', 'entrega', 'revisio', 'festiu', 'altre'] }).notNull().default('altre'),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  createdById: text('created_by_id').notNull().references(() => users.id),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Calendar event attendees
export const calendarEventAttendees = sqliteTable('calendar_event_attendees', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => calendarEvents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['pending', 'accepted', 'declined', 'tentative'] }).notNull().default('pending'),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  managedProjects: many(projects),
  assignedTasks: many(tasks),
  taskComments: many(taskComments),
  documents: many(documents),
  forumThreads: many(forumThreads),
  forumReplies: many(forumReplies),
  chatMessages: many(chatMessages),
  notifications: many(notifications),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  manager: one(users, {
    fields: [projects.managerId],
    references: [users.id],
  }),
  tasks: many(tasks),
  documents: many(documents),
  checklists: many(checklists),
  chatRooms: many(chatRooms),
  calendarEvents: many(calendarEvents),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
  }),
  comments: many(taskComments),
  documents: many(documents),
  checklists: many(checklists),
}))

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, {
    fields: [forumThreads.authorId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}))

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  project: one(projects, {
    fields: [chatRooms.projectId],
    references: [projects.id],
  }),
  createdBy: one(users, {
    fields: [chatRooms.createdById],
    references: [users.id],
  }),
  members: many(chatRoomMembers),
  messages: many(chatMessages),
}))

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type ForumThread = typeof forumThreads.$inferSelect
export type ForumReply = typeof forumReplies.$inferSelect
export type ChatRoom = typeof chatRooms.$inferSelect
export type ChatMessage = typeof chatMessages.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type CalendarEvent = typeof calendarEvents.$inferSelect

import { pgTable, text, integer, real, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'cap_projecte', 'operari', 'visitant'] }).notNull().default('operari'),
  department: text('department'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  isActive: boolean('is_active').notNull().default(true),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  clientName: text('client_name'),
  boatModel: text('boat_model'),
  status: text('status', { enum: ['planificacio', 'en_curs', 'pausat', 'completat', 'cancelat'] }).notNull().default('planificacio'),
  priority: text('priority', { enum: ['baixa', 'normal', 'alta', 'critica'] }).notNull().default('normal'),
  startDate: timestamp('start_date', { withTimezone: true }),
  estimatedEndDate: timestamp('estimated_end_date', { withTimezone: true }),
  actualEndDate: timestamp('actual_end_date', { withTimezone: true }),
  progress: real('progress').notNull().default(0),
  managerId: text('manager_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Tasks table
export const tasks = pgTable('tasks', {
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
  dueDate: timestamp('due_date', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Task comments
export const taskComments = pgTable('task_comments', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Checklists
export const checklists = pgTable('checklists', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdById: text('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Checklist items
export const checklistItems = pgTable('checklist_items', {
  id: text('id').primaryKey(),
  checklistId: text('checklist_id').notNull().references(() => checklists.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedById: text('completed_by_id').references(() => users.id),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Documents
export const documents = pgTable('documents', {
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
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Forum categories
export const forumCategories = pgTable('forum_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  color: text('color').notNull().default('#3b82f6'),
  icon: text('icon'),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Forum threads
export const forumThreads = pgTable('forum_threads', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => forumCategories.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').notNull().default(false),
  isLocked: boolean('is_locked').notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),
  lastReplyAt: timestamp('last_reply_at', { withTimezone: true }),
  lastReplyById: text('last_reply_by_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Forum replies
export const forumReplies = pgTable('forum_replies', {
  id: text('id').primaryKey(),
  threadId: text('thread_id').notNull().references(() => forumThreads.id, { onDelete: 'cascade' }),
  parentReplyId: text('parent_reply_id'),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  isAcceptedAnswer: boolean('is_accepted_answer').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Forum votes
export const forumVotes = pgTable('forum_votes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  threadId: text('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  replyId: text('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  voteType: integer('vote_type').notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Chat rooms
export const chatRooms = pgTable('chat_rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['public', 'private', 'direct'] }).notNull().default('public'),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  createdById: text('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Chat room members
export const chatRoomMembers = pgTable('chat_room_members', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'member'] }).notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  lastReadAt: timestamp('last_read_at', { withTimezone: true }),
})

// Chat messages
export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  messageType: text('message_type', { enum: ['text', 'image', 'file', 'system'] }).notNull().default('text'),
  fileUrl: text('file_url'),
  replyToId: text('reply_to_id'),
  isEdited: boolean('is_edited').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Notifications
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['task_assigned', 'task_updated', 'comment', 'mention', 'deadline', 'forum_reply', 'chat_message', 'system'] }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').notNull().default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Activity log
export const activityLog = pgTable('activity_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Calendar events
export const calendarEvents = pgTable('calendar_events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  allDay: boolean('all_day').notNull().default(false),
  type: text('type', { enum: ['reunio', 'entrega', 'revisio', 'festiu', 'altre'] }).notNull().default('altre'),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  createdById: text('created_by_id').notNull().references(() => users.id),
  color: text('color'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Calendar event attendees
export const calendarEventAttendees = pgTable('calendar_event_attendees', {
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

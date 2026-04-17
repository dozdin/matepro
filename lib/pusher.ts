import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
  useTLS: true,
})

// Client-side Pusher instance (singleton)
let pusherClientInstance: PusherClient | null = null

export function getPusherClient(): PusherClient {
  if (!pusherClientInstance && typeof window !== 'undefined') {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY || '',
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
        authEndpoint: '/api/pusher/auth',
      }
    )
  }
  return pusherClientInstance as PusherClient
}

// Channel naming conventions
export const CHANNELS = {
  // Global channels
  notifications: (userId: string) => `private-notifications-${userId}`,
  presence: 'presence-online',
  
  // Chat channels
  chatRoom: (roomId: string) => `private-chat-${roomId}`,
  chatPresence: (roomId: string) => `presence-chat-${roomId}`,
  
  // Project channels
  project: (projectId: string) => `private-project-${projectId}`,
  
  // Forum channels
  forumThread: (threadId: string) => `private-forum-${threadId}`,
} as const

// Event types
export const EVENTS = {
  // Chat events
  newMessage: 'new-message',
  messageUpdated: 'message-updated',
  messageDeleted: 'message-deleted',
  typing: 'client-typing',
  stopTyping: 'client-stop-typing',
  
  // Notification events
  newNotification: 'new-notification',
  notificationRead: 'notification-read',
  
  // Task events
  taskUpdated: 'task-updated',
  taskCreated: 'task-created',
  taskDeleted: 'task-deleted',
  
  // Project events
  projectUpdated: 'project-updated',
  
  // Forum events
  newReply: 'new-reply',
  replyUpdated: 'reply-updated',
} as const

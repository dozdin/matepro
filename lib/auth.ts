import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'astillero-pro-secret-key-change-in-production'

// Demo mode: when TURSO_DATABASE_URL is not set, use mock authentication
const IS_DEMO_MODE = !process.env.TURSO_DATABASE_URL

export type AuthUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'cap_projecte' | 'operari' | 'visitant'
  department: string | null
  avatarUrl: string | null
}

// Demo users for testing without database
const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  'admin@maximyachts.com': {
    id: 'demo-admin',
    email: 'admin@maximyachts.com',
    name: 'Carlos Martinez',
    role: 'admin',
    department: 'Direccion',
    avatarUrl: null,
    password: 'admin123',
  },
  'manager@maximyachts.com': {
    id: 'demo-manager',
    email: 'manager@maximyachts.com',
    name: 'Ana Garcia',
    role: 'cap_projecte',
    department: 'Proyectos',
    avatarUrl: null,
    password: 'manager123',
  },
  'operari@maximyachts.com': {
    id: 'demo-operari',
    email: 'operari@maximyachts.com',
    name: 'Miguel Torres',
    role: 'operari',
    department: 'Produccion',
    avatarUrl: null,
    password: 'operari123',
  },
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  if (IS_DEMO_MODE) {
    // In demo mode, find user by ID from demo users
    const demoUser = Object.values(DEMO_USERS).find(u => u.id === payload.userId)
    if (demoUser) {
      const { password: _, ...user } = demoUser
      return user
    }
    return null
  }

  // Production mode with real database
  try {
    const { db, users, sessions } = await import('@/lib/db')
    const { eq, and, gt } = await import('drizzle-orm')
    
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      ),
    })

    if (!session) {
      return null
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    })

    if (!user || !user.isActive) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
    }
  } catch (error) {
    console.error('Database error in getSession:', error)
    return null
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string; user?: AuthUser }> {
  if (IS_DEMO_MODE) {
    // Demo mode authentication
    const demoUser = DEMO_USERS[email.toLowerCase()]
    
    if (!demoUser) {
      return { success: false, error: 'Credencials incorrectes' }
    }

    if (demoUser.password !== password) {
      return { success: false, error: 'Credencials incorrectes' }
    }

    const token = generateToken(demoUser.id)
    const { password: _, ...user } = demoUser
    return { success: true, token, user }
  }

  // Production mode with real database
  try {
    const { db, users, sessions } = await import('@/lib/db')
    const { eq } = await import('drizzle-orm')
    const bcrypt = await import('bcryptjs')
    const { nanoid } = await import('@/lib/nanoid')

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (!user) {
      return { success: false, error: 'Credencials incorrectes' }
    }

    if (!user.isActive) {
      return { success: false, error: 'Compte desactivat' }
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { success: false, error: 'Credencials incorrectes' }
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id))

    // Create session
    const token = generateToken(user.id)
    const sessionId = nanoid()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      token,
      expiresAt,
      createdAt: new Date(),
    })

    return { 
      success: true, 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
      }
    }
  } catch (error) {
    console.error('Database error in login:', error)
    return { success: false, error: 'Error de connexio amb la base de dades' }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token && !IS_DEMO_MODE) {
    try {
      const { db, sessions } = await import('@/lib/db')
      const { eq } = await import('drizzle-orm')
      await db.delete(sessions).where(eq(sessions.token, token))
    } catch (error) {
      console.error('Database error in logout:', error)
    }
  }
}

export function requireAuth(allowedRoles?: AuthUser['role'][]): (user: AuthUser | null) => boolean {
  return (user: AuthUser | null) => {
    if (!user) return false
    if (!allowedRoles) return true
    return allowedRoles.includes(user.role)
  }
}

export function isDemoMode(): boolean {
  return IS_DEMO_MODE
}

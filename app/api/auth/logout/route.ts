import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    await logout()
    
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Error al tancar sessió' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i contrasenya són obligatoris' },
        { status: 400 }
      )
    }

    const result = await login(email, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error intern del servidor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Force session refresh by returning success
    return NextResponse.json({ 
      success: true, 
      message: 'Session refreshed',
      user: session.user 
    })
  } catch (error) {
    console.error('Error refreshing session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
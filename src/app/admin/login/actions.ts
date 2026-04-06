'use server'

import { cookies } from 'next/headers'

export async function authenticateUser(password: string) {

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    
    cookieStore.set('admin_session', password, {
      path: '/',
      maxAge: 86400, 
      sameSite: 'strict',
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
    })
    
    return { success: true }
  }
  
  return { success: false }
}
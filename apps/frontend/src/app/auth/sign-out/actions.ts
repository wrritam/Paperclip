"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('paperclip_login')

  redirect('/auth/login')
}

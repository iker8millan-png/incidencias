import type { AuthSession } from '../types'
import { getSupabase, getSupabaseAuthEmail, isSupabaseConfigured } from './supabase'

const SESSION_KEY = 'appincidencias_session'
const PLACEHOLDER_PASSWORD = 'tu-contraseña-segura'

function getAppPassword(): string {
  const password = import.meta.env.VITE_APP_PASSWORD?.trim()
  if (!password || password === PLACEHOLDER_PASSWORD) return ''
  return password
}

function getAdminPassword(): string {
  return (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim() ?? ''
}

export function isLocalAuthConfigured(): boolean {
  return getAppPassword().length > 0
}

export function isAdminAuthConfigured(): boolean {
  return getAdminPassword().length > 0
}

export function isAdminSession(session: AuthSession | null | undefined): boolean {
  return session?.role === 'admin'
}

const CENTRO_SESSION: AuthSession = {
  workerId: 'centro',
  displayName: 'Personal del centro',
  role: 'staff',
}

function persistSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/** Email del usuario en Supabase Auth (Authentication → Users). */
function getSupabaseLoginEmail(): string {
  const fromEnv = (import.meta.env.VITE_SUPABASE_AUTH_EMAIL as string | undefined)?.trim()
  if (fromEnv) return fromEnv
  return getSupabaseAuthEmail()
}

export async function login(password: string): Promise<AuthSession> {
  const pass = password

  if (isSupabaseConfigured()) {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase no disponible')
    const email = getSupabaseLoginEmail()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error || !data.user) throw new Error('Contraseña incorrecta')
    const session: AuthSession = {
      workerId: data.user.id,
      displayName:
        (data.user.user_metadata?.displayName as string) || CENTRO_SESSION.displayName,
      role: 'staff',
    }
    persistSession(session)
    return session
  }

  const expected = getAppPassword()
  if (!expected) {
    throw new Error('La aplicación no está configurada. Contacta con el administrador.')
  }
  if (pass !== expected) {
    throw new Error('Contraseña incorrecta')
  }

  const session: AuthSession = { ...CENTRO_SESSION, role: 'staff' }
  persistSession(session)
  return session
}

export async function loginAsAdmin(
  centerPassword: string,
  adminPassword: string,
): Promise<AuthSession> {
  const expectedAdmin = getAdminPassword()
  if (!expectedAdmin) {
    throw new Error('Acceso de administrador no configurado.')
  }
  if (adminPassword !== expectedAdmin) {
    throw new Error('Contraseña de administrador incorrecta')
  }

  const session = await login(centerPassword)
  const adminSession: AuthSession = {
    ...session,
    displayName: 'Administrador',
    role: 'admin',
  }
  persistSession(adminSession)
  return adminSession
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    return { ...session, role: session.role ?? 'staff' }
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
  }
  localStorage.removeItem(SESSION_KEY)
}

export function isUsingLocalMode(): boolean {
  return !isSupabaseConfigured()
}

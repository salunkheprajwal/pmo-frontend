import { getBase, FetchResult } from './shared'

export async function login(email: string, password: string): Promise<FetchResult> {
  const apiBase = getBase()
  const res = await fetch(`${apiBase}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export async function verify(email: string, otp: string): Promise<FetchResult> {
  const apiBase = getBase()
  const res = await fetch(`${apiBase}/api/auth/verify-login-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export async function resendOtp(email: string, password: string): Promise<FetchResult> {
  // For simplicity reuse login endpoint to resend OTP
  return login(email, password)
}

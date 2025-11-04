import { getBase, FetchResult } from './shared'

export async function getProfile(token: string): Promise<FetchResult> {
  const apiBase = getBase()
  const res = await fetch(`${apiBase}/api/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

// Shared utilities and common types for API calls
export type ApiResponse = {
  status: boolean
  message?: string
  [key: string]: any
}

export type FetchResult = {
  ok: boolean
  data: ApiResponse | any
}

export const getBase = () => process.env.NEXT_PUBLIC_API_URL || ''

// Decode a JWT token and return its payload as an object
export function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

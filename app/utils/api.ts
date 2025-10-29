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
type ApiResponse = {
  status: boolean
  message?: string
  [key: string]: any
}

type FetchResult = {
  ok: boolean
  data: ApiResponse | any
}

const getBase = () => process.env.NEXT_PUBLIC_API_URL || ''

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


export async function getProfile(token: string): Promise<FetchResult> {
  const apiBase = getBase()
  const res = await fetch(`${apiBase}/api/user/profile`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}


// Organization Types
export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateOrganizationData = Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrganizationData = Partial<CreateOrganizationData>;

// Organization API Functions
export async function getOrganizations(token: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/organisations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function getOrganization(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/organisations/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createOrganization(
  token: string,
  organizationData: CreateOrganizationData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/organisations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organizationData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function updateOrganization(
  token: string,
  id: string,
  organizationData: UpdateOrganizationData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/organisations/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organizationData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function deleteOrganization(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/organisations/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export default {
  login,
  verify,
  resendOtp,
  getProfile,
  // Organization exports
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
}

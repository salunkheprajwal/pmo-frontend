import { getBase, FetchResult } from './shared'

// Admin Users Types
export interface AdminUserSummary {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  employeeId?: string | null;
  email: string;
  mobileNo?: string | null;
  role?: string | null;
  organisation?: { id: string; name: string } | null;
  designation?: { id: string; name: string } | null;
  department?: { id: string; name: string } | null;
  teamLeader?: { id: string; name: string; email: string } | null;
  teamManager?: { id: string; name: string; email: string } | null;
  isVerified: boolean;
}

export type CreateAdminUserData = {
  name?: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  email: string;
  mobileNo?: string;
  password: string;
  role?: string;
  organisationId?: string | null;
  departmentId?: string | null;
  designationId?: string | null;
  reportingTeamLeaderId?: string | null;
  reportingTeamManagerId?: string | null;
};

export type UpdateAdminUserData = Partial<Omit<CreateAdminUserData, 'password' | 'email'>> & {
  email?: string;
  password?: string;
};

// Admin Users API
export async function getAdminUsers(token: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/admin/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  console.log('getAdminUsers response data:', data);
  return { ok: res.ok, data };
}

export async function getAdminUser(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/admin/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createAdminUser(
  token: string,
  userData: CreateAdminUserData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/admin/users/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function updateAdminUser(
  token: string,
  id: string,
  userData: UpdateAdminUserData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function deleteAdminUser(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

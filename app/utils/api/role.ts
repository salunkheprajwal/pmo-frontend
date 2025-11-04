import { getBase, FetchResult } from './shared'

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateRoleData = {
  name: string;
  description?: string;
};

export type UpdateRoleData = Partial<{
  name: string;
  description: string;
}>;

export interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
}

// Role API Functions
export async function getRoles(token: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  console.log('getRoles response data:', data);
  return { ok: res.ok, data };
}

export async function getRole(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/roles/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createRole(
  token: string,
  roleData: CreateRoleData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function updateRole(
  token: string,
  id: string,
  roleData: UpdateRoleData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/roles/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function deleteRole(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/roles/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

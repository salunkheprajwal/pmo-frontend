import { getBase, FetchResult } from './shared'

export interface Designation {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDesignationData = {
  name: string;
  description?: string;
};

export type UpdateDesignationData = Partial<{
  name: string;
  description: string;
  isActive: boolean;
}>;

// Designation API Functions
export async function getDesignations(token: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/designations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function getDesignation(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/designations/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createDesignation(
  token: string,
  designationData: CreateDesignationData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/designations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(designationData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function updateDesignation(
  token: string,
  id: string,
  designationData: UpdateDesignationData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/designations/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(designationData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function deleteDesignation(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/designations/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

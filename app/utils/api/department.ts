import { getBase, FetchResult } from './shared'

export interface Department {
  id: string;
  name: string;
  description?: string;
  organisationId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  organisation?: {
    id: string;
    name: string;
    address?: string;
  };
}

export type CreateDepartmentData = {
  name: string;
  description?: string;
  organisationId: string;
};

export type UpdateDepartmentData = Partial<{
  name: string;
  description: string;
  organisationId: string;
  isActive: boolean;
}>;


export interface DepartmentFormProps {
  initialData?: Department;
  organizations: { id: string; name: string }[];
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

// Department API Functions
export async function getDepartments(
  token: string,
  organisationId?: string
): Promise<FetchResult> {
  const apiBase = getBase();
  const queryParams = organisationId ? `?organisationId=${organisationId}` : '';
  const res = await fetch(`${apiBase}/api/departments${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function getDepartment(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/departments/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createDepartment(
  token: string,
  departmentData: CreateDepartmentData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/departments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(departmentData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function updateDepartment(
  token: string,
  id: string,
  departmentData: UpdateDepartmentData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/departments/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(departmentData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function deleteDepartment(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/departments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

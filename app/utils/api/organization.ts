import { getBase, FetchResult } from './shared'

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
export interface OrganizationFormProps {
  initialData?: Partial<Organization>;
  onSubmit: (data: CreateOrganizationData | UpdateOrganizationData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export interface OrganizationListProps {
  organizations: Organization[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

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

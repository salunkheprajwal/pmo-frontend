import { getBase, FetchResult } from './shared'

export interface Client {
  id: string;
  clientCode?: string;
  name: string;
  startDate?: string;
  coordinatorFirstName?: string;
  coordinatorLastName?: string;
  coordinatorEmail?: string;
  departmentId?: string;
  officeNo?: string;
  mobileNo?: string;
  streetAddress?: string;
  treeAddress?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: string;
    name: string;
    description?: string;
    organisationId: string;
    isActive: boolean;
  };
  projectManagers?: ProjectManager[];
}

export interface ProjectManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
}

export type CreateClientData = {
  name: string;
  clientCode?: string;
  startDate?: string;
  coordinatorFirstName?: string;
  coordinatorLastName?: string;
  coordinatorEmail?: string;
  departmentId?: string;
  officeNo?: string;
  mobileNo?: string;
  streetAddress?: string;
  treeAddress?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  projectManagerIds?: string[];
};

export type UpdateClientData = Partial<{
  name: string;
  clientCode: string;
  startDate: string;
  coordinatorFirstName: string;
  coordinatorLastName: string;
  coordinatorEmail: string;
  departmentId: string;
  officeNo: string;
  mobileNo: string;
  streetAddress: string;
  treeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  projectManagerIds: string[];
}>;

export interface ClientFormProps {
  initialData?: Client;
  departments: { id: string; name: string }[];
  projectManagers: ProjectManager[];
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

// Client API Functions
export async function getClients(token: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/clients`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  console.log('getClients response data:', data);
  return { ok: res.ok, data };
  
}

export async function getClient(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/clients/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createClient(
  token: string,
  clientData: CreateClientData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/clients`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function updateClient(
  token: string,
  id: string,
  clientData: UpdateClientData
): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function deleteClient(token: string, id: string): Promise<FetchResult> {
  const apiBase = getBase();
  const res = await fetch(`${apiBase}/api/clients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

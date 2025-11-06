import { http } from './apiInstance';

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

export async function getRoles() {
  return http.get('/api/roles');
}

export async function getRole(id: string) {
  return http.get(`/api/roles/${id}`);
}

export async function createRole(roleData: CreateRoleData) {
  return http.post('/api/roles', roleData);
}

export async function updateRole(id: string, roleData: UpdateRoleData) {
  return http.put(`/api/roles/${id}`, roleData);
}

export async function deleteRole(id: string) {
  return http.delete(`/api/roles/${id}`);
}

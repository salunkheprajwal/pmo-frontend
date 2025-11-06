'use client';
import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import DataTable, { Column } from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import RoleForm from './RoleForm';
import { Role } from '@/app/utils/api/role';
import { useApi } from '@/app/context/ApiContext';
import { useToken } from '@/app/context/TokenContext';

export default function RoleList() {
  const api = useApi();
  const { token } = useToken();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRoles(token || '');
      if (response.ok && response.data.data) {
        setRoles(response.data.data);
   
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = async (data: { name: string; description: string }) => {
    try {
      const response = await api.createRole(token || '', data);
      if (response.ok) {
        await fetchRoles();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleEdit = async (data: { name: string; description: string }) => {
    try {
      if (!selectedRole) return;
      const response = await api.updateRole(token || '', selectedRole.id, data);
      if (response.ok) {
        await fetchRoles();
        setIsEditModalOpen(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedRole) return;
      const response = await api.deleteRole(token || '', selectedRole.id);
      if (response.ok) {
        await fetchRoles();
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const columns: Column<Role>[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          Add New Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        onEdit={(role) => {
          setSelectedRole(role);
          setIsEditModalOpen(true);
        }}
        onDelete={(role) => {
          setSelectedRole(role);
          setIsDeleteDialogOpen(true);
        }}
      />

      <RoleForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedRole && (
        <RoleForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          onSubmit={handleEdit}
          initialData={{
            name: selectedRole.name,
            description: selectedRole.description || ''
          }}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${selectedRole?.name}"?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedRole(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
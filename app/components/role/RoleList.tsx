'use client';
import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import DataTable, { Column } from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import RoleForm from './RoleForm';
import { Role } from '@/app/utils/api/role';
import { useApi } from '@/app/context/ApiContext';

export default function RoleList() {
  const api = useApi();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch roles
  const fetchRoles = async () => {
    try {
      setIsLoading(true);
  const response = await api.getRoles();
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

  // ✅ Handle Add Role
  const handleAdd = async (data: { name: string; description: string }) => {
    try {
  const response = await api.createRole(data);
      if (response.ok) {
        await fetchRoles(); // 🔄 Refresh instantly
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  // ✅ Handle Edit Role
  const handleEdit = async (data: { name: string; description: string }) => {
    try {
      if (!selectedRole) return;
  const response = await api.updateRole(selectedRole.id, data);
      if (response.ok) {
        await fetchRoles(); // 🔄 Refresh instantly
        setIsEditModalOpen(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  // ✅ Handle Delete Role
  const handleDelete = async () => {
    try {
      if (!selectedRole) return;
  const response = await api.deleteRole(selectedRole.id);
      if (response.ok) {
        await fetchRoles(); // 🔄 Refresh instantly
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // ✅ Table columns
  const columns: Column<Role>[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
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

      {/* ✅ Add Role Modal */}
      <RoleForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await fetchRoles();
          setIsAddModalOpen(false);
        }}
      />

      {/* ✅ Edit Role Modal */}
      {selectedRole && (
        <RoleForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          initialData={{
            id: selectedRole.id,
            name: selectedRole.name,
            description: selectedRole.description || '',
          }}
          onSuccess={async () => {
            await fetchRoles();
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}

      {/* ✅ Delete Confirmation */}
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

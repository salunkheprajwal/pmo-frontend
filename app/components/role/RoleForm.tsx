'use client';
import { useState } from 'react';
import { http } from '@/app/utils/api/apiInstance';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
// import { toast } from 'react-hot-toast'; // optional for user feedback

interface RoleEntry {
  name: string;
  description: string;
}

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { id?: string; name: string; description: string };
  onSuccess?: () => void; // optional callback to refresh role list
}

export default function RoleForm({ isOpen, onClose, initialData, onSuccess }: RoleFormProps) {
  const [roles, setRoles] = useState<RoleEntry[]>([
    {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  ]);

  const [loading, setLoading] = useState(false);

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validRoles = roles.filter((r) => r.name.trim() !== '');
    if (validRoles.length === 0) {
      console.log('Please enter at least one valid role name.');
      return;
    }

    setLoading(true);

    try {
      if (initialData?.id) {
        // --- UPDATE ROLE ---
        const { ok, data } = await http.put(`/api/roles/${initialData.id}`, validRoles[0]);
        if (ok) {
          // console.log('Role updated successfully.');
        } else {
          console.log(data?.message || 'Failed to update role.');
        }
      } else {
        // --- CREATE ROLES ---
        for (const role of validRoles) {
          const { ok, data } = await http.post('/api/roles', role);
          if (!ok) {
            console.error('Create role failed:', data);
            console.log(data?.message || `Failed to create role: ${role.name}`);
          }
        }
        console.log(`${validRoles.length} role(s) created successfully.`);
      }

      if (onSuccess) onSuccess();
      onClose();
      setRoles([{ name: '', description: '' }]);
    } catch (error) {
      console.error('Error creating/updating roles:', error);
      console.log('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle field change
  const handleRoleChange = (index: number, field: keyof RoleEntry, value: string) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value };
    setRoles(updated);
  };

  // ✅ Add / Remove Role Fields
  const addRole = () => setRoles([...roles, { name: '', description: '' }]);
  const removeRole = (index: number) => {
    if (roles.length > 1) setRoles(roles.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Role' : 'Add New Roles'}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {roles.map((role, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-3 relative">
            {!initialData && roles.length > 1 && (
              <button
                type="button"
                onClick={() => removeRole(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            )}

            {!initialData && roles.length > 1 && (
              <div className="text-sm font-medium text-gray-600">
                Role {index + 1}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Role Name"
                value={role.name}
                onChange={(e) => handleRoleChange(index, 'name', e.target.value)}
                required
              />
              <Input
                label="Description"
                value={role.description}
                onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        {!initialData && (
          <Button type="button" variant="secondary" onClick={addRole} className="w-full">
            + Add Another Role
          </Button>
        )}

        <div className="flex justify-end space-x-2 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading
              ? 'Saving...'
              : initialData
              ? 'Update'
              : `Create ${roles.length > 1 ? `${roles.length} Roles` : 'Role'}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


'use client';
import { useState } from 'react';
import { RoleFormProps } from '@/app/utils/api/role';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';

interface RoleEntry {
  name: string;
  description: string;
}

export default function RoleForm({ isOpen, onClose, onSubmit, initialData }: RoleFormProps) {
  const [roles, setRoles] = useState<RoleEntry[]>([
    {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initialData) {
      onSubmit(roles[0]);
    } else {
      const validRoles = roles.filter(role => role.name.trim() !== '');
      if (validRoles.length > 0) {
        validRoles.forEach(role => onSubmit(role));
      }
    }
    
    // Reset form after submission
    setRoles([{ name: '', description: '' }]);
    onClose();
  };

  const handleRoleChange = (index: number, field: keyof RoleEntry, value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setRoles(updatedRoles);
  };

  const addRole = () => {
    setRoles([...roles, { name: '', description: '' }]);
  };

  const removeRole = (index: number) => {
    if (roles.length > 1) {
      const updatedRoles = roles.filter((_, i) => i !== index);
      setRoles(updatedRoles);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Role' : 'Add New Roles'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {roles.map((role, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-3 relative">
            {!initialData && roles.length > 1 && (
              <button
                type="button"
                onClick={() => removeRole(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
                aria-label="Remove role"
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
          <Button
            type="button"
            variant="secondary"
            onClick={addRole}
            className="w-full"
          >
            + Add Another Role
          </Button>
        )}

        <div className="flex justify-end space-x-2 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update' : `Create ${roles.length > 1 ? `${roles.length} Roles` : 'Role'}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import { Department, Organization, createDepartment, updateDepartment } from '@/app/utils/api';
import Input from '../Input';
import Button from '../Button';

interface DepartmentFormProps {
  initialData?: Department;
  organizations: Organization[];
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DepartmentForm({
  initialData,
  organizations,
  token,
  onSuccess,
  onCancel,
}: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    organisationId: initialData?.organisationId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (initialData) {
        await updateDepartment(token, initialData.id, formData);
      } else {
        await createDepartment(token, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save department:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Department Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Organization
        </label>
        <select
          name="organisationId"
          value={formData.organisationId}
          onChange={(e) => setFormData({ ...formData, organisationId: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          required
        >
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground min-h-[100px]"
          placeholder="Department description"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="button"
          onClick={onCancel}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
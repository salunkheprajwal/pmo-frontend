'use client';

import React, { useState } from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { Department, DepartmentFormProps } from "@/app/utils/api/department";
import { useApi } from '@/app/context/ApiContext';

interface DepartmentEntry {
  name: string;
  description: string;
  organisationId: string;
}

const initialDepartmentState: DepartmentEntry = {
  name: '',
  description: '',
  organisationId: ''
};

export default function DepartmentForm({
  initialData,
  organizations,
  token,
  onSuccess,
  onCancel,
}: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentEntry[]>([
    {
      name: initialData?.name || '',
      description: initialData?.description || '',
      organisationId: initialData?.organisationId || ''
    }
  ]);

  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const validateDepartment = (department: DepartmentEntry, index: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!department.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    
    if (!department.organisationId) {
      newErrors.organisationId = 'Organization is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, [index]: newErrors }));
      return false;
    }

    return true;
  };

  const validateAllDepartments = (): boolean => {
    let isValid = true;
    const allErrors: Record<number, Record<string, string>> = {};

    departments.forEach((dept, index) => {
      const deptErrors: Record<string, string> = {};
      
      if (!dept.name.trim()) {
        deptErrors.name = 'Department name is required';
        isValid = false;
      }
      
      if (!dept.organisationId) {
        deptErrors.organisationId = 'Organization is required';
        isValid = false;
      }

      if (Object.keys(deptErrors).length > 0) {
        allErrors[index] = deptErrors;
      }
    });

    setErrors(allErrors);
    return isValid;
  };

  const api = useApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateAllDepartments()) return;
    
    setIsLoading(true);
    
    try {
      if (initialData) {
        await api.updateDepartment(token, initialData.id, departments[0]);
      } else {
        const validDepartments = departments.filter(dept => dept.name.trim() !== '');
        
        for (const dept of validDepartments) {
          await api.createDepartment(token, dept);
        }
      }
      
      // Reset form after successful submission
      setDepartments([{ ...initialDepartmentState }]);
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error('Failed to save department:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepartmentChange = (
    index: number,
    field: keyof DepartmentEntry,
    value: string
  ): void => {
    setDepartments(prevDepartments => {
      const updatedDepartments = [...prevDepartments];
      updatedDepartments[index] = {
        ...updatedDepartments[index],
        [field]: value
      };
      return updatedDepartments;
    });

    // Clear error for this field
    if (errors[index]?.[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          const { [field]: _, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
        return newErrors;
      });
    }
  };

  const addDepartment = (): void => {
    setDepartments(prevDepartments => [
      ...prevDepartments,
      { ...initialDepartmentState }
    ]);
  };

  const removeDepartment = (index: number): void => {
    if (departments.length > 1) {
      setDepartments(prevDepartments =>
        prevDepartments.filter((_, i) => i !== index)
      );
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const getSubmitButtonText = (): string => {
    if (isLoading) return 'Saving...';
    if (initialData) return 'Update';
    return departments.length > 1
      ? `Create ${departments.length} Departments`
      : 'Create';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {departments.map((department, index) => (
        <div
          key={index}
          className="relative p-3 border border-gray-200 rounded-lg space-y-3"
        >
          {!initialData && departments.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => removeDepartment(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl transition-colors"
                aria-label={`Remove department ${index + 1}`}
              >
                ×
              </button>

              <div className="text-sm font-medium text-gray-600">
                Department {index + 1}
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Department Name"
              name={`name-${index}`}
              value={department.name}
              onChange={(e) => handleDepartmentChange(index, 'name', e.target.value)}
              placeholder="Enter department name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Organization
              </label>
              <select
                name={`organisationId-${index}`}
                value={department.organisationId}
                onChange={(e) => handleDepartmentChange(index, 'organisationId', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-md focus:ring-2 focus:ring-accent/20 focus:border-accent"
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {errors[index]?.organisationId && (
                <p className="mt-1 text-xs text-red-500">{errors[index].organisationId}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              name={`description-${index}`}
              value={department.description}
              onChange={(e) => handleDepartmentChange(index, 'description', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground min-h-20"
              placeholder="Department description"
            />
          </div>
        </div>
      ))}

      {!initialData && (
        <Button
          type="button"
          variant="secondary"
          onClick={addDepartment}
          className="w-full"
        >
          + Add Another Department
        </Button>
      )}

      <div className="flex justify-end space-x-2 pt-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {getSubmitButtonText()}
        </Button>
      </div>
    </form>
  );
}

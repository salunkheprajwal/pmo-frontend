'use client';

import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { OrganizationFormProps } from '@/app/utils/api/organization';

interface OrganizationEntry {
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const initialOrganizationState: OrganizationEntry = {
  name: '',
  address: '',
  phone: '',
  email: '',
  isActive: true
};

export default function OrganizationForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: OrganizationFormProps) {
  const [organizations, setOrganizations] = useState<OrganizationEntry[]>([
    {
      name: initialData?.name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      isActive: initialData?.isActive ?? true
    }
  ]);

  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  useEffect(() => {
    if (initialData) {
      setOrganizations([{
        name: initialData.name || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        isActive: initialData.isActive ?? true
      }]);
    }
  }, [initialData]);

  const validateOrganization = (organization: OrganizationEntry, index: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!organization.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    
    if (organization.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (organization.phone && !/^\+?[\d\s-]+$/.test(organization.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, [index]: newErrors }));
      return false;
    }

    return true;
  };

  const validateAllOrganizations = (): boolean => {
    let isValid = true;
    const allErrors: Record<number, Record<string, string>> = {};

    organizations.forEach((org, index) => {
      const orgErrors: Record<string, string> = {};
      
      if (!org.name.trim()) {
        orgErrors.name = 'Organization name is required';
        isValid = false;
      }
      
      if (org.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.email)) {
        orgErrors.email = 'Invalid email format';
        isValid = false;
      }
      
      if (org.phone && !/^\+?[\d\s-]+$/.test(org.phone)) {
        orgErrors.phone = 'Invalid phone number format';
        isValid = false;
      }

      if (Object.keys(orgErrors).length > 0) {
        allErrors[index] = orgErrors;
      }
    });

    setErrors(allErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateAllOrganizations()) return;
    
    try {
      if (initialData) {
        await onSubmit(organizations[0]);
      } else {
        const validOrganizations = organizations.filter(org => org.name.trim() !== '');
        
        if (validOrganizations.length > 0) {
          for (const org of validOrganizations) {
            await onSubmit(org);
          }
        }
      }
      
      // Reset form after successful submission
      setOrganizations([{ ...initialOrganizationState }]);
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleOrganizationChange = (
    index: number,
    field: keyof OrganizationEntry,
    value: string | boolean
  ): void => {
    setOrganizations(prevOrganizations => {
      const updatedOrganizations = [...prevOrganizations];
      updatedOrganizations[index] = {
        ...updatedOrganizations[index],
        [field]: value
      };
      return updatedOrganizations;
    });

    // Clear error for this field
    if (errors[index]?.[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          const { [field as string]: _, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
        return newErrors;
      });
    }
  };

  const addOrganization = (): void => {
    setOrganizations(prevOrganizations => [
      ...prevOrganizations,
      { ...initialOrganizationState }
    ]);
  };

  const removeOrganization = (index: number): void => {
    if (organizations.length > 1) {
      setOrganizations(prevOrganizations =>
        prevOrganizations.filter((_, i) => i !== index)
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
    if (initialData) return 'Update Organization';
    return organizations.length > 1
      ? `Create ${organizations.length} Organizations`
      : 'Create Organization';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {organizations.map((organization, index) => (
        <div
          key={index}
          className="relative p-3 border border-gray-200 rounded-lg space-y-3"
        >
          {!initialData && organizations.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => removeOrganization(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl transition-colors"
                aria-label={`Remove organization ${index + 1}`}
              >
                ×
              </button>

              <div className="text-sm font-medium text-gray-600">
                Organization {index + 1}
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Organization Name"
              id={`name-${index}`}
              value={organization.name}
              onChange={(e) => handleOrganizationChange(index, 'name', e.target.value)}
              error={errors[index]?.name}
              placeholder="Enter organization name"
              required
            />

            <Input
              label="Email"
              id={`email-${index}`}
              type="email"
              value={organization.email}
              onChange={(e) => handleOrganizationChange(index, 'email', e.target.value)}
              error={errors[index]?.email}
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Address"
              id={`address-${index}`}
              value={organization.address}
              onChange={(e) => handleOrganizationChange(index, 'address', e.target.value)}
              error={errors[index]?.address}
              placeholder="Enter address"
            />

            <Input
              label="Phone"
              id={`phone-${index}`}
              type="tel"
              value={organization.phone}
              onChange={(e) => handleOrganizationChange(index, 'phone', e.target.value)}
              error={errors[index]?.phone}
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`isActive-${index}`}
              checked={organization.isActive}
              onChange={(e) => handleOrganizationChange(index, 'isActive', e.target.checked)}
              className="h-4 w-4 text-accent border-default rounded focus:ring-2 focus:ring-accent"
            />
            <label htmlFor={`isActive-${index}`} className="text-foreground">
              Active Status
            </label>
          </div>
        </div>
      ))}

      {!initialData && (
        <Button
          type="button"
          variant="secondary"
          onClick={addOrganization}
          className="w-full"
        >
          + Add Another Organization
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
          disabled={isLoading}
          variant="primary"
        >
          {getSubmitButtonText()}
        </Button>
      </div>
    </form>
  );
}

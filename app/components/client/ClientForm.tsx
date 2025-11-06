'use client';

import { useState, useEffect } from 'react';
import { ClientFormProps, CreateClientData, createClient, updateClient } from '@/app/utils/api/client';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { useRouter } from 'next/navigation';

export default function ClientForm({
  initialData,
  departments,
  projectManagers,
  token,
  onSuccess,
  onCancel
}: ClientFormProps) {
  const [formData, setFormData] = useState<CreateClientData>(() => ({
    name: '',
    clientCode: '',
    startDate: '',
    coordinatorFirstName: '',
    coordinatorLastName: '',
    coordinatorEmail: '',
    departmentId: '',
    officeNo: '',
    mobileNo: '',
    streetAddress: '',
    treeAddress: '',
    city: '',
    state: '',
    zipcode: '',
    projectManagerIds: [],
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Effect to update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        clientCode: initialData.clientCode || '',
        startDate: initialData.startDate || '',
        coordinatorFirstName: initialData.coordinatorFirstName || '',
        coordinatorLastName: initialData.coordinatorLastName || '',
        coordinatorEmail: initialData.coordinatorEmail || '',
        departmentId: initialData.departmentId || '',
        officeNo: initialData.officeNo || '',
        mobileNo: initialData.mobileNo || '',
        streetAddress: initialData.streetAddress || '',
        treeAddress: initialData.treeAddress || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipcode: initialData.zipcode || '',
        projectManagerIds: initialData.projectManagers?.map(pm => pm.id) || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = initialData
        ? await updateClient(token, initialData.id, formData)
        : await createClient(token, formData);

      if (!result.ok) {
        throw new Error(result.data?.message || 'Failed to save client');
      }

      onSuccess();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Client Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Client Code"
          value={formData.clientCode}
          onChange={(e) => setFormData({ ...formData, clientCode: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
        <select
          className="form-select mt-1 block w-full"
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Coordinator First Name"
          value={formData.coordinatorFirstName}
          onChange={(e) => setFormData({ ...formData, coordinatorFirstName: e.target.value })}
        />
        <Input
          label="Coordinator Last Name"
          value={formData.coordinatorLastName}
          onChange={(e) => setFormData({ ...formData, coordinatorLastName: e.target.value })}
        />
        <Input
          label="Coordinator Email"
          type="email"
          value={formData.coordinatorEmail}
          onChange={(e) => setFormData({ ...formData, coordinatorEmail: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Office Number"
          value={formData.officeNo}
          onChange={(e) => setFormData({ ...formData, officeNo: e.target.value })}
        />
        <Input
          label="Mobile Number"
          value={formData.mobileNo}
          onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Street Address"
          value={formData.streetAddress}
          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
        />
        <Input
          label="Tree Address"
          value={formData.treeAddress}
          onChange={(e) => setFormData({ ...formData, treeAddress: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        <Input
          label="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
        <Input
          label="Zipcode"
          value={formData.zipcode}
          onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Project Managers</label>
        <select
          multiple
          className="mt-1 block w-full"
          value={formData.projectManagerIds}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, projectManagerIds: selectedOptions });
          }}
        >
          {projectManagers.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.firstName} {pm.lastName}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mt-4">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || !formData.name}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'} Client
        </Button>
      </div>
    </form>
  );
}
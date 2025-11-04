'use client';
import { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
import { DesignationFormProps } from '@/app/utils/api/designation';


export default function DesignationForm({ isOpen, onClose, onSubmit, initialData }: DesignationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Designation' : 'Add New Designation'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Designation Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

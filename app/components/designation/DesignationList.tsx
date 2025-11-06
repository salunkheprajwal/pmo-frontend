'use client';
import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import DataTable, { Column } from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import DesignationForm from './DesignationForm';
import { Designation } from '@/app/utils/api/designation';
import { useApi } from '@/app/context/ApiContext';
import { useToken } from '@/app/context/TokenContext';

export default function DesignationList() {
  const api = useApi();
  const { token } = useToken();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDesignations(token || '');
      if (response.ok && response.data.data) {
        setDesignations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleAdd = async (data: { name: string; description: string }) => {
    try {
      const response = await api.createDesignation(token || '', data);
      if (response.ok) {
        await fetchDesignations();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding designation:', error);
    }
  };

  const handleEdit = async (data: { name: string; description: string }) => {
    try {
      if (!selectedDesignation) return;
      const response = await api.updateDesignation(token || '', selectedDesignation.id, data);
      if (response.ok) {
        await fetchDesignations();
        setIsEditModalOpen(false);
        setSelectedDesignation(null);
      }
    } catch (error) {
      console.error('Error updating designation:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedDesignation) return;
      const response = await api.deleteDesignation(token || '', selectedDesignation.id);
      if (response.ok) {
        await fetchDesignations();
        setIsDeleteDialogOpen(false);
        setSelectedDesignation(null);
      }
    } catch (error) {
      console.error('Error deleting designation:', error);
    }
  };

  const columns: Column<Designation>[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          Add New Designation
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={designations}
        onEdit={(designation) => {
          setSelectedDesignation(designation);
          setIsEditModalOpen(true);
        }}
        onDelete={(designation) => {
          setSelectedDesignation(designation);
          setIsDeleteDialogOpen(true);
        }}
      />

      <DesignationForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedDesignation && (
        <DesignationForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDesignation(null);
          }}
          onSubmit={handleEdit}
          initialData={{
            name: selectedDesignation.name,
            description: selectedDesignation.description || ''
          }}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Designation"
        message={`Are you sure you want to delete the designation "${selectedDesignation?.name}"?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedDesignation(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

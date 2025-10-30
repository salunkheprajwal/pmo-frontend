'use client';

import { useState, useEffect } from 'react';
import OrganizationForm from '@/app/components/organization/OrganizationForm';
import OrganizationList from '@/app/components/organization/OrganizationList';
import ConfirmDialog from '@/app/components/shared/ConfirmDialog';
import Modal from '@/app/components/shared/Modal';
import Button from '@/app/components/Button';
import * as api from '@/app/utils/api';
import { Organization } from '@/app/utils/api';
import { Plus } from 'lucide-react';

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  const fetchOrganizations = async () => {
    setError(null);
    try {
      const { ok, data } = await api.getOrganizations(getToken());
      if (!ok) throw new Error(data.message || 'Failed to fetch organizations');
      setOrganizations(data.data);
    } catch (error) {
      console.error('Fetch failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch organizations');
    }
  };

  const handleCreateUpdate = async (formData: Partial<Organization>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (selectedOrg) {
        const { ok, data } = await api.updateOrganization(
          getToken(),
          selectedOrg.id,
          formData
        );
        
        if (!ok) throw new Error(data.message || 'Failed to update organization');
        
        setOrganizations(orgs => 
          orgs.map(org => org.id === selectedOrg.id ? data.data : org)
        );
      } else {
        const { ok, data } = await api.createOrganization(
          getToken(),
          formData as api.CreateOrganizationData
        );
        
        if (!ok) throw new Error(data.message || 'Failed to create organization');
        
        setOrganizations(orgs => [...orgs, data.data]);
      }
      
      setIsFormOpen(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Operation failed:', error);
      setError(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const { ok, data } = await api.deleteOrganization(getToken(), id);
      if (!ok) throw new Error(data.message || 'Failed to delete organization');
      
      setOrganizations(orgs => orgs.filter(org => org.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete organization');
    }
  };

  const handleEdit = (id: string) => {
    const org = organizations.find(o => o.id === id);
    if (org) {
      setSelectedOrg(org);
      setIsFormOpen(false);
      setTimeout(() => setIsFormOpen(true), 10);
    }
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setSelectedOrg(null);
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage your organizations</p>
        </div>
        <Button
          onClick={() => {
            setSelectedOrg(null);
            setIsFormOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={18} className="mr-2" />
          Add Organization
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <OrganizationList
        organizations={organizations}
        onEdit={handleEdit}
        onDelete={(id: string) => setDeleteId(id)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        title={selectedOrg ? 'Edit Organization' : 'Create Organization'}
      >
        <OrganizationForm
          initialData={selectedOrg || undefined}
          onSubmit={handleCreateUpdate}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

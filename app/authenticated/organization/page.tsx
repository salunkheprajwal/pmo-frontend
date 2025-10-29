'use client';

import { useState, useEffect } from 'react';
import OrganizationForm from '@/app/components/organization/OrganizationForm';
import OrganizationList from '@/app/components/organization/OrganizationList';
import OrganizationTable from '@/app/components/organization/OrganizationTable';
import ConfirmDialog from '@/app/components/shared/ConfirmDialog';
import Modal from '@/app/components/shared/Modal';
import Button from '@/app/components/Button';
import * as api from '@/app/utils/api';
import { Organization } from '@/app/utils/api';
import { LayoutGrid, Table2 } from 'lucide-react';

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'card' | 'table'>('card');

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
        <h1 className="text-2xl font-semibold text-gray-800">Organizations</h1>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md shadow-sm border border-gray-300 bg-surface">
            <button
              className={`px-4 py-2 rounded-l-md focus:outline-none transition-colors ${view === 'card' ? 'bg-accent-50 text-accent' : 'text-muted hover:bg-accent-50'}`}
              onClick={() => setView('card')}
              aria-pressed={view === 'card'}
              type="button"
              title="Card View"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              className={`px-4 py-2 rounded-r-md focus:outline-none transition-colors ${view === 'table' ? 'bg-accent-50 text-accent' : 'text-muted hover:bg-accent-50'}`}
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              type="button"
              title="Table View"
            >
              <Table2 size={20} />
            </button>
          </div>
          <Button
            onClick={() => {
              setSelectedOrg(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white hover:bg-blue-700 ml-2"
          >
            Add Organization
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {view === 'card' ? (
        <OrganizationList
          organizations={organizations}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      ) : (
        <OrganizationTable
          organizations={organizations}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

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

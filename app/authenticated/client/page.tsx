'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, getClients, deleteClient } from '@/app/utils/api/client';
import { Department, getDepartments } from '@/app/utils/api/department';
import { getAdminUsers } from '@/app/utils/api/adminUsers';
import { ProjectManager } from '@/app/utils/api/client';
import ClientList from '@/app/components/client/ClientList';
import ClientForm from '@/app/components/client/ClientForm';
import Modal from '@/app/components/shared/Modal';
import Button from '@/app/components/shared/Button';
import { useToken } from '@/app/context/TokenContext';

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [projectManagers, setProjectManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { token } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const loadAllData = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const [clientsResult, departmentsResult, managersResult] = await Promise.all([
        getClients(token),
        getDepartments(token),
        getAdminUsers(token)
      ]);

      if (clientsResult.ok) {
        const clientsData = Array.isArray(clientsResult.data) ? clientsResult.data 
                        : Array.isArray(clientsResult.data?.items) ? clientsResult.data.items
                        : Array.isArray(clientsResult.data?.data) ? clientsResult.data.data
                        : [];
        setClients(clientsData);
      }

      if (departmentsResult.ok) {
        const departmentsData: Department[] = Array.isArray(departmentsResult.data) ? departmentsResult.data
                            : Array.isArray(departmentsResult.data?.items) ? departmentsResult.data.items
                            : Array.isArray(departmentsResult.data?.data) ? departmentsResult.data.data
                            : [];
        setDepartments(departmentsData.map(d => ({ id: d.id, name: d.name })));
      }

      if (managersResult.ok) {
        const managersData: ProjectManager[] = Array.isArray(managersResult.data) ? managersResult.data
                         : Array.isArray(managersResult.data?.items) ? managersResult.data.items
                         : Array.isArray(managersResult.data?.data) ? managersResult.data.data
                         : [];
        setProjectManagers(managersData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (client: Client) => {
    if (!token) return;

    const result = await deleteClient(token, client.id);
    if (result.ok) {
      await loadAllData();
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    loadAllData();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={handleCreateClick}>
          Add New Client
        </Button>
      </div>

      <ClientList
        clients={clients}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClient ? 'Edit Client' : 'Create New Client'}
      >
        <ClientForm
          initialData={selectedClient || undefined}
          departments={departments}
          projectManagers={projectManagers}
          token={token || ''}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
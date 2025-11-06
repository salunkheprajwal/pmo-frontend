'use client';

import { Client, ClientListProps } from '@/app/utils/api/client';
import DataTable from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import { useState } from 'react';

export default function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const columns = [
    { key: 'clientCode', header: 'Client Code', render: (client: Client) => client.clientCode || '-' },
    { key: 'name', header: 'Name', render: (client: Client) => client.name || '-' },
    { 
      key: 'department',
      header: 'Department',
      render: (client: Client) => client.department?.name || '-'
    },
    { 
      key: 'coordinator',
      header: 'Coordinator',
      render: (client: Client) => 
        client.coordinatorFirstName && client.coordinatorLastName 
          ? `${client.coordinatorFirstName} ${client.coordinatorLastName}`
          : '-'
    },
    { 
      key: 'contact',
      header: 'Contact',
      render: (client: Client) => 
        client.mobileNo || client.officeNo || '-'
    },
  ];

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      onDelete(selectedClient);
      setDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };

  return (
    <>
      <DataTable
        data={clients}
        columns={columns}
        onEdit={onEdit}
        onDelete={handleDeleteClick}
        actions={true}
      />
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        message={`Are you sure you want to delete ${selectedClient?.name}?`}
        confirmLabel="Delete"
      />
    </>
  );
}
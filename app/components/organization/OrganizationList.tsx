'use client';

import { useState } from 'react';
import DataTable, { Column } from '../shared/DataTable';
import DataCard from '../shared/DataCard';
import { Grid, List } from 'lucide-react';
import { Organization } from '@/app/utils/api/organization';

interface OrganizationListProps {
  organizations: Organization[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OrganizationList({ organizations, onEdit, onDelete }: OrganizationListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const columns: Column<Organization>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'address', header: 'Address' },
    {
      key: 'status',
      header: 'Status',
      render: (org) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            org.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {org.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No organizations found</p>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-default p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {organizations.map((org) => (
            <DataCard
              key={org.id}
              item={org}
              title={(org) => org.name}
              subtitle={(org) => org.email}
              meta={(org) => (
                <div className="space-y-1">
                  {org.phone && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Phone: </span>
                      <span className="font-medium">{org.phone}</span>
                    </div>
                  )}
                  {org.address && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Address: </span>
                      <span className="font-medium">{org.address}</span>
                    </div>
                  )}
                </div>
              )}
              statusIndicator={(org) => ({
                color: org.isActive ? 'bg-green-500' : 'bg-red-500',
                label: org.isActive ? 'Active' : 'Inactive'
              })}
              footer={(org) => (
                <div className="text-xs text-muted-foreground">
                  {org.createdAt && (
                    `Created: ${new Date(org.createdAt).toLocaleDateString()}`
                  )}
                </div>
              )}
              onClick={() => onEdit(org.id)}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={organizations}
          columns={columns}
          onEdit={(org) => onEdit(org.id)}
          onDelete={(org) => onDelete(org.id)}
        />
      )}
    </div>
  );
}
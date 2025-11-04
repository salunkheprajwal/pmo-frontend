'use client';

import React, { useState } from 'react';
import { Organization, OrganizationListProps } from '@/app/utils/api/organization';
import DataTable, { Column } from '../shared/DataTable';
import DataCard from '../shared/DataCard';
import { Grid, List } from 'lucide-react';

export default function OrganizationList({
  organizations,
  onEdit,
  onDelete,
}: OrganizationListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const columns: Column<Organization>[] = [
    { key: 'name', header: 'Name' },
    { 
      key: 'address',
      header: 'Address',
      render: (org) => org.address || '-'
    },
    { 
      key: 'phone',
      header: 'Phone',
      render: (org) => org.phone || '-'
    },
    { 
      key: 'email',
      header: 'Email',
      render: (org) => org.email || '-'
    },
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

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {organizations.map((organization) => (
            <DataCard
              key={organization.id}
              item={organization}
              title={(org) => org.name}
              subtitle={(org) => org.address}
              meta={(org) => (
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="font-medium">{org.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-medium">{org.email || '-'}</span>
                  </div>
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
              onClick={() => onEdit(organization.id)}
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

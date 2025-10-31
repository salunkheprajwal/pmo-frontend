'use client';

import React, { useState } from 'react';
import { Department } from '@/app/utils/api';
import DataTable, { Column } from '../shared/DataTable';
import DataCard from '../shared/DataCard';
import { Grid, List } from 'lucide-react';

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export default function DepartmentList({
  departments,
  onEdit,
  onDelete,
}: DepartmentListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const columns: Column<Department>[] = [
    { key: 'name', header: 'Name' },
    { 
      key: 'organisation',
      header: 'Organization',
      render: (dept) => dept.organisation?.name || '-'
    },
    { 
      key: 'description',
      header: 'Description',
      render: (dept) => dept.description || '-'
    },
    {
      key: 'status',
      header: 'Status',
      render: (dept) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            dept.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {dept.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
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
          {departments.map((department) => (
            <DataCard
              key={department.id}
              item={department}
              title={(dept) => dept.name}
              subtitle={(dept) => dept.description}
              meta={(dept) => (
                <div className="text-sm">
                  <span className="text-muted-foreground">Organization: </span>
                  <span className="font-medium">{dept.organisation?.name || '-'}</span>
                </div>
              )}
              statusIndicator={(dept) => ({
                color: dept.isActive ? 'bg-green-500' : 'bg-red-500',
                label: dept.isActive ? 'Active' : 'Inactive'
              })}
              footer={(dept) => (
                <div className="text-xs text-muted-foreground">
                  {dept.createdAt && (
                    `Created: ${new Date(dept.createdAt).toLocaleDateString()}`
                  )}
                </div>
              )}
              onClick={() => onEdit(department)}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={departments}
          columns={columns}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
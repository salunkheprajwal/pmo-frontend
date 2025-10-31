'use client';

import React from 'react';
import DataTable from '../shared/DataTable';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  isVerified: boolean;
};

interface UserListProps {
  users: UserRow[];
  onEdit?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u: UserRow) => u.role || '-' },
    { key: 'isVerified', header: 'Verified', render: (u: UserRow) => (u.isVerified ? 'Yes' : 'No') },
  ];

  return (
    <DataTable data={users} columns={columns} onEdit={onEdit} onDelete={onDelete} />
  );
}



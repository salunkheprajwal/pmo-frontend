'use client';

import React from 'react';
import DataTable from '../shared/DataTable';

export type UserRow = {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  employeeId?: string | null;
  email: string;
  mobileNo?: string | null;
  role?: string | null;
  organisation?: { id: string; name: string } | null;
  department?: { id: string; name: string } | null;
  designation?: { id: string; name: string } | null;
  teamLeader?: { id: string; name: string; email: string } | null;
  teamManager?: { id: string; name: string; email: string } | null;
  isVerified: boolean;
};

interface UserListProps {
  users: UserRow[];
  onEdit?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (u: UserRow) => (
        <div>
          <div className="font-medium">{u.name}</div>
          {u.employeeId && (
            <div className="text-xs text-gray-500">ID: {u.employeeId}</div>
          )}
        </div>
      )
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (u: UserRow) => (
        <div>
          <div>{u.email}</div>
          {u.mobileNo && (
            <div className="text-xs text-gray-500">{u.mobileNo}</div>
          )}
        </div>
      )
    },
    { 
      key: 'role', 
      header: 'Role', 
      render: (u: UserRow) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
          {u.role || 'user'}
        </span>
      )
    },
    { 
      key: 'organisation', 
      header: 'Organization', 
      render: (u: UserRow) => u.organisation?.name || '-'
    },
    { 
      key: 'department', 
      header: 'Department', 
      render: (u: UserRow) => u.department?.name || '-'
    },
    { 
      key: 'designation', 
      header: 'Designation', 
      render: (u: UserRow) => u.designation?.name || '-'
    },
    { 
      key: 'teamLeader', 
      header: 'Team Leader', 
      render: (u: UserRow) => u.teamLeader ? (
        <div>
          <div className="font-medium text-sm">{u.teamLeader.name}</div>
          <div className="text-xs text-gray-500">{u.teamLeader.email}</div>
        </div>
      ) : '-'
    },
    { 
      key: 'teamManager', 
      header: 'Team Manager', 
      render: (u: UserRow) => u.teamManager ? (
        <div>
          <div className="font-medium text-sm">{u.teamManager.name}</div>
          <div className="text-xs text-gray-500">{u.teamManager.email}</div>
        </div>
      ) : '-'
    },
  ];

  return (
    <DataTable data={users} columns={columns} onEdit={onEdit} onDelete={onDelete} />
  );
}

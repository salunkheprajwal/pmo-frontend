'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OrganizationTable({ organizations, onEdit, onDelete }: OrganizationTableProps) {
  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No organizations found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{org.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{org.address || '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{org.phone || '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{org.email || '-'}</td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {org.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onEdit(org.id)}
                  className="inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full p-2 mr-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(org.id)}
                  className="inline-flex items-center justify-center text-red-600 hover:bg-red-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Button from '../Button';
import { Pencil, Trash2 } from 'lucide-react';

interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OrganizationCard({ organization, onEdit, onDelete }: OrganizationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      onDelete(organization.id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-300 hover:border-border-muted transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{organization.name}</h3>
          <div className="mt-2 space-y-1">
            {organization.address && (
              <p className="text-sm text-muted">
                {organization.address}
              </p>
            )}
            {organization.phone && (
              <p className="text-sm text-muted">
            {organization.phone}
              </p>
            )}
            {organization.email && (
              <p className="text-sm text-muted">
            {organization.email}
              </p>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          organization.isActive 
            ? 'bg-accent-50 text-accent' 
            : 'bg-danger/10 text-danger'
        }`}>
          {organization.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

    <div className="mt-4 flex justify-end space-x-2">
  <Button
    onClick={() => onEdit(organization.id)}
    className=" p-2"
    aria-label="Edit organization"
  >
    <Pencil className="w-4 h-4" />
  </Button>
  <Button
    onClick={handleDelete}
    disabled={isDeleting}
    className=" p-2 disabled:opacity-50"
    aria-label="Delete organization"
  >
    <Trash2 className="w-4 h-4" />
  </Button>
</div>
    </div>
  );
}
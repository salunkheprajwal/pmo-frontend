'use client';

import OrganizationCard from './OrganizationCard';

interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

interface OrganizationListProps {
  organizations: Organization[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OrganizationList({ organizations, onEdit, onDelete }: OrganizationListProps) {
  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No organizations found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {organizations.map((org) => (
        <OrganizationCard
          key={org.id}
          organization={org}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
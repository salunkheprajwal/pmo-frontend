'use client';
import RoleList from '@/app/components/role/RoleList';
export default function RolePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>
      <RoleList />
    </div>
  );
}
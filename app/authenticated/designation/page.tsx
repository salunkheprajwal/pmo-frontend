'use client';
import DesignationList from '@/app/components/designation/DesignationList';
export default function Designation() {
  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>
      <DesignationList />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Department } from '@/app/utils/api/department';
import { Organization } from '@/app/utils/api/organization';
import { useApi } from '@/app/context/ApiContext';
import { useToken } from '@/app/context/TokenContext';
import DepartmentList from '@/app/components/department/DepartmentList';
import DepartmentForm from '@/app/components/department/DepartmentForm';
import Modal from '@/app/components/shared/Modal';
import ConfirmDialog from '@/app/components/shared/ConfirmDialog';
import Button from '@/app/components/shared/Button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DepartmentPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const { token } = useToken();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchData(token);
  }, [token]);

  const fetchData = async (authToken: string | null) => {
    if (!authToken) return;
    
    try {
      const [deptsResponse, orgsResponse] = await Promise.all([
        api.getDepartments(authToken),
        api.getOrganizations(authToken),
      ]);

      if (deptsResponse.ok && deptsResponse.data.status) {
        setDepartments(deptsResponse.data.data || []);
      }

      if (orgsResponse.ok && orgsResponse.data.status) {
        setOrganizations(orgsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setDeleteTarget(department);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) return;

    try {
      const response = await api.deleteDepartment(token, deleteTarget.id);
      if (response.ok) {
        await fetchData(token);
      }
    } catch (error) {
      console.error('Failed to delete department:', error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
    if (token) {
      await fetchData(token);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="ai-spinner"></div>
      </div>
    );
  }

  return (
    <div className=" p-6 ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's departments</p>
        </div>
        <Button
          onClick={() => {
            setSelectedDepartment(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No departments found</div>
          <Button
            onClick={() => {
              setSelectedDepartment(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={18} className="mr-2" />
            Create your first department
          </Button>
        </div>
      ) : (
        <DepartmentList
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartment(null);
        }}
        title={selectedDepartment ? 'Edit Department' : 'New Department'}
      >
        <DepartmentForm
          initialData={selectedDepartment || undefined}
          organizations={organizations}
          token={token || ''}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedDepartment(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
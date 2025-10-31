'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { Department, Designation, Organization, Role, getDepartments } from '@/app/utils/api';

export type UserFormValues = {
  name?: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  email: string;
  mobileNo?: string;
  password?: string;
  role?: string;
  organisationId?: string | null;
  departmentId?: string | null;
  designationId?: string | null;
  reportingTeamLeaderId?: string | null;
  reportingTeamManagerId?: string | null;
};

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  mode?: 'create' | 'edit';
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  token: string;
  roles: Role[];
  organizations: Organization[];
  departments: Department[];
  designations: Designation[];
  teamMembers: { id: string; name: string; email: string }[];
}

export default function UserForm({ 
  initialValues, 
  mode = 'create', 
  onSubmit, 
  onCancel, 
  isSubmitting = false, 
  token, 
  roles, 
  organizations, 
  departments, 
  designations, 
  teamMembers 
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    mobileNo: '',
    password: '',
    role: 'user',
    organisationId: '',
    departmentId: '',
    designationId: '',
    reportingTeamLeaderId: '',
    reportingTeamManagerId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deptOptions, setDeptOptions] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        name: initialValues.name || '',
        firstName: initialValues.firstName || '',
        lastName: initialValues.lastName || '',
        employeeId: initialValues.employeeId || '',
        email: initialValues.email || '',
        mobileNo: initialValues.mobileNo || '',
        password: initialValues.password || '',
        role: initialValues.role || 'user',
        organisationId: initialValues.organisationId || '',
        departmentId: initialValues.departmentId || '',
        designationId: initialValues.designationId || '',
        reportingTeamLeaderId: initialValues.reportingTeamLeaderId || '',
        reportingTeamManagerId: initialValues.reportingTeamManagerId || '',
      }));
      
      if (initialValues.organisationId) {
        fetchDepartmentsByOrg(initialValues.organisationId);
      }
    }
  }, [initialValues]);

  useEffect(() => {
    if (!values.organisationId) {
      setDeptOptions(departments || []);
    }
  }, [departments, values.organisationId]);

  const isEdit = useMemo(() => mode === 'edit', [mode]);

  const fetchDepartmentsByOrg = async (orgId: string) => {
    setLoadingDepts(true);
    try {
      const { ok, data } = await getDepartments(token, orgId);
      
      if (ok && data?.status) {
        const depts = data.departments || data.data || [];
        setDeptOptions(depts);
      } else {
        setDeptOptions([]);
      }
    } catch (error) {
      setDeptOptions([]);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleChange = (key: keyof UserFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleOrganisationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrgId = e.target.value;
    setValues((prev) => ({ ...prev, organisationId: newOrgId, departmentId: '' }));
    
    if (newOrgId) {
      await fetchDepartmentsByOrg(newOrgId);
    } else {
      setDeptOptions(departments || []);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!values.email) newErrors.email = 'Email is required';
    if (mode === 'create' && !values.password) newErrors.password = 'Password is required';
    if (!values.name && !values.firstName && !values.lastName) {
      newErrors.name = 'Name or First/Last name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Convert empty strings to null for submission
    const submitData: UserFormValues = {
      ...values,
      organisationId: values.organisationId || null,
      departmentId: values.departmentId || null,
      designationId: values.designationId || null,
      reportingTeamLeaderId: values.reportingTeamLeaderId || null,
      reportingTeamManagerId: values.reportingTeamManagerId || null,
    };
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <Input 
          label="Name" 
          value={values.name || ''} 
          onChange={handleChange('name')} 
          error={errors.name} 
        /> */}
        <Input 
          label="First Name" 
          value={values.firstName || ''} 
          onChange={handleChange('firstName')} 
        />
        <Input 
          label="Last Name" 
          value={values.lastName || ''} 
          onChange={handleChange('lastName')} 
        />
        <Input 
          label="Employee ID" 
          value={values.employeeId || ''} 
          onChange={handleChange('employeeId')} 
        />
        <Input 
          label="Email" 
          value={values.email || ''} 
          onChange={handleChange('email')} 
          error={errors.email} 
          required 
        />
        <Input 
          label="Mobile No" 
          value={values.mobileNo || ''} 
          onChange={handleChange('mobileNo')} 
        />
        
        {!isEdit && (
          <Input 
            label="Password" 
            type="password" 
            value={values.password || ''} 
            onChange={handleChange('password')} 
            error={errors.password} 
            required 
          />
        )}
        {isEdit && (
          <Input 
            label="New Password (optional)" 
            type="password" 
            value={values.password || ''} 
            onChange={handleChange('password')} 
          />
        )}
        
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
          <select 
            className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-lg focus:ring-2 transition-all outline-none focus:ring-accent/20 focus:border-accent" 
            value={values.role || ''} 
            onChange={handleChange('role')}
          >
            <option value="">Select role</option>
            {roles.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Organization</label>
          <select 
            className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-lg focus:ring-2 transition-all outline-none focus:ring-accent/20 focus:border-accent" 
            value={values.organisationId || ''} 
            onChange={handleOrganisationChange}
          >
            <option value="">Select organization</option>
            {organizations.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Department {loadingDepts && <span className="text-xs text-gray-500">(Loading...)</span>}
          </label>
          <select 
            className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-lg focus:ring-2 transition-all outline-none focus:ring-accent/20 focus:border-accent" 
            value={values.departmentId || ''} 
            onChange={handleChange('departmentId')}
            disabled={loadingDepts}
          >
            <option value="">Select department</option>
            {deptOptions.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {!loadingDepts && deptOptions.length === 0 && values.organisationId && (
            <p className="text-xs text-gray-500 mt-1">No departments available for this organization</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Designation</label>
          <select 
            className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-lg focus:ring-2 transition-all outline-none focus:ring-accent/20 focus:border-accent" 
            value={values.designationId || ''} 
            onChange={handleChange('designationId')}
          >
            <option value="">Select designation</option>
            {designations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Team Leader</label>
          <select 
            className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-lg focus:ring-2 transition-all outline-none focus:ring-accent/20 focus:border-accent" 
            value={values.reportingTeamLeaderId || ''} 
            onChange={handleChange('reportingTeamLeaderId')}
          >
            <option value="">Select team leader</option>
            {teamMembers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Team Manager</label>
          <select 
            className="w-full px-3 py-2 text-sm bg-surface text-foreground border border-default rounded-lg focus:ring-2 transition-all outline-none focus:ring-accent/20 focus:border-accent" 
            value={values.reportingTeamManagerId || ''} 
            onChange={handleChange('reportingTeamManagerId')}
          >
            <option value="">Select team manager</option>
            {teamMembers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>{isEdit ? 'Update User' : 'Create User'}</Button>
      </div>
    </form>
  );
}

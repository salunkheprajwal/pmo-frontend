'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/app/components/shared/Button'
import Modal from '@/app/components/shared/Modal'
import ConfirmDialog from '@/app/components/shared/ConfirmDialog'
import UserForm, { UserFormValues } from '@/app/components/user/UserForm'
import UserList, { UserRow } from '@/app/components/user/UserList'
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser, AdminUserSummary, getAdminUser } from '@/app/utils/api/adminUsers'
import { getRoles, Role } from '@/app/utils/api/role'
import { getOrganizations, Organization } from '@/app/utils/api/organization'
import { getDepartments, Department } from '@/app/utils/api/department'
import { getDesignations, Designation } from '@/app/utils/api/designation'

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [editInitial, setEditInitial] = useState<Partial<UserFormValues> | undefined>(undefined)
  const [editLoading, setEditLoading] = useState<boolean>(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; email: string }[]>([])
  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''), [])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { ok, data } = await getAdminUsers(token)
      if (ok && data?.status) {
        const list: AdminUserSummary[] = data.users || []
        const mapped: UserRow[] = list.map(u => ({
          id: String(u.id),
          name: u.name,
          firstName: u.firstName,
          lastName: u.lastName,
          employeeId: u.employeeId,
          email: u.email,
          mobileNo: u.mobileNo,
          role: u.role || null,
          organisation: u.organisation || null,
          department: u.department || null,
          designation: u.designation || null,
          teamLeader: u.teamLeader || null,
          teamManager: u.teamManager || null,
          isVerified: !!u.isVerified,
        }))
        setUsers(mapped)
      } else {
        setUsers([])
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    const loadDropdowns = async () => {
      if (!token) return
      const [rolesRes, orgRes, deptRes, desigRes, usersRes] = await Promise.all([
        getRoles(token),
        getOrganizations(token),
        getDepartments(token),
        getDesignations(token),
        getAdminUsers(token),
      ])

      if (rolesRes.ok && rolesRes.data?.status) setRoles(rolesRes.data.roles || rolesRes.data.data || [])
      if (orgRes.ok && orgRes.data?.status) setOrganizations(orgRes.data.organisations || orgRes.data.organizations || orgRes.data.data || [])
      if (deptRes.ok && deptRes.data?.status) setDepartments(deptRes.data.departments || deptRes.data.data || [])
      if (desigRes.ok && desigRes.data?.status) setDesignations(desigRes.data.designations || desigRes.data.data || [])
      if (usersRes.ok && usersRes.data?.status) {
        const tm = (usersRes.data.users || []).map((u: AdminUserSummary) => ({ id: String(u.id), name: u.name, email: u.email }))
        setTeamMembers(tm)
      }
    }
    loadDropdowns()
  }, [token])

  const openCreate = () => {
    setFormMode('create')
    setSelectedUser(null)
    setEditInitial(undefined)
    setIsFormOpen(true)
  }

  const openEdit = (user: UserRow) => {
    setFormMode('edit')
    setSelectedUser(user)
    setIsFormOpen(true)
    setEditLoading(true)
    ;(async () => {
      const { ok, data } = await getAdminUser(token, user.id)
      if (ok && data?.status && data.data) {
        const d = data.data
        setEditInitial({
          name: d.name || '',
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          employeeId: d.employeeId || '',
          email: d.email || '',
          mobileNo: d.mobileNo || '',
          role: d.role || '',
          organisationId: d.organisation?.id || '',
          departmentId: d.department?.id || '',
          designationId: d.designation?.id || '',
          reportingTeamLeaderId: d.teamLeader?.id || '',
          reportingTeamManagerId: d.teamManager?.id || '',
        })
      } else {
        setEditInitial({ name: user.name, email: user.email, role: user.role || '' })
      }
      setEditLoading(false)
    })()
  }

  const confirmDelete = (user: UserRow) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    try {
      if (formMode === 'create') {
        const { ok, data } = await createAdminUser(token, {
          ...values,
          password: values.password || '',
        })
        if (ok && data?.status) {
          setIsFormOpen(false)
          await loadUsers()
        } else {
          alert(data?.message || 'Failed to create user')
        }
      } else if (selectedUser) {
        const { ok, data } = await updateAdminUser(token, selectedUser.id, {
          ...values,
        })
        if (ok && data?.status) {
          setIsFormOpen(false)
          await loadUsers()
        } else {
          alert(data?.message || 'Failed to update user')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    try {
      const { ok, data } = await deleteAdminUser(token, selectedUser.id)
      if (ok && data?.status) {
        setIsDeleteOpen(false)
        await loadUsers()
      } else {
        alert(data?.message || 'Failed to delete user')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const initialFormValues: Partial<UserFormValues> | undefined = useMemo(() => {
    return formMode === 'edit' ? editInitial : undefined
  }, [formMode, editInitial])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button onClick={openCreate}>Add User</Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-2">Loading users...</div>
      ) : (
        <UserList users={users} onEdit={openEdit} onDelete={confirmDelete} />
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={formMode === 'create' ? 'Create User' : 'Edit User'}>
        {formMode === 'edit' && editLoading ? (
          <div className="text-sm text-muted-2">Loading user...</div>
        ) : (
          <UserForm
            mode={formMode}
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={submitting}
            token={token}
            roles={roles}
            organizations={organizations}
            departments={departments}
            designations={designations}
            teamMembers={teamMembers}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete user?"
        message={`Are you sure you want to delete ${selectedUser?.name || 'this user'}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={submitting}
      />
    </div>
  )
}

export default UserManagementPage

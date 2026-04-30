import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllUsers, updateUserRole, activateUser, suspendUser } from '../../services/userService';
import { getApplicationsByStatus, updateApplication, APPLICATION_STATUS } from '../../services/applicationService';
import { createStaffAccount, resetPassword } from '../../services/authService';
import { ROLES } from '../../utils/constants';
import { Users, Shield, Plus, CheckCircle, FileText } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  // New staff form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.VET
  });

  const loadData = async () => {
    try {
      const [usersData, appsData] = await Promise.all([
        getAllUsers(),
        getApplicationsByStatus(APPLICATION_STATUS.SURVEYED) // Only show surveyed apps ready for approval
      ]);
      if (usersData) setUsers(usersData);
      if (appsData) setApplications(appsData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openEdit = (user) => { setEditingUser(user); setEditRole(user.role); };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await updateUserRole(editingUser.id, editRole);
      setUsers((u) => u.map((x) => x.id === editingUser.id ? { ...x, role: editRole } : x));
      addToast({ message: 'User role updated', type: 'success' });
    } catch (error) {
      addToast({ message: error.message || 'Failed to update role', type: 'error' });
    } finally {
      setSaving(false);
      setEditingUser(null);
    }
  };

  const toggleActive = async (user) => {
    const fn = user.isActive ? suspendUser : activateUser;
    try {
      await fn(user.id);
      setUsers((u) => u.map((x) => x.id === user.id ? { ...x, isActive: !x.isActive } : x));
      addToast({ message: `User ${user.isActive ? 'suspended' : 'activated'}`, type: 'success' });
    } catch (e) {
      addToast({ message: 'Failed to change status', type: 'error' });
    }
  };

  const handleCreateStaff = async () => {
    const { name, email, password, role } = newStaff;
    if (!name.trim() || !email.trim() || !password) {
      addToast({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      await createStaffAccount(email.trim(), password, name.trim(), role);
      addToast({ message: `${role} account created successfully!`, type: 'success' });
      setIsCreateModalOpen(false);
      setNewStaff({ name: '', email: '', password: '', role: ROLES.VET });
      loadData();
    } catch (error) {
      addToast({ message: error.message || 'Failed to create account', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleApproveFarmer = async (app) => {
    if (!window.confirm(`Approve ${app.name} as a Farmer? This will create an account for them.`)) return;
    
    setSaving(true);
    try {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      // Use email if provided in app, otherwise generate a placeholder (ideally form requires email)
      const farmerEmail = app.email || `farmer${Date.now()}@iharvest.local`;
      
      // Create auth account
      await createStaffAccount(farmerEmail, tempPassword, app.name, ROLES.FARMER, { 
        phone: app.phone,
        location: app.location 
      });
      
      // Update app status
      await updateApplication(app.id, { status: APPLICATION_STATUS.APPROVED });
      
      addToast({ message: `Farmer Approved! Temp password: ${tempPassword}`, type: 'success' });
      loadData();
    } catch (error) {
      addToast({ message: error.message || 'Failed to approve farmer', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role', render: (v) => <StatusBadge status={v} /> },
    { header: 'Status', accessor: 'isActive', render: (v) => <StatusBadge status={v ? 'active' : 'suspended'} /> },
    {
      header: 'Actions', accessor: 'id',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
          <Button size="sm" variant={row.isActive ? 'danger' : 'primary'} onClick={() => toggleActive(row)}>
            {row.isActive ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  const appColumns = [
    { header: 'Applicant', accessor: 'name' },
    { header: 'Location', accessor: 'location' },
    { header: 'Farm Size', accessor: 'farmSize' },
    { header: 'Surveyed By', accessor: 'fsoId' },
    {
      header: 'Actions', accessor: 'id',
      render: (_, row) => (
        <Button size="sm" variant="primary" icon={CheckCircle} onClick={() => handleApproveFarmer(row)} disabled={saving}>
          Approve & Create Account
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage internal staff, approve farmers, and manage roles.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Staff Account
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Total Users" value={String(users.length)} icon={Users} />
        <Card variant="stat" title="Active Users" value={String(users.filter(u => u.isActive).length)} icon={Shield} trend={{ value: 0, isPositive: true }} />
        <Card variant="stat" title="Pending Approvals" value={String(applications.length)} icon={FileText} trend={{ value: applications.length, isPositive: true }} />
      </div>

      {applications.length > 0 && (
        <Card title="Surveyed Farmer Applications (Pending Admin Approval)" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <Table columns={appColumns} data={applications} searchable pageSize={5} />
        </Card>
      )}

      <Card title="All System Users">
        <Table columns={columns} data={users} searchable pageSize={10} />
      </Card>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Edit User — ${editingUser?.name}`}
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Role
            </label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            >
              {Object.values(ROLES).map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Create Staff Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Internal Staff Account"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateStaff} disabled={saving}>
              {saving ? 'Creating…' : 'Create Account'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            disabled={saving}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="staff@iharvest.com"
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            disabled={saving}
          />
          <Input
            label="Initial Password"
            type="text"
            placeholder="Temporary Password"
            value={newStaff.password}
            onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
            disabled={saving}
          />
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Staff Role
            </label>
            <select
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            >
              {[ROLES.ADMIN, ROLES.FSO, ROLES.VET, ROLES.CLUSTER_MANAGER].map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;

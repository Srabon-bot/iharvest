import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllUsers, updateUserRole, activateUser, suspendUser } from '../../services/userService';
import { ROLES } from '../../utils/constants';
import { Users, Shield } from 'lucide-react';

const SEED_USERS = [
    { id: '1', name: 'Alice Ahmed', email: 'alice@iharvest.com', role: 'investor', isActive: true },
    { id: '2', name: 'Ben Farmer', email: 'ben@iharvest.com', role: 'farmer', isActive: true },
    { id: '3', name: 'Dr. Clara Vet', email: 'clara@iharvest.com', role: 'vet', isActive: true },
    { id: '4', name: 'David FSO', email: 'david@iharvest.com', role: 'fso', isActive: false },
    { id: '5', name: 'Eva Manager', email: 'eva@iharvest.com', role: 'cluster_manager', isActive: true },
    { id: '6', name: 'Frank Fund', email: 'frank@iharvest.com', role: 'fund_manager', isActive: true },
    { id: '7', name: 'Grace Admin', email: 'grace@iharvest.com', role: 'admin', isActive: true },
];

const UsersPage = () => {
    const [users, setUsers] = useState(SEED_USERS);
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            const data = await getAllUsers();
            if (data && data.length) setUsers(data);
        } catch { /* keep seed */ }
    };

    useEffect(() => { load(); }, []);

    const openEdit = (user) => { setEditingUser(user); setEditRole(user.role); };

    const handleSave = async () => {
        if (!editingUser) return;
        setSaving(true);
        try {
            await updateUserRole(editingUser.id, editRole);
            setUsers((u) => u.map((x) => x.id === editingUser.id ? { ...x, role: editRole } : x));
        } catch {
            // Optimistic local update on mock
            setUsers((u) => u.map((x) => x.id === editingUser.id ? { ...x, role: editRole } : x));
        } finally {
            setSaving(false);
            setEditingUser(null);
        }
    };

    const toggleActive = async (user) => {
        const fn = user.isActive ? suspendUser : activateUser;
        try { await fn(user.id); } catch { /* mock */ }
        setUsers((u) => u.map((x) => x.id === user.id ? { ...x, isActive: !x.isActive } : x));
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

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                    User Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>View, edit roles, and manage all platform users.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Users" value={String(users.length)} icon={Users} />
                <Card variant="stat" title="Active" value={String(users.filter(u => u.isActive).length)} icon={Shield} trend={{ value: 0, isPositive: true }} />
            </div>

            <Card title="All Users">
                <Table columns={columns} data={users} searchable pageSize={8} />
            </Card>

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
        </DashboardLayout>
    );
};

export default UsersPage;

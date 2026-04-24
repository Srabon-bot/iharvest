import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getUsersByRole } from '../../services/userService';
import { ROLES } from '../../utils/constants';
import { Users } from 'lucide-react';

const SEED_FARMERS = [
    { id: 'f1', name: 'Ali Khan', email: 'ali@iharvest.com', isActive: true, assignedClusterId: 'CLS-NORTH' },
    { id: 'f2', name: 'Sarah Connor', email: 'sarah@iharvest.com', isActive: true, assignedClusterId: 'CLS-EAST' },
    { id: 'f3', name: 'Tom Brown', email: 'tom@iharvest.com', isActive: false, assignedClusterId: 'CLS-NORTH' },
    { id: 'f4', name: 'Maria Silva', email: 'maria@iharvest.com', isActive: true, assignedClusterId: 'CLS-SOUTH' },
];

const FarmersPage = () => {
    const [farmers, setFarmers] = useState(SEED_FARMERS);

    useEffect(() => {
        (async () => {
            try {
                const data = await getUsersByRole(ROLES.FARMER);
                if (data && data.length) setFarmers(data);
            } catch { /* keep seed */ }
        })();
    }, []);

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Status', accessor: 'isActive', render: (v) => <StatusBadge status={v ? 'active' : 'suspended'} /> },
        { header: 'Cluster', accessor: 'assignedClusterId', render: (v) => v || '—' },
    ];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Assigned Farmers</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View farmers under your supervision and their cluster assignments.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Farmers" value={String(farmers.length)} icon={Users} />
                <Card variant="stat" title="Active" value={String(farmers.filter(f => f.isActive).length)} icon={Users} trend={{ value: 0, isPositive: true }} />
            </div>
            <Card title="Farmer Directory">
                <Table columns={columns} data={farmers} searchable pageSize={10} />
            </Card>
        </DashboardLayout>
    );
};

export default FarmersPage;

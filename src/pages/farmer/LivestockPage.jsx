import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getLivestockByFarmer } from '../../services/livestockService';
import { useAuth } from '../../hooks/useAuth';
import { Bird, Activity, AlertTriangle } from 'lucide-react';

const SEED = [
    { id: 'BCH-101', type: 'Broiler Chicken', quantity: 500, status: 'active', fsoId: 'FSO-01', clusterId: 'CLS-N' },
    { id: 'BCH-102', type: 'Broiler Chicken', quantity: 480, status: 'healthy', fsoId: 'FSO-01', clusterId: 'CLS-N' },
    { id: 'BCH-103', type: 'Layer Hen', quantity: 200, status: 'sick', fsoId: 'FSO-02', clusterId: 'CLS-E' },
];

const LivestockPage = () => {
    const { user } = useAuth();
    const [livestock, setLivestock] = useState(SEED);

    useEffect(() => {
        (async () => {
            try {
                const data = await getLivestockByFarmer(user?.uid || 'demo');
                if (data && data.length) setLivestock(data);
            } catch { /* keep seed */ }
        })();
    }, [user]);

    const columns = [
        { header: 'Batch ID', accessor: 'id' },
        { header: 'Type', accessor: 'type' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'FSO', accessor: 'fsoId' },
        { header: 'Cluster', accessor: 'clusterId' },
    ];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>My Livestock</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View your assigned animal batches and their current status.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Batches" value={String(livestock.length)} icon={Bird} />
                <Card variant="stat" title="Healthy" value={String(livestock.filter(l => l.status === 'active' || l.status === 'healthy').length)} icon={Activity} trend={{ value: 0, isPositive: true }} />
                <Card variant="stat" title="Need Attention" value={String(livestock.filter(l => l.status === 'sick' || l.status === 'critical').length)} icon={AlertTriangle} />
            </div>
            <Card title="Assigned Batches">
                <Table columns={columns} data={livestock} searchable pageSize={10} />
            </Card>
        </DashboardLayout>
    );
};

export default LivestockPage;

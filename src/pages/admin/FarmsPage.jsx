import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllLivestock } from '../../services/livestockService';
import { Bird, Activity, AlertTriangle } from 'lucide-react';

const FarmsPage = () => {
    const [livestock, setLivestock] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllLivestock();
                if (data && data.length) setLivestock(data);
            } catch { /* keep seed */ }
        })();
    }, []);

    const columns = [
        { header: 'Livestock ID', accessor: 'id' },
        { header: 'Type', accessor: 'type' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'Farmer ID', accessor: 'farmerId' },
        { header: 'FSO ID', accessor: 'fsoId' },
        { header: 'Cluster', accessor: 'clusterId' },
    ];

    const active = livestock.filter(l => l.status === 'active');
    const alerts = livestock.filter(l => l.status === 'dead' || l.status === 'sick');

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Farms & Livestock</h1>
                <p style={{ color: 'var(--text-secondary)' }}>System-wide livestock overview across all clusters and farmers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Batches" value={String(livestock.length)} icon={Bird} />
                <Card variant="stat" title="Active Batches" value={String(active.length)} icon={Activity} trend={{ value: 0, isPositive: true }} />
                <Card variant="stat" title="Alerts" value={String(alerts.length)} icon={AlertTriangle} trend={{ value: alerts.length, isPositive: false }} />
            </div>

            <Card title="All Livestock Records">
                <Table columns={columns} data={livestock} searchable pageSize={10} />
            </Card>
        </DashboardLayout>
    );
};

export default FarmsPage;

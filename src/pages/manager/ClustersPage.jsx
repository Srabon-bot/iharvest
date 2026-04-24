import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { MapPin, Activity, Users, Layers } from 'lucide-react';

const CLUSTERS = [
    { id: 'CLS-NORTH', name: 'North Valley Cluster', capacity: '10,000', activeFarms: 12, fsoCount: 3, status: 'optimal' },
    { id: 'CLS-EAST', name: 'East Ridge Cluster', capacity: '15,000', activeFarms: 18, fsoCount: 4, status: 'near capacity' },
    { id: 'CLS-SOUTH', name: 'South Plains Cluster', capacity: '8,000', activeFarms: 9, fsoCount: 2, status: 'optimal' },
    { id: 'CLS-WEST', name: 'West Hills Cluster', capacity: '12,000', activeFarms: 7, fsoCount: 2, status: 'active' },
];

const columns = [
    { header: 'Cluster ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Capacity (birds)', accessor: 'capacity' },
    { header: 'Active Farms', accessor: 'activeFarms' },
    { header: 'FSO Count', accessor: 'fsoCount' },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
];

const ClustersPage = () => (
    <DashboardLayout>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Cluster Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Overview of all regional clusters and their operational status.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
            <Card variant="stat" title="Total Clusters" value={String(CLUSTERS.length)} icon={MapPin} />
            <Card variant="stat" title="Total Farms" value={String(CLUSTERS.reduce((s, c) => s + c.activeFarms, 0))} icon={Layers} trend={{ value: 5, isPositive: true }} />
            <Card variant="stat" title="Total FSOs" value={String(CLUSTERS.reduce((s, c) => s + c.fsoCount, 0))} icon={Users} />
            <Card variant="stat" title="Optimal Clusters" value={String(CLUSTERS.filter(c => c.status === 'optimal').length)} icon={Activity} />
        </div>
        <Card title="All Clusters">
            <Table columns={columns} data={CLUSTERS} searchable />
        </Card>
    </DashboardLayout>
);

export default ClustersPage;

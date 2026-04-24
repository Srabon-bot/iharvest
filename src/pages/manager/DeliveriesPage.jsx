import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { Truck, Clock, CheckSquare } from 'lucide-react';

const DELIVERIES = [
    { id: 'DLV-001', cluster: 'CLS-NORTH', items: 'Feed — 5,000 kg', driver: 'Ahmed Hossain', status: 'completed', date: '2026-04-24' },
    { id: 'DLV-002', cluster: 'CLS-EAST', items: 'Vaccines — Batch X7', driver: 'Rahim Uddin', status: 'pending', date: '2026-04-25' },
    { id: 'DLV-003', cluster: 'CLS-SOUTH', items: 'Feed — 3,000 kg', driver: 'Karim Miah', status: 'in_progress', date: '2026-04-24' },
    { id: 'DLV-004', cluster: 'CLS-WEST', items: 'Equipment — Feeders x20', driver: 'Noor Islam', status: 'pending', date: '2026-04-26' },
    { id: 'DLV-005', cluster: 'CLS-NORTH', items: 'Feed — 4,500 kg', driver: 'Ahmed Hossain', status: 'completed', date: '2026-04-22' },
];

const columns = [
    { header: 'Delivery ID', accessor: 'id' },
    { header: 'Cluster', accessor: 'cluster' },
    { header: 'Items', accessor: 'items' },
    { header: 'Driver', accessor: 'driver' },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'Date', accessor: 'date' },
];

const DeliveriesPage = () => {
    const pending = DELIVERIES.filter(d => d.status === 'pending').length;
    const completed = DELIVERIES.filter(d => d.status === 'completed').length;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Delivery Tracking</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Monitor feed, vaccine, and equipment deliveries across all clusters.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Deliveries" value={String(DELIVERIES.length)} icon={Truck} />
                <Card variant="stat" title="Pending" value={String(pending)} icon={Clock} trend={{ value: pending, isPositive: false }} />
                <Card variant="stat" title="Completed" value={String(completed)} icon={CheckSquare} trend={{ value: completed, isPositive: true }} />
            </div>
            <Card title="All Deliveries">
                <Table columns={columns} data={DELIVERIES} searchable pageSize={10} />
            </Card>
        </DashboardLayout>
    );
};

export default DeliveriesPage;

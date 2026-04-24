import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { CheckCircle, TrendingUp } from 'lucide-react';

const RESOLVED = [
    { id: 'REQ-A1', farmerId: 'f1', livestock: 'BCH-101', issue: 'Respiratory infection', prescription: 'Amoxicillin 250mg x 5 days', resolvedDate: '2026-04-20' },
    { id: 'REQ-A2', farmerId: 'f2', livestock: 'COW-03', issue: 'Hoof rot', prescription: 'Topical iodine, bandaging', resolvedDate: '2026-04-18' },
    { id: 'REQ-A3', farmerId: 'f3', livestock: 'BCH-098', issue: 'Vitamin deficiency', prescription: 'Multi-vitamin supplement 14 days', resolvedDate: '2026-04-15' },
    { id: 'REQ-A4', farmerId: 'f1', livestock: 'BCH-101', issue: 'Feed refusal', prescription: 'Changed feed batch, added probiotic', resolvedDate: '2026-04-10' },
];

const columns = [
    { header: 'Case ID', accessor: 'id' },
    { header: 'Farmer', accessor: 'farmerId' },
    { header: 'Livestock', accessor: 'livestock' },
    { header: 'Issue', accessor: 'issue' },
    { header: 'Prescription', accessor: 'prescription' },
    { header: 'Status', accessor: 'id', render: () => <StatusBadge status="completed" /> },
    { header: 'Resolved', accessor: 'resolvedDate' },
];

const ReportsPage = () => (
    <DashboardLayout>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Vet Reports</h1>
            <p style={{ color: 'var(--text-secondary)' }}>History of all resolved veterinary cases and prescriptions.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
            <Card variant="stat" title="Cases Resolved" value={String(RESOLVED.length)} icon={CheckCircle} trend={{ value: RESOLVED.length, isPositive: true }} />
            <Card variant="stat" title="Resolution Rate" value="97.4%" icon={TrendingUp} trend={{ value: 2, isPositive: true }} />
        </div>
        <Card title="Resolved Cases">
            <Table columns={columns} data={RESOLVED} searchable pageSize={10} />
        </Card>
    </DashboardLayout>
);

export default ReportsPage;

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { Bird, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

const FarmerDashboard = () => {
  const activeBatches = [
    { id: 'BCH-101', type: 'Broiler Chicken', count: 500, day: 22, status: 'Healthy' },
    { id: 'BCH-102', type: 'Broiler Chicken', count: 500, day: 14, status: 'Attention Needed' },
  ];

  const columns = [
    { header: 'Batch ID', accessor: 'id' },
    { header: 'Type', accessor: 'type' },
    { header: 'Count', accessor: 'count' },
    { header: 'Day', accessor: 'day' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Farmer Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your active batches and upcoming tasks.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Active Livestock" value="1,000" icon={Bird} trend={{ value: 0 }} />
        <Card variant="stat" title="Pending Tasks" value="3" icon={Calendar} trend={{ value: -2, isPositive: true }} />
        <Card variant="stat" title="Completed Cycles" value="12" icon={CheckCircle} trend={{ value: 1, isPositive: true }} />
        <Card variant="stat" title="Alerts" value="1" icon={AlertTriangle} trend={{ value: 1, isPositive: false }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Active Batches" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={activeBatches} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;

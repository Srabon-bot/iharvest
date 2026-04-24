import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getLivestockByFarmer } from '../../services/livestockService';
import { useAuth } from '../../hooks/useAuth';
import { Bird, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

const SEED = [
  { id: 'BCH-101', type: 'Broiler Chicken', quantity: 500, status: 'active', fsoId: 'FSO-01' },
  { id: 'BCH-102', type: 'Broiler Chicken', quantity: 480, status: 'healthy', fsoId: 'FSO-01' },
];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [livestock, setLivestock] = useState(SEED);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLivestockByFarmer(user?.uid || 'demo');
        if (data.length) setLivestock(data);
      } catch { /* use seed */ }
    })();
  }, [user]);

  const columns = [
    { header: 'Batch ID', accessor: 'id' },
    { header: 'Type', accessor: 'type' },
    { header: 'Count', accessor: 'quantity' },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'FSO', accessor: 'fsoId' },
  ];

  const alerts = livestock.filter(l => l.status === 'sick' || l.status === 'critical').length;

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Farmer Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your active batches and upcoming tasks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Active Livestock" value={livestock.reduce((s, l) => s + Number(l.quantity || 0), 0).toLocaleString()} icon={Bird} />
        <Card variant="stat" title="Total Batches" value={String(livestock.length)} icon={Calendar} />
        <Card variant="stat" title="Completed Cycles" value="12" icon={CheckCircle} trend={{ value: 1, isPositive: true }} />
        <Card variant="stat" title="Alerts" value={String(alerts)} icon={AlertTriangle} trend={{ value: alerts, isPositive: false }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Active Batches">
          <Table columns={columns} data={livestock} searchable pageSize={8} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;

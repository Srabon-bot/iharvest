import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllUsers } from '../../services/userService';
import { getAllLivestock } from '../../services/livestockService';
import { getAllInvestments } from '../../services/investmentService';
import { formatBDT } from '../../utils/formatters';
import { Users, DollarSign, Activity, Tractor } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, livestock: 0, investments: 0 });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [users, livestock, investments] = await Promise.all([
          getAllUsers(), getAllLivestock(), getAllInvestments()
        ]);
        setStats({
          users: users?.length || 0,
          livestock: livestock?.length || 0,
          investments: (investments || []).reduce((s, i) => s + (Number(i.amount) || 0), 0),
        });
        setRecentUsers((users || []).slice(0, 5));
      } catch { /* use seed */ }
    })();
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role', render: (v) => <StatusBadge status={v} /> },
    { header: 'Status', accessor: 'isActive', render: (v) => <StatusBadge status={v ? 'active' : 'suspended'} /> },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Admin Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>System status and metrics at a glance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Total Users" value={stats.users.toLocaleString()} icon={Users} trend={{ value: 12, isPositive: true }} />
        <Card variant="stat" title="Active Livestock Batches" value={stats.livestock.toLocaleString()} icon={Tractor} trend={{ value: 5, isPositive: true }} />
        <Card variant="stat" title="Total Investments" value={formatBDT(stats.investments)} icon={DollarSign} trend={{ value: 18, isPositive: true }} />
        <Card variant="stat" title="System Health" value="99.9%" icon={Activity} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Recent Signups">
          <Table columns={columns} data={recentUsers} searchable pageSize={5} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

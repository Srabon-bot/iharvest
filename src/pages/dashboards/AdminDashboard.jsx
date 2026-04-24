import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { Users, DollarSign, Activity, Tractor } from 'lucide-react';

const AdminDashboard = () => {
  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'investor', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'farmer', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'vet', status: 'active' },
  ];

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Admin Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>System status and metrics at a glance.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Total Users" value="1,245" icon={Users} trend={{ value: 12, isPositive: true }} />
        <Card variant="stat" title="Active Farms" value="84" icon={Tractor} trend={{ value: 5, isPositive: true }} />
        <Card variant="stat" title="Total Investments" value="$2.4M" icon={DollarSign} trend={{ value: 18, isPositive: true }} />
        <Card variant="stat" title="System Health" value="99.9%" icon={Activity} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Recent Signups" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={recentUsers} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

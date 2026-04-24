import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { Layers, MapPin, Truck, CheckSquare } from 'lucide-react';

const ManagerDashboard = () => {
  const clusters = [
    { id: 'CLS-NORTH', name: 'North Valley Cluster', capacity: '10,000 birds', activeFarms: 12, status: 'Optimal' },
    { id: 'CLS-EAST', name: 'East Ridge Cluster', capacity: '15,000 birds', activeFarms: 18, status: 'Near Capacity' },
  ];

  const columns = [
    { header: 'Cluster ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Active Farms', accessor: 'activeFarms' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Cluster Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Oversee regional clusters, logistics, and resource distribution.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Total Clusters" value="4" icon={MapPin} />
        <Card variant="stat" title="Total Capacity" value="45K" icon={Layers} trend={{ value: 5, isPositive: true }} />
        <Card variant="stat" title="Pending Deliveries" value="6" icon={Truck} />
        <Card variant="stat" title="Tasks Completed" value="89%" icon={CheckSquare} trend={{ value: 2, isPositive: true }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Cluster Overview" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={clusters} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;

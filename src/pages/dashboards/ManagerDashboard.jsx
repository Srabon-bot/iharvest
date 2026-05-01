import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { Layers, MapPin, Truck, CheckSquare } from 'lucide-react';
import { getClustersByManager } from '../../services/clusterService';
import { useAuth } from '../../hooks/useAuth';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const data = await getClustersByManager(user?.uid);
        if (data && data.length > 0) setClusters(data);
      } catch (error) {
        console.error('Failed to fetch clusters:', error);
      }
    };
    if (user?.uid) fetchClusters();
  }, [user]);

  const totalCapacity = clusters.reduce((sum, c) => sum + Number(c.capacity || 0), 0);

  const columns = [
    { header: 'Cluster ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Capacity', accessor: 'capacity', render: (v) => v ? Number(v).toLocaleString() : '0' },
    { header: 'Active Farms', accessor: 'activeFarms', render: (v) => v ? String(v) : '0' },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Cluster Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Oversee regional clusters, logistics, and resource distribution.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Total Clusters" value={String(clusters.length)} icon={MapPin} />
        <Card variant="stat" title="Total Capacity" value={totalCapacity > 1000 ? `${(totalCapacity/1000).toFixed(1)}K` : String(totalCapacity)} icon={Layers} />
        <Card variant="stat" title="Pending Deliveries" value="0" icon={Truck} />
        <Card variant="stat" title="Tasks Completed" value="0%" icon={CheckSquare} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Cluster Overview">
          <Table columns={columns} data={clusters} searchable pageSize={8} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;

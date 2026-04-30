import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { Syringe, Cross, Calendar, ClipboardList } from 'lucide-react';
import { getVetRequests, getPendingRequests } from '../../services/vetService';
import { useAuth } from '../../hooks/useAuth';

const VetDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) return;
      try {
        const [assigned, pending] = await Promise.all([
          getVetRequests(user.uid),
          getPendingRequests(),
        ]);

        // Combine and dedup (in case assigned is also in pending, though unlikely by business logic)
        const all = [...assigned, ...pending];
        const unique = Array.from(new Map(all.map(r => [r.id, r])).values());

        setRequests(unique.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        }));
      } catch (error) {
        console.error('Failed to fetch vet requests:', error);
      }
    };
    fetchRequests();
  }, [user]);

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  const columns = [
    { header: 'Request ID', accessor: 'id' },
    { header: 'Farmer', accessor: 'farmerId' },
    { header: 'Livestock ID', accessor: 'livestockId' },
    { header: 'Issue', accessor: 'issue' },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'Date', accessor: 'createdAt', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Veterinary Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage health requests, vaccinations, and field visits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Pending Requests" value={String(pendingCount)} icon={ClipboardList} trend={{ value: pendingCount, isPositive: false }} />
        <Card variant="stat" title="Scheduled Visits" value="5" icon={Calendar} />
        <Card variant="stat" title="Vaccinations Due" value="8" icon={Syringe} trend={{ value: -3, isPositive: true }} />
        <Card variant="stat" title="Cases Resolved" value={String(completedCount)} icon={Cross} trend={{ value: completedCount, isPositive: true }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Recent Health Requests">
          <Table columns={columns} data={requests} searchable pageSize={8} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VetDashboard;

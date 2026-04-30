import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getLivestockByFarmer } from '../../services/livestockService';
import { getTransactionsByUser } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import { formatBDT } from '../../utils/formatters';
import { Bird, Calendar, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [livestock, setLivestock] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user?.uid) return;
      try {
        const [lsData, txData] = await Promise.all([
          getLivestockByFarmer(user.uid),
          getTransactionsByUser(user.uid)
        ]);
        if (lsData) setLivestock(lsData);
        if (txData) setTransactions(txData);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
      } finally {
        setLoading(false);
      }
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
  const completedCycles = livestock.filter(l => l.status === 'sold' || l.status === 'harvested').length;
  
  // Calculate profit share from transactions
  const totalProfitShare = transactions
    .filter(t => t.status === 'completed' && t.type === 'payout')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Farmer Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your active batches, upcoming tasks, and track your profit shares.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Active Livestock" value={livestock.filter(l => l.status !== 'sold' && l.status !== 'harvested').reduce((s, l) => s + Number(l.quantity || 0), 0).toLocaleString()} icon={Bird} />
        <Card variant="stat" title="Completed Cycles" value={String(completedCycles)} icon={CheckCircle} trend={{ value: completedCycles, isPositive: true }} />
        <Card variant="stat" title="Total Profit Share" value={formatBDT(totalProfitShare)} icon={DollarSign} trend={{ value: totalProfitShare > 0 ? 10 : 0, isPositive: true }} />
        <Card variant="stat" title="Alerts" value={String(alerts)} icon={AlertTriangle} trend={{ value: alerts, isPositive: false }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Your Assigned Batches">
          {loading ? (
            <p style={{ padding: '0 var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading batches...</p>
          ) : livestock.length === 0 ? (
            <p style={{ padding: '0 var(--spacing-lg)', color: 'var(--text-secondary)' }}>No active batches assigned. An FSO will contact you soon.</p>
          ) : (
            <Table columns={columns} data={livestock} searchable pageSize={8} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;

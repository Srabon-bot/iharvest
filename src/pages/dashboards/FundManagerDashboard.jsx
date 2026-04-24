import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { DollarSign, PieChart, Send, CreditCard } from 'lucide-react';
import { getAllTransactions } from '../../services/transactionService';

const FundManagerDashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        if (data && data.length > 0) setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

  const columns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Type', accessor: 'type', render: (v) => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
    { header: 'Amount', accessor: 'amount', render: (v) => `$${Number(v).toLocaleString()}` },
    { header: 'User ID', accessor: 'userId' },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'Date', accessor: 'createdAt', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Fund Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage liquidity pools, approve payouts, and monitor financial health.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Total Assets" value={`$${totalVolume.toLocaleString()}`} icon={PieChart} />
        <Card variant="stat" title="Available Liquidity" value="$350K" icon={DollarSign} />
        <Card variant="stat" title="Pending Actions" value={String(pendingCount)} icon={Send} trend={{ value: pendingCount, isPositive: false }} />
        <Card variant="stat" title="Total Transactions" value={String(transactions.length)} icon={CreditCard} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Recent Transactions">
          <Table columns={columns} data={transactions} searchable pageSize={8} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FundManagerDashboard;

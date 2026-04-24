import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { DollarSign, PieChart, Send, CreditCard } from 'lucide-react';

const FundManagerDashboard = () => {
  const transactions = [
    { id: 'TXN-001', type: 'Investment', amount: '$1,500', from: 'Inv-001', to: 'Pool-A', status: 'Completed', date: '2026-04-20' },
    { id: 'TXN-002', type: 'Payout', amount: '$450', from: 'Pool-A', to: 'Farmer-12', status: 'Pending', date: '2026-04-24' },
  ];

  const columns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Type', accessor: 'type' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'From', accessor: 'from' },
    { header: 'To', accessor: 'to' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Fund Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage liquidity pools, approve payouts, and monitor financial health.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Total Assets" value="$1.2M" icon={PieChart} trend={{ value: 4, isPositive: true }} />
        <Card variant="stat" title="Available Liquidity" value="$350K" icon={DollarSign} />
        <Card variant="stat" title="Pending Payouts" value="$12K" icon={Send} trend={{ value: 10, isPositive: false }} />
        <Card variant="stat" title="Recent Deposits" value="$45K" icon={CreditCard} trend={{ value: 15, isPositive: true }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Recent Transactions" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={transactions} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FundManagerDashboard;

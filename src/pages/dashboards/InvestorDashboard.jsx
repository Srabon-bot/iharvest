import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { Briefcase, TrendingUp, DollarSign, PackageOpen } from 'lucide-react';

const InvestorDashboard = () => {
  const activeInvestments = [
    { id: 'INV-001', package: 'Broiler Batch 500', amount: '$1,500', roi: '12%', status: 'Active', endDate: '2026-06-15' },
    { id: 'INV-002', package: 'Dairy Cow Unit', amount: '$2,000', roi: '15%', status: 'Active', endDate: '2026-12-01' },
  ];

  const columns = [
    { header: 'Investment ID', accessor: 'id' },
    { header: 'Package', accessor: 'package' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Est. ROI', accessor: 'roi' },
    { header: 'Status', accessor: 'status' },
    { header: 'End Date', accessor: 'endDate' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Investor Portfolio
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your assets, ROIs, and find new opportunities.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Total Invested" value="$3,500" icon={Briefcase} />
        <Card variant="stat" title="Est. Returns" value="$480" icon={TrendingUp} trend={{ value: 13.7, isPositive: true }} />
        <Card variant="stat" title="Wallet Balance" value="$1,250" icon={DollarSign} />
        <Card variant="stat" title="Available Packages" value="8" icon={PackageOpen} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Your Active Investments" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={activeInvestments} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;

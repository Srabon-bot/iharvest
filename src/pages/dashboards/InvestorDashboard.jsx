import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import TraceabilityView from '../../components/ui/TraceabilityView';
import { getInvestmentsByInvestor } from '../../services/investmentService';
import { getActivePackages } from '../../services/packageService';
import { useAuth } from '../../hooks/useAuth';
import { Briefcase, TrendingUp, DollarSign, PackageOpen } from 'lucide-react';

const SEED_INVESTMENTS = [
  { id: 'INV-001', packageId: 'pkg1', amount: 1500, expectedROI: 12, currentROI: 5.2, status: 'active', startDate: '2026-01-01', endDate: '2026-07-01' },
  { id: 'INV-002', packageId: 'pkg2', amount: 2000, expectedROI: 15, currentROI: 0, status: 'active', startDate: '2026-02-01', endDate: '2027-02-01' },
];

const DEMO_TRACE = {
  investor: { name: 'Demo Investor', id: 'INV-001' },
  package: { name: 'Broiler Batch 500', type: 'Chicken' },
  livestock: { type: 'Broiler Chicken', quantity: 500, status: 'active' },
  farmer: { name: 'Ali Khan', id: 'f1' },
  fso: { name: 'David FSO', id: 'fso1' },
};

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState(SEED_INVESTMENTS);
  const [availablePackages, setAvailablePackages] = useState(8);

  useEffect(() => {
    (async () => {
      try {
        const [inv, pkgs] = await Promise.all([
          getInvestmentsByInvestor(user?.uid || 'demo'),
          getActivePackages(),
        ]);
        if (inv.length) setInvestments(inv);
        if (pkgs.length) setAvailablePackages(pkgs.length);
      } catch { /* use seed */ }
    })();
  }, [user]);

  const totalInvested = investments.reduce((s, i) => s + Number(i.amount || 0), 0);
  const estReturns = investments.reduce((s, i) => s + Number(i.amount || 0) * Number(i.expectedROI || 0) / 100, 0);

  const columns = [
    { header: 'Investment ID', accessor: 'id' },
    { header: 'Package', accessor: 'packageId' },
    { header: 'Amount', accessor: 'amount', render: (v) => `$${Number(v).toLocaleString()}` },
    { header: 'Est. ROI', accessor: 'expectedROI', render: (v) => `${v}%` },
    { header: 'Current ROI', accessor: 'currentROI', render: (v) => <span style={{ color: '#16a34a', fontWeight: 600 }}>{v}%</span> },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'End Date', accessor: 'endDate', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Investor Portfolio
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your assets, ROIs, and find new opportunities.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Total Invested" value={`$${totalInvested.toLocaleString()}`} icon={Briefcase} />
        <Card variant="stat" title="Est. Returns" value={`$${Math.round(estReturns).toLocaleString()}`} icon={TrendingUp} trend={{ value: estReturns > 0 ? Math.round(estReturns / totalInvested * 100) : 0, isPositive: true }} />
        <Card variant="stat" title="Wallet Balance" value="$1,250" icon={DollarSign} />
        <Card variant="stat" title="Available Packages" value={String(availablePackages)} icon={PackageOpen} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Your Active Investments">
          <Table columns={columns} data={investments} searchable pageSize={8} />
        </Card>

        <Card title="Investment Traceability — Sample">
          <p style={{ padding: '0 var(--spacing-lg)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            Track the full chain of your investment from purchase to livestock to farmer.
          </p>
          <TraceabilityView data={DEMO_TRACE} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;

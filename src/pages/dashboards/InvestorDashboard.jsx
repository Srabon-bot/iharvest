import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import TraceabilityView from '../../components/ui/TraceabilityView';
import { getInvestmentsByInvestor } from '../../services/investmentService';
import { getActivePackages } from '../../services/packageService';
import { getTransactionsByUser } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import { formatBDT } from '../../utils/formatters';
import { Briefcase, TrendingUp, DollarSign, PackageOpen } from 'lucide-react';

const DEMO_TRACE = {
  investor: { name: 'Demo Investor', id: 'INV-001' },
  package: { name: 'Broiler Batch 500', type: 'Chicken' },
  livestock: { type: 'Broiler Chicken', quantity: 500, status: 'active' },
  farmer: { name: 'Ali Khan', id: 'f1' },
  fso: { name: 'David FSO', id: 'fso1' },
};

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [availablePackages, setAvailablePackages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user?.uid) return;
      try {
        const [inv, pkgs, txs] = await Promise.all([
          getInvestmentsByInvestor(user.uid),
          getActivePackages(),
          getTransactionsByUser(user.uid),
        ]);
        setInvestments(inv || []);
        setAvailablePackages(pkgs?.length || 0);
        setTransactions(txs || []);
      } catch (error) {
        console.error('Error fetching investor data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const totalInvested = investments.reduce((s, i) => s + Number(i.amount || 0), 0);
  
  // Calculate est returns based on active vs completed
  const totalPayouts = investments
    .filter(i => i.status === 'completed' && i.financials)
    .reduce((s, i) => s + Number(i.financials.investorPayout || 0), 0);

  const walletBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => t.type === 'payout' ? sum + t.amount : sum - t.amount, 0);

  const columns = [
    { header: 'Investment ID', accessor: 'id' },
    { header: 'Package', accessor: 'packageId' },
    { header: 'Capital', accessor: 'amount', render: (v) => formatBDT(v) },
    { header: 'Profit Split', accessor: 'investorSplit', render: (v) => `${v || 40}%` },
    { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'Payout', accessor: 'financials', render: (v) => v ? formatBDT(v.investorPayout) : '—' },
    { header: 'End Date', accessor: 'endDate', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Investor Portfolio
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your active Mudarabah contracts, profit shares, and wallet.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Total Capital Deployed" value={formatBDT(totalInvested)} icon={Briefcase} />
        <Card variant="stat" title="Total Payouts Received" value={formatBDT(totalPayouts)} icon={TrendingUp} trend={{ value: totalPayouts > 0 ? 100 : 0, isPositive: true }} />
        <Card variant="stat" title="Wallet Balance" value={formatBDT(walletBalance)} icon={DollarSign} />
        <Card variant="stat" title="Available Packages" value={String(availablePackages)} icon={PackageOpen} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Your Investments">
          {loading ? (
            <p style={{ padding: '0 var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading portfolio...</p>
          ) : investments.length === 0 ? (
            <p style={{ padding: '0 var(--spacing-lg)', color: 'var(--text-secondary)' }}>You haven't made any investments yet. Check the Marketplace!</p>
          ) : (
            <Table columns={columns} data={investments} searchable pageSize={8} />
          )}
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

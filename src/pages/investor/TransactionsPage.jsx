import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getTransactionsByUser } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import { DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const SEED_TRANSACTIONS = [
    { id: 'TXN-001', type: 'deposit', amount: 1500, description: 'Investment in Broiler Batch 500', status: 'completed', createdAt: '2026-04-01' },
    { id: 'TXN-002', type: 'deposit', amount: 2000, description: 'Investment in Dairy Cow Unit', status: 'completed', createdAt: '2026-03-15' },
    { id: 'TXN-003', type: 'payout', amount: 180, description: 'Q1 ROI Payout — Broiler Batch 001', status: 'completed', createdAt: '2026-03-31' },
    { id: 'TXN-004', type: 'deposit', amount: 900, description: 'Investment in Layer Hen Pack', status: 'pending', createdAt: '2026-04-20' },
];

const TransactionsPage = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getTransactionsByUser(user?.uid || 'demo');
                if (data && data.length) setTransactions(data);
            } catch { /* keep seed */ } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0);
    const totalPayouts = transactions.filter(t => t.type === 'payout').reduce((s, t) => s + Number(t.amount), 0);

    const columns = [
        { header: 'Transaction ID', accessor: 'id' },
        {
            header: 'Type', accessor: 'type',
            render: (v) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {v === 'deposit' ? <ArrowDownLeft size={14} color="#dc2626" /> : <ArrowUpRight size={14} color="#16a34a" />}
                    <span style={{ textTransform: 'capitalize' }}>{v}</span>
                </span>
            )
        },
        {
            header: 'Amount', accessor: 'amount',
            render: (v, row) => (
                <span style={{ color: row.type === 'payout' ? '#16a34a' : 'var(--text-primary)', fontWeight: 600 }}>
                    {row.type === 'payout' ? '+' : '-'}${Number(v).toLocaleString()}
                </span>
            )
        },
        { header: 'Description', accessor: 'description' },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'Date', accessor: 'createdAt', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    ];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                    Transaction History
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>All your deposits, investments, and payout records.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Invested" value={`$${totalDeposits.toLocaleString()}`} icon={DollarSign} />
                <Card variant="stat" title="Total Payouts" value={`$${totalPayouts.toLocaleString()}`} icon={ArrowUpRight} trend={{ isPositive: true }} />
                <Card variant="stat" title="Total Transactions" value={String(transactions.length)} icon={ArrowDownLeft} />
            </div>

            <Card title="All Transactions">
                {loading
                    ? <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading…</p>
                    : <Table columns={columns} data={transactions} searchable pageSize={10} />
                }
            </Card>
        </DashboardLayout>
    );
};

export default TransactionsPage;

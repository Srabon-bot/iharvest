import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { getTransactionsByUser } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import { formatBDT } from '../../utils/formatters';
import { DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionsPage = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                if (!user?.uid) return;
                const data = await getTransactionsByUser(user.uid);
                setTransactions(data || []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
            finally {
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
        { header: 'Amount', accessor: 'amount', render: (v, row) => <span style={{ color: row.type === 'payout' ? '#16a34a' : 'var(--text-primary)', fontWeight: 600 }}>{row.type === 'payout' ? '+' : '-'}{formatBDT(v)}</span> },
        { header: 'Description', accessor: 'description' },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'Date', accessor: 'createdAt' },
    ];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Transaction History</h1>
                <p style={{ color: 'var(--text-secondary)' }}>All your deposits, investments, and payout records.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Invested" value={formatBDT(totalDeposits)} icon={DollarSign} />
                <Card variant="stat" title="Total Payouts" value={formatBDT(totalPayouts)} icon={ArrowUpRight} trend={{ value: totalPayouts, isPositive: true }} />
            </div>
            <Card title="All Transactions">
                {loading ? <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading…</p>
                    : <Table columns={columns} data={transactions} searchable pageSize={10} />}
            </Card>
        </DashboardLayout>
    );
};

export default TransactionsPage;

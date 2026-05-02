import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { getAllVetRequests } from '../../services/vetService';
import { VET_REQUEST_STATUS } from '../../utils/constants';

const columns = [
    { header: 'Farmer', accessor: 'farmerId' },
    { header: 'Livestock', accessor: 'livestockId' },
    { header: 'Issue', accessor: 'issue' },
    { header: 'Prescription', accessor: 'prescription' },
    { header: 'Status', accessor: 'status', render: () => <StatusBadge status="completed" /> },
    { header: 'Resolved Date', accessor: 'createdAt', render: (v) => v?.seconds ? new Date(v.seconds * 1000).toLocaleDateString() : 'N/A' },
];

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRequests, setTotalRequests] = useState(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getAllVetRequests();
                if (data) {
                    setTotalRequests(data.length);
                    // Filter to only show completed ones for the report
                    setReports(data.filter(r => r.status === VET_REQUEST_STATUS.COMPLETED));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Calculate dynamic stats
    const resolutionRate = totalRequests > 0 ? ((reports.length / totalRequests) * 100).toFixed(1) : 0;
    
    // Calculate common issues (mock keyword matching for demonstration of dynamicity)
    const issuesMap = { 'Respiratory': 0, 'Infection': 0, 'Injury': 0, 'Other': 0 };
    reports.forEach(r => {
        const text = (r.issue || '').toLowerCase();
        if (text.includes('respiratory') || text.includes('breathing')) issuesMap['Respiratory']++;
        else if (text.includes('infection') || text.includes('fever')) issuesMap['Infection']++;
        else if (text.includes('limp') || text.includes('injury')) issuesMap['Injury']++;
        else issuesMap['Other']++;
    });

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Vet Reports & Analytics</h1>
                <p style={{ color: 'var(--text-secondary)' }}>History of all resolved veterinary cases and health trends.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Cases Resolved" value={String(reports.length)} icon={CheckCircle} trend={{ value: reports.length, isPositive: true }} />
                <Card variant="stat" title="Resolution Rate" value={`${resolutionRate}%`} icon={TrendingUp} trend={{ value: parseFloat(resolutionRate), isPositive: true }} />
                <Card variant="stat" title="Total Reported Issues" value={String(totalRequests)} icon={Activity} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)', alignItems: 'start' }}>
                <Card title="Resolved Cases History">
                    {loading ? <p style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Loading live reports…</p> 
                             : reports.length > 0 ? <Table columns={columns} data={reports} searchable pageSize={10} />
                             : <p style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>No resolved cases found.</p>}
                </Card>

                <Card title="Common Health Issues">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {Object.entries(issuesMap).map(([issue, count]) => {
                            const percent = reports.length > 0 ? (count / reports.length) * 100 : 0;
                            return (
                                <div key={issue}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                                        <span>{issue}</span>
                                        <span>{count} cases</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ReportsPage;

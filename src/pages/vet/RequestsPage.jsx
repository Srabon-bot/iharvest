import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { getPendingRequests, updateRequestStatus, assignVetToRequest } from '../../services/vetService';
import { useAuth } from '../../hooks/useAuth';
import { VET_REQUEST_STATUS } from '../../utils/constants';
import { Syringe, CheckSquare, ClipboardList } from 'lucide-react';

const SEED = [
    { id: 'REQ-01', farmerId: 'f1', fsoId: 'fso1', livestockId: 'BCH-102', issue: 'Reduced feeding activity, 3 birds lethargic', status: 'pending', vetId: null, prescription: null, createdAt: '2026-04-24' },
    { id: 'REQ-02', farmerId: 'f3', fsoId: 'fso2', livestockId: 'COW-05', issue: 'Limping on hind leg', status: 'pending', vetId: null, prescription: null, createdAt: '2026-04-23' },
    { id: 'REQ-03', farmerId: 'f2', fsoId: 'fso1', livestockId: 'BCH-101', issue: 'Respiratory symptoms in 5 birds', status: 'in_progress', vetId: 'vet1', prescription: 'Amoxicillin 250mg x 5 days', createdAt: '2026-04-22' },
];

const RequestsPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState(SEED);
    const [diagnosing, setDiagnosing] = useState(null);
    const [prescription, setPrescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getPendingRequests();
            if (data && data.length) setRequests(data);
        } catch { /* keep seed */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openDiagnose = (req) => { setDiagnosing(req); setPrescription(''); };

    const handleResolve = async () => {
        setSaving(true);
        try {
            await assignVetToRequest(diagnosing.id, user?.uid || 'vet-demo');
            await updateRequestStatus(diagnosing.id, VET_REQUEST_STATUS.COMPLETED, prescription);
        } catch { /* mock */ }
        setRequests((r) => r.map((x) => x.id === diagnosing.id
            ? { ...x, status: 'completed', prescription, vetId: user?.uid || 'vet-demo' } : x));
        setSaving(false); setDiagnosing(null);
    };

    const columns = [
        { header: 'Request ID', accessor: 'id' },
        { header: 'Farmer', accessor: 'farmerId' },
        { header: 'Livestock', accessor: 'livestockId' },
        { header: 'Issue', accessor: 'issue', render: (v) => <span style={{ fontSize: '0.82rem' }}>{v}</span> },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'Prescription', accessor: 'prescription', render: (v) => v ? <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>{v}</span> : '—' },
        { header: 'Date', accessor: 'createdAt' },
        {
            header: 'Actions', accessor: 'id',
            render: (_, row) => row.status !== 'completed'
                ? <Button size="sm" variant="primary" onClick={() => openDiagnose(row)}>Diagnose</Button>
                : <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>✓ Resolved</span>
        },
    ];

    const pending = requests.filter(r => r.status === 'pending').length;
    const resolved = requests.filter(r => r.status === 'completed').length;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Health Requests</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Review, diagnose, and prescribe treatment for reported livestock health issues.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Pending" value={String(pending)} icon={ClipboardList} trend={{ value: pending, isPositive: false }} />
                <Card variant="stat" title="Resolved" value={String(resolved)} icon={CheckSquare} trend={{ value: resolved, isPositive: true }} />
            </div>
            <Card title="All Requests">
                {loading ? <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading…</p>
                    : <Table columns={columns} data={requests} searchable pageSize={8} />}
            </Card>

            <Modal
                isOpen={!!diagnosing} onClose={() => setDiagnosing(null)}
                title={`Diagnose — ${diagnosing?.id}`} size="md"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setDiagnosing(null)}>Cancel</Button>
                        <Button variant="primary" onClick={handleResolve} disabled={saving || !prescription}>
                            {saving ? 'Saving…' : 'Resolve & Prescribe'}
                        </Button>
                    </div>
                }
            >
                {diagnosing && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Reported Issue</div>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{diagnosing.issue}</p>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Livestock: <strong>{diagnosing.livestockId}</strong> · Farmer: <strong>{diagnosing.farmerId}</strong>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Prescription / Treatment</label>
                            <textarea
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="e.g. Amoxicillin 250mg x 5 days, isolate affected birds..."
                                rows={4}
                                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default RequestsPage;

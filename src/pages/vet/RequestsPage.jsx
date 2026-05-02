import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllVetRequests, updateRequestStatus, assignVetToRequest } from '../../services/vetService';
import { useAuth } from '../../hooks/useAuth';
import { VET_REQUEST_STATUS } from '../../utils/constants';
import { Syringe, CheckSquare, ClipboardList, Filter } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const RequestsPage = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [diagnosing, setDiagnosing] = useState(null);
    const [prescription, setPrescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'

    const load = async () => {
        setLoading(true);
        try {
            const data = await getAllVetRequests();
            if (data) setRequests(data);
        } catch (error) {
            console.error(error);
            addToast({ message: 'Failed to load requests', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openDiagnose = (req) => { setDiagnosing(req); setPrescription(''); };

    const handleResolve = async () => {
        setSaving(true);
        try {
            const vetId = user?.uid || 'vet-demo';
            await assignVetToRequest(diagnosing.id, vetId);
            await updateRequestStatus(diagnosing.id, VET_REQUEST_STATUS.COMPLETED, prescription);
            addToast({ message: 'Request resolved successfully', type: 'success' });
            
            // Update local state to reflect changes instantly
            setRequests((r) => r.map((x) => x.id === diagnosing.id
                ? { ...x, status: VET_REQUEST_STATUS.COMPLETED, prescription, vetId } : x));
            setDiagnosing(null);
        } catch (error) {
            console.error(error);
            addToast({ message: 'Failed to resolve request', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        { header: 'Farmer', accessor: 'farmerId' },
        { header: 'Livestock', accessor: 'livestockId' },
        { header: 'Issue', accessor: 'issue', render: (v) => <span style={{ fontSize: '0.82rem' }}>{v}</span> },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'Prescription', accessor: 'prescription', render: (v) => v ? <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>{v}</span> : '—' },
        { header: 'Date', accessor: 'createdAt', render: (v) => v?.seconds ? new Date(v.seconds * 1000).toLocaleDateString() : v },
        {
            header: 'Actions', accessor: 'id',
            render: (_, row) => row.status !== VET_REQUEST_STATUS.COMPLETED
                ? <Button size="sm" variant="primary" onClick={() => openDiagnose(row)}>Diagnose</Button>
                : <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 500 }}>✓ Resolved</span>
        },
    ];

    const pending = requests.filter(r => r.status === VET_REQUEST_STATUS.PENDING).length;
    const resolved = requests.filter(r => r.status === VET_REQUEST_STATUS.COMPLETED).length;

    const filteredRequests = requests.filter(r => {
        if (activeTab === 'pending') return r.status === VET_REQUEST_STATUS.PENDING;
        return true;
    });

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Health Requests</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Review, diagnose, and prescribe treatment for reported livestock health issues.</p>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Pending" value={String(pending)} icon={ClipboardList} trend={{ value: pending, isPositive: false }} />
                <Card variant="stat" title="Resolved" value={String(resolved)} icon={CheckSquare} trend={{ value: resolved, isPositive: true }} />
            </div>

            <Card title="Requests Overview">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <button 
                        onClick={() => setActiveTab('pending')}
                        style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : 'none' }}
                    >
                        Pending Requests ({pending})
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'all' ? '2px solid var(--primary)' : 'none' }}
                    >
                        All Requests ({requests.length})
                    </button>
                </div>
                
                {loading ? <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading live data from Firestore…</p>
                    : filteredRequests.length > 0 ? <Table columns={columns} data={filteredRequests} searchable pageSize={8} /> 
                    : <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>No requests found in this category.</p>}
            </Card>

            <Modal
                isOpen={!!diagnosing} onClose={() => setDiagnosing(null)}
                title={`Diagnose Case`} size="md"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setDiagnosing(null)}>Cancel</Button>
                        <Button variant="primary" onClick={handleResolve} disabled={saving || !prescription.trim()}>
                            {saving ? 'Saving to Database…' : 'Resolve & Prescribe'}
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
                            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Prescription / Treatment Instructions</label>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <select 
                                    onChange={(e) => setPrescription(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a common treatment template...</option>
                                    <option value="Amoxicillin 250mg x 5 days in drinking water. Isolate sick birds.">Amoxicillin 250mg (Poultry)</option>
                                    <option value="Multi-vitamin supplement in feed for 14 days.">Multi-vitamin supplement</option>
                                    <option value="Topical iodine spray and keep hoof dry.">Topical iodine (Hoof care)</option>
                                    <option value="Deworming treatment required (Albendazole).">Deworming treatment</option>
                                </select>
                            </div>
                            <textarea
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="Or type a custom prescription..."
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

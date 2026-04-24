import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { LightboxTrigger } from '../../components/ui/Lightbox';
import { getSurveysByFso, submitSurvey } from '../../services/surveyService';
import { useAuth } from '../../hooks/useAuth';
import { HEALTH_STATUS } from '../../utils/constants';
import { ClipboardCheck, CheckCircle, Plus } from 'lucide-react';

const SEED = [
    { id: 'SRV-001', farmerId: 'f1', healthStatus: 'healthy', feedUsed: 50, mortality: 0, note: 'All good', imageUrl: null, createdAt: '2026-04-24' },
    { id: 'SRV-002', farmerId: 'f2', healthStatus: 'sick', feedUsed: 40, mortality: 2, note: 'Two birds showing lethargy', imageUrl: null, createdAt: '2026-04-23' },
    { id: 'SRV-003', farmerId: 'f3', healthStatus: 'healthy', feedUsed: 55, mortality: 0, note: '', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=200', createdAt: '2026-04-22' },
];

const EMPTY = { farmerId: 'f1', livestockId: 'BCH-101', healthStatus: 'healthy', feedUsed: '', mortality: '0', note: '', imageUrl: '' };

const SurveysPage = () => {
    const { user } = useAuth();
    const [surveys, setSurveys] = useState(SEED);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);

    const load = async () => {
        try {
            const data = await getSurveysByFso(user?.uid || 'demo');
            if (data && data.length) setSurveys(data);
        } catch { /* keep seed */ }
    };

    useEffect(() => { load(); }, [user]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await submitSurvey({ ...form, fsoId: user?.uid || 'demo', feedUsed: Number(form.feedUsed), mortality: Number(form.mortality) });
        } catch { /* mock */ }
        setSurveys((s) => [{
            id: `SRV-${Date.now()}`, farmerId: form.farmerId, healthStatus: form.healthStatus,
            feedUsed: form.feedUsed, mortality: form.mortality, note: form.note, imageUrl: form.imageUrl || null,
            createdAt: new Date().toISOString().split('T')[0],
        }, ...s]);
        setForm(EMPTY); setSubmitting(false); setShowModal(false);
    };

    const columns = [
        { header: 'Survey ID', accessor: 'id' },
        { header: 'Farmer ID', accessor: 'farmerId' },
        { header: 'Health', accessor: 'healthStatus', render: (v) => <StatusBadge status={v} /> },
        { header: 'Feed Used (kg)', accessor: 'feedUsed' },
        { header: 'Mortality', accessor: 'mortality' },
        { header: 'Notes', accessor: 'note', render: (v) => <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v || '—'}</span> },
        { header: 'Photo', accessor: 'imageUrl', render: (v) => <LightboxTrigger src={v} alt="Survey photo" /> },
        { header: 'Date', accessor: 'createdAt' },
    ];

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Surveys</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Submit daily farm surveys and view your submission history.</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> Submit Survey
                </Button>
            </div>

            <Card title="Survey History">
                <Table columns={columns} data={surveys} searchable pageSize={8} />
            </Card>

            <Modal
                isOpen={showModal} onClose={() => setShowModal(false)}
                title="Submit Daily Farm Survey" size="md"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={submitting || !form.feedUsed}>
                            {submitting ? 'Submitting…' : 'Submit Survey'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Farmer ID</label>
                            <select value={form.farmerId} onChange={(e) => setForm(f => ({ ...f, farmerId: e.target.value }))}
                                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                <option value="f1">Ali Khan (f1)</option>
                                <option value="f2">Sarah Connor (f2)</option>
                                <option value="f3">Tom Brown (f3)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Health Status</label>
                            <select value={form.healthStatus} onChange={(e) => setForm(f => ({ ...f, healthStatus: e.target.value }))}
                                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                {Object.values(HEALTH_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <Input label="Feed Used (kg)" type="number" placeholder="50" value={form.feedUsed} onChange={(e) => setForm(f => ({ ...f, feedUsed: e.target.value }))} />
                        <Input label="Mortality Count" type="number" placeholder="0" value={form.mortality} onChange={(e) => setForm(f => ({ ...f, mortality: e.target.value }))} />
                    </div>
                    <Input label="Observations / Notes" placeholder="Any health issues or notes..." value={form.note} onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))} />
                    <Input label="Photo URL (optional)" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default SurveysPage;

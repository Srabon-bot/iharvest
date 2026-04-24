import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { submitSurvey } from '../../services/surveyService';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, ClipboardList } from 'lucide-react';
import { HEALTH_STATUS } from '../../utils/constants';

const SEED_TASKS = [
    { id: 'T001', batch: 'BCH-101', action: 'Morning Feed', feedKg: 50, mortality: 0, status: 'Completed', date: '2026-04-24' },
    { id: 'T002', batch: 'BCH-102', action: 'Health Check', feedKg: 0, mortality: 1, status: 'Pending', date: '2026-04-24' },
];

const TasksPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState(SEED_TASKS);
    const [form, setForm] = useState({ batch: 'BCH-101', feedKg: '', mortality: '0', note: '', healthStatus: 'healthy' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitSurvey({
                livestockId: form.batch,
                fsoId: 'fso-demo',
                farmerId: user?.uid || 'demo',
                healthStatus: form.healthStatus,
                feedUsed: Number(form.feedKg),
                mortality: Number(form.mortality),
                note: form.note,
            });
        } catch { /* mock */ }
        const newTask = {
            id: `T${Date.now()}`, batch: form.batch, action: 'Daily Report',
            feedKg: form.feedKg, mortality: form.mortality, status: 'Completed',
            date: new Date().toISOString().split('T')[0],
        };
        setTasks((t) => [newTask, ...t]);
        setForm({ batch: 'BCH-101', feedKg: '', mortality: '0', note: '', healthStatus: 'healthy' });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setSubmitting(false);
    };

    const columns = [
        { header: 'Task ID', accessor: 'id' },
        { header: 'Batch', accessor: 'batch' },
        { header: 'Action', accessor: 'action' },
        { header: 'Feed (kg)', accessor: 'feedKg' },
        { header: 'Mortality', accessor: 'mortality' },
        { header: 'Status', accessor: 'status' },
        { header: 'Date', accessor: 'date' },
    ];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Daily Tasks</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Log feeding, mortality counts, and health observations.</p>
            </div>

            <Card title="Log Daily Report" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', padding: 'var(--spacing-lg)' }}>
                    {success && (
                        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={16} /> Daily report submitted successfully!
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch ID</label>
                            <select value={form.batch} onChange={(e) => setForm(f => ({ ...f, batch: e.target.value }))}
                                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                <option>BCH-101</option><option>BCH-102</option><option>BCH-103</option>
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
                        <Input label="Feed Used (kg)" type="number" placeholder="50" value={form.feedKg} onChange={(e) => setForm(f => ({ ...f, feedKg: e.target.value }))} />
                        <Input label="Mortality Count" type="number" placeholder="0" value={form.mortality} onChange={(e) => setForm(f => ({ ...f, mortality: e.target.value }))} />
                    </div>
                    <Input label="Observations / Notes" placeholder="Any notable health observations..." value={form.note} onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))} />
                    <div>
                        <Button type="submit" variant="primary" disabled={submitting || !form.feedKg}>
                            {submitting ? 'Submitting…' : 'Submit Daily Report'}
                        </Button>
                    </div>
                </form>
            </Card>

            <Card title="Recent Task Log">
                <Table columns={columns} data={tasks} searchable pageSize={8} />
            </Card>
        </DashboardLayout>
    );
};

export default TasksPage;

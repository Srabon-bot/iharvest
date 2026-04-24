import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllPackages, createPackage, updatePackage } from '../../services/packageService';
import { PieChart, Plus, PackageOpen } from 'lucide-react';

const SEED_PACKAGES = [
    { id: 'pkg1', name: 'Broiler Batch 500', type: 'Chicken', price: 1500, livestockCount: 500, durationMonths: 6, expectedROI: 12, isActive: true },
    { id: 'pkg2', name: 'Dairy Cow Unit', type: 'Cattle', price: 2000, livestockCount: 5, durationMonths: 12, expectedROI: 15, isActive: true },
    { id: 'pkg3', name: 'Layer Hen Pack', type: 'Chicken', price: 900, livestockCount: 300, durationMonths: 8, expectedROI: 10, isActive: false },
];

const EMPTY_FORM = { name: '', type: 'Chicken', price: '', livestockCount: '', durationMonths: '', expectedROI: '' };

const InvestmentsPage = () => {
    const [packages, setPackages] = useState(SEED_PACKAGES);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            const data = await getAllPackages();
            if (data && data.length) setPackages(data);
        } catch { /* keep seed */ }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        setSaving(true);
        const pkg = {
            name: form.name, type: form.type,
            price: Number(form.price), livestockCount: Number(form.livestockCount),
            durationMonths: Number(form.durationMonths), expectedROI: Number(form.expectedROI),
        };
        try {
            const id = await createPackage(pkg);
            setPackages((p) => [{ ...pkg, id, isActive: true }, ...p]);
        } catch {
            setPackages((p) => [{ ...pkg, id: `pkg-${Date.now()}`, isActive: true }, ...p]);
        } finally {
            setSaving(false);
            setShowCreate(false);
            setForm(EMPTY_FORM);
        }
    };

    const toggleActive = async (pkg) => {
        try { await updatePackage(pkg.id, { isActive: !pkg.isActive }); } catch { /* mock */ }
        setPackages((p) => p.map((x) => x.id === pkg.id ? { ...x, isActive: !x.isActive } : x));
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Price', accessor: 'price', render: (v) => `$${Number(v).toLocaleString()}` },
        { header: 'Livestock', accessor: 'livestockCount' },
        { header: 'Duration', accessor: 'durationMonths', render: (v) => `${v} mo` },
        { header: 'Est. ROI', accessor: 'expectedROI', render: (v) => `${v}%` },
        { header: 'Status', accessor: 'isActive', render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} /> },
        {
            header: 'Actions', accessor: 'id',
            render: (_, row) => (
                <Button size="sm" variant={row.isActive ? 'danger' : 'primary'} onClick={() => toggleActive(row)}>
                    {row.isActive ? 'Deactivate' : 'Activate'}
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        Investment Packages
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage, create, and deactivate investment packages.</p>
                </div>
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                    <Plus size={16} /> Create Package
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Packages" value={String(packages.length)} icon={PackageOpen} />
                <Card variant="stat" title="Active" value={String(packages.filter(p => p.isActive).length)} icon={PieChart} trend={{ value: 0, isPositive: true }} />
            </div>

            <Card title="All Packages">
                <Table columns={columns} data={packages} searchable pageSize={8} />
            </Card>

            <Modal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                title="Create Investment Package"
                size="md"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreate} disabled={saving || !form.name || !form.price}>
                            {saving ? 'Creating…' : 'Create Package'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <Input label="Package Name" placeholder="e.g. Broiler Batch 500" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Livestock Type</label>
                        <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            <option>Chicken</option>
                            <option>Cattle</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <Input label="Price (USD)" type="number" placeholder="1500" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
                        <Input label="Livestock Count" type="number" placeholder="500" value={form.livestockCount} onChange={(e) => setForm(f => ({ ...f, livestockCount: e.target.value }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <Input label="Duration (months)" type="number" placeholder="6" value={form.durationMonths} onChange={(e) => setForm(f => ({ ...f, durationMonths: e.target.value }))} />
                        <Input label="Expected ROI (%)" type="number" placeholder="12" value={form.expectedROI} onChange={(e) => setForm(f => ({ ...f, expectedROI: e.target.value }))} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default InvestmentsPage;

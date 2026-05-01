import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAllPackages, createPackage, updatePackage } from '../../services/packageService';
import { formatBDT } from '../../utils/formatters';
import { PieChart, Plus, PackageOpen } from 'lucide-react';

const EMPTY_FORM = { 
    name: '', 
    type: 'Chicken', 
    price: '', 
    livestockCount: '', 
    durationMonths: '', 
    investorSplit: 40,
    farmerSplit: 60,
    historicalROI: 0
};

const InvestmentsPage = () => {
    const [packages, setPackages] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            const data = await getAllPackages();
            if (data && data.length) setPackages(data);
        } catch (e) {
            console.error('Failed to load packages', e);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        setSaving(true);
        const pkg = {
            name: form.name, 
            type: form.type,
            price: Number(form.price), 
            livestockCount: Number(form.livestockCount),
            durationMonths: Number(form.durationMonths), 
            investorSplit: Number(form.investorSplit),
            farmerSplit: Number(form.farmerSplit),
            historicalROI: Number(form.historicalROI)
        };
        try {
            const id = await createPackage(pkg);
            setPackages((p) => [{ ...pkg, id, isActive: true }, ...p]);
            setShowCreate(false);
            setForm(EMPTY_FORM);
        } catch (e) {
            console.error('Failed to create package', e);
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (pkg) => {
        try { 
            await updatePackage(pkg.id, { isActive: !pkg.isActive }); 
            setPackages((p) => p.map((x) => x.id === pkg.id ? { ...x, isActive: !x.isActive } : x));
        } catch (e) {
            console.error('Failed to update package', e);
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Price', accessor: 'price', render: (v) => formatBDT(v) },
        { header: 'Livestock', accessor: 'livestockCount' },
        { header: 'Duration', accessor: 'durationMonths', render: (v) => `${v} mo` },
        { header: 'Investor Split', accessor: 'investorSplit', render: (v) => `${v}%` },
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
                    <p style={{ color: 'var(--text-secondary)' }}>Manage, create, and deactivate Mudarabah investment packages.</p>
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
                        <Input label="Price (Capital)" type="number" placeholder="1500" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
                        <Input label="Livestock Count" type="number" placeholder="500" value={form.livestockCount} onChange={(e) => setForm(f => ({ ...f, livestockCount: e.target.value }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <Input label="Duration (mos)" type="number" placeholder="6" value={form.durationMonths} onChange={(e) => setForm(f => ({ ...f, durationMonths: e.target.value }))} />
                        <Input label="Inv. Split (%)" type="number" placeholder="40" value={form.investorSplit} onChange={(e) => setForm(f => ({ ...f, investorSplit: e.target.value, farmerSplit: 100 - Number(e.target.value) }))} />
                        <Input label="Farm. Split (%)" type="number" placeholder="60" value={form.farmerSplit} disabled />
                    </div>
                    <Input label="Historical ROI (%) (for Display)" type="number" placeholder="12" value={form.historicalROI} onChange={(e) => setForm(f => ({ ...f, historicalROI: e.target.value }))} />
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default InvestmentsPage;

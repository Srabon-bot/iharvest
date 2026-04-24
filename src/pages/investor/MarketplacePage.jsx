import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { getActivePackages } from '../../services/packageService';
import { createInvestment } from '../../services/investmentService';
import { useAuth } from '../../hooks/useAuth';
import { PackageOpen, TrendingUp, DollarSign, Clock } from 'lucide-react';

const SEED_PACKAGES = [
    { id: 'pkg1', name: 'Broiler Batch 500', type: 'Chicken', price: 1500, livestockCount: 500, durationMonths: 6, expectedROI: 12, isActive: true },
    { id: 'pkg2', name: 'Dairy Cow Unit', type: 'Cattle', price: 2000, livestockCount: 5, durationMonths: 12, expectedROI: 15, isActive: true },
    { id: 'pkg3', name: 'Layer Hen Pack', type: 'Chicken', price: 900, livestockCount: 300, durationMonths: 8, expectedROI: 10, isActive: true },
    { id: 'pkg4', name: 'Premium Cattle', type: 'Cattle', price: 3500, livestockCount: 10, durationMonths: 18, expectedROI: 20, isActive: true },
];

const TYPE_COLORS = { Chicken: '#16a34a', Cattle: '#2563eb' };

const MarketplacePage = () => {
    const { user } = useAuth();
    const [packages, setPackages] = useState(SEED_PACKAGES);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [investing, setInvesting] = useState(false);
    const [invested, setInvested] = useState(new Set());

    useEffect(() => {
        (async () => {
            try {
                const data = await getActivePackages();
                if (data && data.length) setPackages(data);
            } catch { /* keep seed */ }
        })();
    }, []);

    const handleInvest = async () => {
        setInvesting(true);
        try {
            await createInvestment({
                investorId: user?.uid || 'demo',
                packageId: selected.id,
                livestockIds: [],
                amount: selected.price,
                expectedROI: selected.expectedROI,
                durationMonths: selected.durationMonths,
            });
        } catch { /* mock */ }
        setInvested((s) => new Set([...s, selected.id]));
        setInvesting(false);
        setSelected(null);
    };

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Investment Marketplace</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Browse and invest in available livestock packages.</p>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading packages…</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'var(--spacing-lg)' }}>
                    {packages.map((pkg) => (
                        <div key={pkg.id} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                            <div style={{ height: '6px', background: TYPE_COLORS[pkg.type] || '#16a34a' }} />
                            <div style={{ padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{pkg.name}</h3>
                                        <StatusBadge status={pkg.type} />
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary, #16a34a)' }}>${Number(pkg.price).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp size={15} color="#16a34a" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ROI: <strong style={{ color: '#16a34a' }}>{pkg.expectedROI}%</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={15} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pkg.durationMonths} months</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <PackageOpen size={15} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pkg.livestockCount} animals</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DollarSign size={15} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Est. +${Math.round(pkg.price * pkg.expectedROI / 100)}</span>
                                    </div>
                                </div>
                                <Button
                                    variant={invested.has(pkg.id) ? 'secondary' : 'primary'}
                                    style={{ width: '100%' }}
                                    disabled={invested.has(pkg.id)}
                                    onClick={() => setSelected(pkg)}
                                >
                                    {invested.has(pkg.id) ? '✓ Invested' : 'Invest Now'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title="Confirm Investment"
                size="sm"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
                        <Button variant="primary" onClick={handleInvest} disabled={investing}>
                            {investing ? 'Processing…' : `Invest $${selected?.price?.toLocaleString()}`}
                        </Button>
                    </div>
                }
            >
                {selected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>You are about to invest in:</p>
                        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{selected.name}</strong>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Amount: <strong>${selected.price?.toLocaleString()}</strong> · ROI: <strong>{selected.expectedROI}%</strong> · Duration: <strong>{selected.durationMonths} months</strong>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This action will create an investment record tracked on the platform.</p>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default MarketplacePage;

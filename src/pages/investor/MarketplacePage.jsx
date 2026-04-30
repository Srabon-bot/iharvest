import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { getActivePackages } from '../../services/packageService';
import { createInvestment } from '../../services/investmentService';
import { useAuth } from '../../hooks/useAuth';
import { formatBDT } from '../../utils/formatters';
import { PackageOpen, TrendingUp, DollarSign, Clock, PieChart } from 'lucide-react';

const TYPE_COLORS = { Chicken: '#16a34a', Cattle: '#2563eb' };

const MarketplacePage = () => {
    const { user } = useAuth();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [investing, setInvesting] = useState(false);
    const [invested, setInvested] = useState(new Set());

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getActivePackages();
                if (data && data.length) setPackages(data);
            } catch (e) {
                console.error("Failed to load packages", e);
            } finally {
                setLoading(false);
            }
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
                investorSplit: selected.investorSplit || 40,
                farmerSplit: selected.farmerSplit || 60,
                durationMonths: selected.durationMonths,
            });
            setInvested((s) => new Set([...s, selected.id]));
        } catch (e) {
            console.error("Failed to invest", e);
        } finally {
            setInvesting(false);
            setSelected(null);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Investment Marketplace</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Browse and invest in available livestock packages using our Profit-Sharing model.</p>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading packages…</p>
            ) : packages.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No active packages available right now.</p>
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
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary, #16a34a)' }}>{formatBDT(pkg.price)}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <PieChart size={15} color="#16a34a" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Split: <strong style={{ color: '#16a34a' }}>{pkg.investorSplit}%</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp size={15} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hist. ROI: <strong>{pkg.historicalROI || 0}%</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={15} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pkg.durationMonths} months</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <PackageOpen size={15} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pkg.livestockCount} animals</span>
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
                            {investing ? 'Processing…' : `Invest ${selected?.price ? formatBDT(selected.price) : ''}`}
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
                                Capital: <strong>{formatBDT(selected.price)}</strong> · Profit Split: <strong>{selected.investorSplit}%</strong> · Duration: <strong>{selected.durationMonths} months</strong>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            By investing, you enter a Mudarabah contract. You will receive your initial capital plus {selected.investorSplit}% of the net profit upon successful completion of the cycle.
                        </p>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default MarketplacePage;

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Truck, Clock, CheckSquare, Plus } from 'lucide-react';
import { getAllDeliveries, createDelivery, updateDeliveryStatus } from '../../services/deliveryService';
import { DELIVERY_STATUS } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';

const DeliveriesPage = () => {
    const { addToast } = useToast();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    
    // Add Delivery Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newDelivery, setNewDelivery] = useState({ cluster: '', items: '', driver: '' });

    const load = async () => {
        setLoading(true);
        try {
            const data = await getAllDeliveries();
            if (data) setDeliveries(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleAddDelivery = async () => {
        if (!newDelivery.cluster || !newDelivery.items || !newDelivery.driver) return;
        setSaving(true);
        try {
            await createDelivery(newDelivery);
            addToast({ message: 'Delivery scheduled successfully!', type: 'success' });
            setIsAddOpen(false);
            setNewDelivery({ cluster: '', items: '', driver: '' });
            load(); // Reload to get new data
        } catch (error) {
            addToast({ message: 'Failed to schedule delivery', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateDeliveryStatus(id, status);
            addToast({ message: `Delivery marked as ${status.replace('_', ' ')}`, type: 'success' });
            setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));
        } catch (error) {
            addToast({ message: 'Failed to update status', type: 'error' });
        }
    };

    const columns = [
        { header: 'Cluster', accessor: 'cluster' },
        { header: 'Items', accessor: 'items' },
        { header: 'Driver', accessor: 'driver' },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
        { header: 'Date', accessor: 'createdAt', render: (v) => v?.seconds ? new Date(v.seconds * 1000).toLocaleDateString() : 'Just now' },
        {
            header: 'Actions', accessor: 'id',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {row.status === DELIVERY_STATUS.PENDING && (
                        <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(row.id, DELIVERY_STATUS.IN_PROGRESS)}>Dispatch</Button>
                    )}
                    {row.status === DELIVERY_STATUS.IN_PROGRESS && (
                        <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(row.id, DELIVERY_STATUS.COMPLETED)}>Complete</Button>
                    )}
                </div>
            )
        },
    ];

    const pending = deliveries.filter(d => d.status === DELIVERY_STATUS.PENDING).length;
    const completed = deliveries.filter(d => d.status === DELIVERY_STATUS.COMPLETED).length;

    const filteredDeliveries = deliveries.filter(d => {
        if (activeTab === 'all') return true;
        return d.status === activeTab;
    });

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Delivery Tracking</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitor feed, vaccine, and equipment deliveries across all clusters.</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
                    Schedule Delivery
                </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Deliveries" value={String(deliveries.length)} icon={Truck} />
                <Card variant="stat" title="Pending" value={String(pending)} icon={Clock} trend={{ value: pending, isPositive: false }} />
                <Card variant="stat" title="Completed" value={String(completed)} icon={CheckSquare} trend={{ value: completed, isPositive: true }} />
            </div>

            <Card title="Live Deliveries">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    {['all', DELIVERY_STATUS.PENDING, DELIVERY_STATUS.IN_PROGRESS, DELIVERY_STATUS.COMPLETED].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none', textTransform: 'capitalize' }}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                
                {loading ? <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading live data…</p>
                         : filteredDeliveries.length > 0 ? <Table columns={columns} data={filteredDeliveries} searchable pageSize={10} />
                         : <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>No deliveries found.</p>}
            </Card>

            <Modal
                isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}
                title="Schedule New Delivery" size="sm"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAddDelivery} disabled={saving || !newDelivery.cluster || !newDelivery.items || !newDelivery.driver}>
                            {saving ? 'Saving…' : 'Schedule'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Destination Cluster</label>
                        <input type="text" value={newDelivery.cluster} onChange={e => setNewDelivery({...newDelivery, cluster: e.target.value})} placeholder="e.g. North Valley Cluster" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Items</label>
                        <input type="text" value={newDelivery.items} onChange={e => setNewDelivery({...newDelivery, items: e.target.value})} placeholder="e.g. 5,000kg Feed" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Driver Name</label>
                        <input type="text" value={newDelivery.driver} onChange={e => setNewDelivery({...newDelivery, driver: e.target.value})} placeholder="e.g. Ahmed" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default DeliveriesPage;

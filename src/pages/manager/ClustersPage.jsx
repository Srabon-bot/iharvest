import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { MapPin, Activity, Layers, Plus } from 'lucide-react';
import { getAllClusters } from '../../services/clusterService';
import { addDocument } from '../../firebase/firestore';
import { COLLECTIONS } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';

const ClustersPage = () => {
    const { addToast } = useToast();
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newCluster, setNewCluster] = useState({ name: '', capacity: 10000 });

    const load = async () => {
        setLoading(true);
        try {
            const data = await getAllClusters();
            if (data) setClusters(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleAddCluster = async () => {
        if (!newCluster.name) return;
        setSaving(true);
        try {
            await addDocument(COLLECTIONS.CLUSTERS, {
                name: newCluster.name,
                capacity: parseInt(newCluster.capacity, 10),
                activeFarms: 0,
                fsoCount: 0,
                status: 'optimal'
            });
            addToast({ message: 'Cluster created successfully!', type: 'success' });
            setIsAddOpen(false);
            setNewCluster({ name: '', capacity: 10000 });
            load();
        } catch (error) {
            addToast({ message: 'Failed to create cluster', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { 
            header: 'Capacity Usage', 
            accessor: 'capacity', 
            render: (_, row) => {
                const farms = row.activeFarms || 0;
                // mock conversion of farms to capacity used for demo: 1 farm = 1000 birds
                const used = farms * 1000;
                const percent = Math.min((used / row.capacity) * 100, 100) || 0;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '150px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{used.toLocaleString()} / {row.capacity.toLocaleString()}</span>
                            <span>{percent.toFixed(0)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: percent > 90 ? 'var(--danger)' : percent > 75 ? 'var(--warning)' : 'var(--primary)', borderRadius: '3px' }}></div>
                        </div>
                    </div>
                );
            } 
        },
        { header: 'Active Farms', accessor: 'activeFarms' },
        { header: 'Assigned FSOs', accessor: 'fsoCount' },
        { header: 'Status', accessor: 'status', render: (v) => <StatusBadge status={v} /> },
    ];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>Cluster Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Overview of all regional clusters and their operational status.</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
                    Create New Cluster
                </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <Card variant="stat" title="Total Clusters" value={String(clusters.length)} icon={MapPin} />
                <Card variant="stat" title="Total Farms" value={String(clusters.reduce((s, c) => s + (c.activeFarms || 0), 0))} icon={Layers} trend={{ value: 5, isPositive: true }} />
                <Card variant="stat" title="Optimal Clusters" value={String(clusters.filter(c => c.status === 'optimal').length)} icon={Activity} />
            </div>

            <Card title="Live Clusters Data">
                {loading ? <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>Loading clusters from database…</p>
                         : clusters.length > 0 ? <Table columns={columns} data={clusters} searchable />
                         : <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>No clusters found.</p>}
            </Card>

            <Modal
                isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}
                title="Create New Cluster" size="sm"
                footer={
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAddCluster} disabled={saving || !newCluster.name}>
                            {saving ? 'Creating…' : 'Create Cluster'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cluster Name</label>
                        <input type="text" value={newCluster.name} onChange={e => setNewCluster({...newCluster, name: e.target.value})} placeholder="e.g. South Valley Region" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Bird Capacity</label>
                        <input type="number" value={newCluster.capacity} onChange={e => setNewCluster({...newCluster, capacity: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default ClustersPage;

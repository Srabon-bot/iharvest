import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';
import Table from '../components/ui/Table';
import { PageLoader, Spinner } from '../components/ui/Loader';
import { Search, Mail, Lock, User, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const DesignSystemDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toastContext = useToast();
  
  const addToast = toastContext?.addToast || (() => alert('Toast provider not wrapped!'));

  const handleShowToast = (type) => {
    addToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: 'This is a sample toast notification message.',
    });
  };

  const handleLoadingButton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const tableColumns = [
    { key: 'id', label: 'ID', sortable: true, width: '100px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', render: (val) => (
      <span style={{ 
        padding: '4px 8px', 
        borderRadius: '99px', 
        fontSize: '12px',
        backgroundColor: val === 'Active' ? 'var(--primary-focus)' : 'var(--border)',
        color: val === 'Active' ? 'var(--primary)' : 'var(--text-secondary)'
      }}>
        {val}
      </span>
    )}
  ];

  const tableData = [
    { id: '1', name: 'John Doe', status: 'Active' },
    { id: '2', name: 'Jane Smith', status: 'Inactive' },
    { id: '3', name: 'Farm A', status: 'Active' },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--spacing-1)' }}>Design System</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Minimalist & Premium UI Components</p>
          </div>
          <Button onClick={() => document.body.classList.toggle('dark')}>Toggle Dark Mode</Button>
        </div>

        <section style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Buttons</h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button isLoading={isLoading} onClick={handleLoadingButton}>Loading State</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Inputs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
            <Input label="Standard Input" placeholder="Enter text..." />
            <Input label="With Icon" placeholder="Search..." icon={Search} />
            <Input label="Error State" placeholder="Email..." icon={Mail} error="Invalid email address" defaultValue="wrong-email" />
            <Input label="Password" type="password" icon={Lock} placeholder="Enter password" />
            <Input label="Disabled" disabled placeholder="Not editable" />
          </div>
        </section>

        <section style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Cards & Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
            <StatCard title="Total Revenue" value="$45,231" icon={TrendingUp} trend="up" trendValue="12%" />
            <StatCard title="Active Users" value="1,204" icon={User} trend="up" trendValue="5%" />
            <StatCard title="Pending Orders" value="43" trend="down" trendValue="2%" />
          </div>
          <Card>
            <CardHeader title="Standard Card" subtitle="Card subtitle description" action={<Button size="sm" variant="ghost">Action</Button>} />
            <CardContent>
              <p>This is a standard card component with a header, content area, and optional footer.</p>
            </CardContent>
          </Card>
        </section>

        <section style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Feedback & Overlays</h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', marginBottom: 'var(--spacing-4)' }}>
            <Button onClick={() => handleShowToast('success')} variant="secondary">Success Toast</Button>
            <Button onClick={() => handleShowToast('error')} variant="secondary">Error Toast</Button>
            <Button onClick={() => handleShowToast('warning')} variant="secondary">Warning Toast</Button>
            <Button onClick={() => handleShowToast('info')} variant="secondary">Info Toast</Button>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Sample Modal"
            footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={() => setIsModalOpen(false)}>Confirm</Button></>}
          >
            <p>This is a modal dialog. It traps focus and prevents background scrolling.</p>
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <Input label="Name" placeholder="Enter your name" />
            </div>
          </Modal>
        </section>

        <section style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Data Table</h2>
          <Table columns={tableColumns} data={tableData} sortColumn="name" sortDirection="asc" />
        </section>
        
        <section style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Loaders</h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
            <Spinner />
            <Spinner size={32} />
            <div style={{ width: '200px', height: '100px' }} className="skeleton" />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DesignSystemDemo;

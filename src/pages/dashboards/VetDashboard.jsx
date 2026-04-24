import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { Syringe, Cross, Calendar, ClipboardList } from 'lucide-react';

const VetDashboard = () => {
  const healthRequests = [
    { id: 'REQ-01', farmer: 'Jane Smith', batch: 'BCH-102', issue: 'Reduced feeding', status: 'Pending', date: '2026-04-24' },
    { id: 'REQ-02', farmer: 'Tom Brown', batch: 'COW-05', issue: 'Limping', status: 'In Progress', date: '2026-04-23' },
  ];

  const columns = [
    { header: 'Request ID', accessor: 'id' },
    { header: 'Farmer', accessor: 'farmer' },
    { header: 'Batch/Animal', accessor: 'batch' },
    { header: 'Issue', accessor: 'issue' },
    { header: 'Status', accessor: 'status' },
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Veterinary Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage health requests, vaccinations, and field visits.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Pending Requests" value="12" icon={ClipboardList} trend={{ value: 2, isPositive: false }} />
        <Card variant="stat" title="Scheduled Visits" value="5" icon={Calendar} />
        <Card variant="stat" title="Vaccinations Due" value="8" icon={Syringe} trend={{ value: -3, isPositive: true }} />
        <Card variant="stat" title="Cases Resolved" value="142" icon={Cross} trend={{ value: 15, isPositive: true }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Recent Health Requests" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={healthRequests} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VetDashboard;

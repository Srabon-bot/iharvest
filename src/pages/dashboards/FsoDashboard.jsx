import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { Map, ClipboardCheck, Users, AlertCircle } from 'lucide-react';

const FsoDashboard = () => {
  const surveys = [
    { id: 'SRV-001', farmer: 'Ali Khan', type: 'Initial Assessment', status: 'Pending Approval', date: '2026-04-20' },
    { id: 'SRV-002', farmer: 'Sarah Connor', type: 'Mid-Cycle Check', status: 'Completed', date: '2026-04-22' },
  ];

  const columns = [
    { header: 'Survey ID', accessor: 'id' },
    { header: 'Farmer', accessor: 'farmer' },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: 'status' },
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Field Support Officer (FSO)
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your assigned farmers, conduct surveys, and track cluster health.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <Card variant="stat" title="Assigned Farmers" value="45" icon={Users} />
        <Card variant="stat" title="Pending Surveys" value="8" icon={ClipboardCheck} trend={{ value: 2, isPositive: false }} />
        <Card variant="stat" title="Active Clusters" value="3" icon={Map} />
        <Card variant="stat" title="Issues Reported" value="4" icon={AlertCircle} trend={{ value: -1, isPositive: true }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-lg)'
      }}>
        <Card title="Recent Surveys" style={{ padding: 'var(--spacing-lg)' }}>
          <Table columns={columns} data={surveys} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FsoDashboard;

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { Map, ClipboardCheck, Users, AlertCircle } from 'lucide-react';
import { getSurveysByFso } from '../../services/surveyService';
import { useAuth } from '../../hooks/useAuth';

const FsoDashboard = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getSurveysByFso(user?.uid);
        if (data && data.length > 0) setSurveys(data);
      } catch (error) {
        console.error('Failed to fetch surveys:', error);
      }
    };
    if (user?.uid) fetchSurveys();
  }, [user]);

  const pendingCount = surveys.filter(s => s.healthStatus === 'sick' || s.healthStatus === 'critical').length;

  const columns = [
    { header: 'Survey ID', accessor: 'id' },
    { header: 'Farmer', accessor: 'farmerId' },
    { header: 'Health', accessor: 'healthStatus', render: (v) => <StatusBadge status={v} /> },
    { header: 'Date', accessor: 'createdAt', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          Field Support Officer (FSO)
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your assigned farmers, conduct surveys, and track cluster health.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Assigned Farmers" value="45" icon={Users} />
        <Card variant="stat" title="Total Surveys" value={String(surveys.length)} icon={ClipboardCheck} />
        <Card variant="stat" title="Active Clusters" value="3" icon={Map} />
        <Card variant="stat" title="Alerts" value={String(pendingCount)} icon={AlertCircle} trend={{ value: pendingCount, isPositive: false }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Recent Surveys">
          <Table columns={columns} data={surveys} searchable pageSize={5} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FsoDashboard;

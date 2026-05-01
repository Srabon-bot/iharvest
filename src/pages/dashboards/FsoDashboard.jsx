import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Map, ClipboardCheck, Users, AlertCircle, FileText } from 'lucide-react';
import { getSurveysByFso } from '../../services/surveyService';
import { getApplicationsForFso, updateApplication, APPLICATION_STATUS } from '../../services/applicationService';
import { getAllClusters } from '../../services/clusterService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';

const FsoDashboard = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeClusters, setActiveClusters] = useState(0);
  
  // Survey Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [surveyNotes, setSurveyNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surveyData, appData, clustersData] = await Promise.all([
          getSurveysByFso(user?.uid),
          getApplicationsForFso(),
          getAllClusters()
        ]);
        if (surveyData && surveyData.length > 0) setSurveys(surveyData);
        if (appData && appData.length > 0) setApplications(appData);
        if (clustersData) setActiveClusters(clustersData.length);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    if (user?.uid) fetchData();
  }, [user]);

  const handleSurveySubmit = async () => {
    if (!surveyNotes.trim()) {
      addToast({ message: 'Survey notes are required', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await updateApplication(selectedApp.id, {
        status: APPLICATION_STATUS.SURVEYED,
        surveyReport: surveyNotes,
        fsoId: user.uid,
        surveyDate: new Date().toISOString()
      });
      
      addToast({ message: 'Survey report submitted successfully', type: 'success' });
      setApplications(apps => apps.filter(a => a.id !== selectedApp.id));
      setIsModalOpen(false);
      setSelectedApp(null);
      setSurveyNotes('');
    } catch (error) {
      addToast({ message: error.message || 'Failed to submit survey', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const openSurveyModal = (app) => {
    setSelectedApp(app);
    setSurveyNotes('');
    setIsModalOpen(true);
  };

  const handleRequestDetails = async (app) => {
    try {
      await updateApplication(app.id, { status: APPLICATION_STATUS.DETAILS_REQUESTED });
      addToast({ message: 'Requested details successfully (Simulated Email Sent)', type: 'success' });
      setApplications(apps => apps.map(a => a.id === app.id ? { ...a, status: APPLICATION_STATUS.DETAILS_REQUESTED } : a));
    } catch (error) {
      addToast({ message: 'Failed to request details', type: 'error' });
    }
  };

  const handleScheduleVisit = async (app) => {
    try {
      await updateApplication(app.id, { status: APPLICATION_STATUS.VISIT_SCHEDULED });
      addToast({ message: 'Visit scheduled successfully (Simulated Calendar Event)', type: 'success' });
      setApplications(apps => apps.map(a => a.id === app.id ? { ...a, status: APPLICATION_STATUS.VISIT_SCHEDULED } : a));
    } catch (error) {
      addToast({ message: 'Failed to schedule visit', type: 'error' });
    }
  };

  const pendingCount = surveys.filter(s => s.healthStatus === 'sick' || s.healthStatus === 'critical').length;

  const appColumns = [
    { header: 'Applicant', accessor: 'name' },
    { header: 'Location', accessor: 'location' },
    { header: 'Farm Size', accessor: 'farmSize' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Date', accessor: 'createdAt', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    {
      header: 'Actions', accessor: 'id',
      render: (_, row) => {
        if (row.status === APPLICATION_STATUS.PENDING) {
          return (
            <Button size="sm" variant="secondary" onClick={() => handleRequestDetails(row)}>
              Request Details
            </Button>
          );
        }
        if (row.status === APPLICATION_STATUS.DETAILS_REQUESTED) {
          return (
            <Button size="sm" variant="secondary" onClick={() => handleScheduleVisit(row)}>
              Schedule Visit
            </Button>
          );
        }
        return (
          <Button size="sm" variant="primary" onClick={() => openSurveyModal(row)}>
            Submit Survey
          </Button>
        );
      },
    },
  ];

  const surveyColumns = [
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
        <p style={{ color: 'var(--text-secondary)' }}>Manage your assigned farmers, conduct surveys, and review applications.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <Card variant="stat" title="Pending Applications" value={String(applications.length)} icon={FileText} trend={{ value: applications.length, isPositive: true }} />
        <Card variant="stat" title="Total Surveys" value={String(surveys.length)} icon={ClipboardCheck} />
        <Card variant="stat" title="Active Clusters" value={String(activeClusters)} icon={Map} />
        <Card variant="stat" title="Alerts" value={String(pendingCount)} icon={AlertCircle} trend={{ value: pendingCount, isPositive: false }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <Card title="Pending Farmer Applications">
          <Table columns={appColumns} data={applications} searchable pageSize={5} />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        <Card title="Recent Routine Surveys">
          <Table columns={surveyColumns} data={surveys} searchable pageSize={5} />
        </Card>
      </div>

      {/* Survey Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Survey Report: ${selectedApp?.name}`}
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSurveySubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Enter the details of your physical survey for this applicant's farm at <strong>{selectedApp?.location}</strong>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Survey Notes & Recommendation</label>
            <textarea
              style={{ width: '100%', minHeight: '120px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              placeholder="Describe the farm conditions, biosecurity, capacity verification, and your recommendation..."
              value={surveyNotes}
              onChange={(e) => setSurveyNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default FsoDashboard;

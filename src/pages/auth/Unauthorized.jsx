import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: 'var(--spacing-md)'
    }}>
      <Card style={{
        maxWidth: '400px',
        textAlign: 'center',
        padding: 'var(--spacing-2xl) var(--spacing-xl)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--error-color)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <ShieldAlert size={40} />
        </div>
        <h1 style={{
          fontSize: '1.75rem',
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-sm)'
        }}>Access Denied</h1>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: 'var(--spacing-xl)',
          lineHeight: '1.6'
        }}>
          You do not have permission to view this page. If you believe this is a mistake, please contact your administrator.
        </p>
        <Button 
          variant="primary" 
          icon={ArrowLeft} 
          onClick={() => navigate('/')}
          fullWidth
        >
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default Unauthorized;

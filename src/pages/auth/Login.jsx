import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../services/authService';
import { submitApplication } from '../../services/applicationService';
import { ROLE_DASHBOARD, ROLES } from '../../utils/constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { Mail, Lock, LogIn, UserPlus, Tractor, User, MapPin, Phone } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', 'apply'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Farmer Application specifics
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ message: 'Please enter both email and password', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const profile = await loginUser(email, password);
      addToast({ message: `Welcome back, ${profile.name || profile.email}!`, type: 'success' });
      const dashboardPath = ROLE_DASHBOARD[profile.role] || '/unauthorized';
      navigate(dashboardPath, { replace: true });
    } catch (error) {
      addToast({ message: error.message || 'Failed to login', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Default all public signups to INVESTOR
      const profile = await registerUser(email, password, name, ROLES.INVESTOR);
      addToast({ message: `Account created successfully! Welcome, ${profile.name}`, type: 'success' });
      navigate(ROLE_DASHBOARD[ROLES.INVESTOR], { replace: true });
    } catch (error) {
      addToast({ message: error.message || 'Failed to register', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!name || !phone || !location || !farmSize) {
      addToast({ message: 'Please fill in all application fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await submitApplication({ name, phone, location, farmSize });
      addToast({ message: 'Application submitted successfully! Our FSO will contact you soon.', type: 'success' });
      // Reset form
      setName('');
      setPhone('');
      setLocation('');
      setFarmSize('');
      setActiveTab('login');
    } catch (error) {
      addToast({ message: error.message || 'Failed to submit application', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveTab('login');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo-icon">iH</div>
        <h1>iHarvest</h1>
        <p>Premium Contract Farming</p>
      </div>

      <Card className="login-card">
        <div className="auth-tabs" style={{ display: 'flex', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: activeTab === 'login' ? '2px solid var(--primary-color)' : 'none', fontWeight: activeTab === 'login' ? 'bold' : 'normal', color: activeTab === 'login' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: activeTab === 'register' ? '2px solid var(--primary-color)' : 'none', fontWeight: activeTab === 'register' ? 'bold' : 'normal', color: activeTab === 'register' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
          >
            Investor Signup
          </button>
          <button 
            className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveTab('apply')}
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: activeTab === 'apply' ? '2px solid var(--primary-color)' : 'none', fontWeight: activeTab === 'apply' ? 'bold' : 'normal', color: activeTab === 'apply' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
          >
            Apply as Farmer
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              disabled={loading}
            />
            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={LogIn}>
              Sign In
            </Button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="login-form">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              disabled={loading}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              disabled={loading}
            />
            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={UserPlus}>
              Create Investor Account
            </Button>
            <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              By registering, you agree to our terms of service as an Investor.
            </p>
          </form>
        )}

        {activeTab === 'apply' && (
          <form onSubmit={handleApply} className="login-form">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              disabled={loading}
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              disabled={loading}
            />
            <Input
              type="text"
              placeholder="Farm Location (e.g. Gazipur)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={MapPin}
              disabled={loading}
            />
            <Input
              type="text"
              placeholder="Farm Capacity / Size"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              icon={Tractor}
              disabled={loading}
            />
            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={Tractor}>
              Submit Application
            </Button>
            <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Our Field Officer will review your application and contact you for an inspection.
            </p>
          </form>
        )}

        {activeTab === 'login' && (
          <div className="demo-credentials" style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Demo Credentials:</p>
            <div className="demo-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              <Button size="sm" variant="outline" onClick={() => setDemoCredentials('admin@iharvest.com', 'admin123')}>Admin</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoCredentials('farmer@iharvest.com', 'farmer123')}>Farmer</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoCredentials('investor@iharvest.com', 'investor123')}>Investor</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoCredentials('vet@iharvest.com', 'vet123')}>Vet</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoCredentials('fso@iharvest.com', 'fso123')}>FSO</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoCredentials('manager@iharvest.com', 'manager123')}>Manager</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;

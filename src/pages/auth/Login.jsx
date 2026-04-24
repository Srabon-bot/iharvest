import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { ROLE_DASHBOARD } from '../../utils/constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      
      // Navigate to the correct dashboard based on role
      const dashboardPath = ROLE_DASHBOARD[profile.role] || '/unauthorized';
      navigate(dashboardPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      addToast({ message: error.message || 'Failed to login', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo-icon">iH</div>
        <h1>iHarvest</h1>
        <p>Premium Contract Farming</p>
      </div>
      
      <Card className="login-card">
        <h2 className="login-title">Sign In</h2>
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
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            icon={LogIn}
          >
            Sign In
          </Button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <div className="demo-buttons">
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('admin@iharvest.com', 'admin123')}>Admin</Button>
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('farmer@iharvest.com', 'farmer123')}>Farmer</Button>
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('investor@iharvest.com', 'investor123')}>Investor</Button>
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('vet@iharvest.com', 'vet123')}>Vet</Button>
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('fso@iharvest.com', 'fso123')}>FSO</Button>
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('manager@iharvest.com', 'manager123')}>Manager</Button>
            <Button size="sm" variant="outline" onClick={() => setDemoCredentials('fund@iharvest.com', 'fund123')}>Fund Mgr</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;

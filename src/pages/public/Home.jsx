import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLE_DASHBOARD } from '../../utils/constants.js';
import Button from '../../components/ui/Button.jsx';
import { Sprout, Users, ShieldCheck, LineChart, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleActionClick = () => {
    if (user && role) {
      const dashboardRoute = ROLE_DASHBOARD[role];
      if (dashboardRoute) {
        navigate(dashboardRoute);
      } else {
        navigate('/unauthorized');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="home-logo">
          <div className="home-logo-icon">iH</div>
          <span>iHarvest</span>
        </div>
        <div className="home-nav-links">
          {user ? (
            <Button variant="primary" onClick={handleActionClick}>
              Go to Dashboard
            </Button>
          ) : (
            <Button variant="primary" onClick={handleActionClick}>
              Login
            </Button>
          )}
        </div>
      </nav>

      <main className="home-main">
        <section className="home-hero">
          <h1 className="home-hero-title">
            Empowering Agriculture through <span>Smart Investment</span>
          </h1>
          <p className="home-hero-subtitle">
            iHarvest connects forward-thinking investors with hardworking farmers, bridging the gap between capital and agriculture. Track your livestock, manage farm operations, and watch your investments grow.
          </p>
          <div className="home-hero-actions">
            <Button variant="primary" size="lg" onClick={handleActionClick}>
              {user ? 'Access Dashboard' : 'Get Started'} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Button>
          </div>
        </section>

        <section className="home-about" id="about">
          <h2 className="home-about-title">Why iHarvest?</h2>
          <div className="home-features">
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Sprout size={24} />
              </div>
              <h3 className="home-feature-title">For Farmers</h3>
              <p className="home-feature-text">
                Access the capital you need to scale your livestock operations. Manage tasks, track animal health, and grow your farm with our intuitive dashboard.
              </p>
            </div>
            
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <LineChart size={24} />
              </div>
              <h3 className="home-feature-title">For Investors</h3>
              <p className="home-feature-text">
                Diversify your portfolio with tangible agricultural assets. Monitor your investments in real-time and earn returns as livestock matures.
              </p>
            </div>
            
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Users size={24} />
              </div>
              <h3 className="home-feature-title">Field Support & Vets</h3>
              <p className="home-feature-text">
                Dedicated professionals ensuring the health and success of every farm. From regular surveys to medical care, our network supports the entire ecosystem.
              </p>
            </div>
            
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <ShieldCheck size={24} />
              </div>
              <h3 className="home-feature-title">Secure & Transparent</h3>
              <p className="home-feature-text">
                Every transaction and animal update is recorded securely. We prioritize transparency so you always know where your investment stands.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} iHarvest Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

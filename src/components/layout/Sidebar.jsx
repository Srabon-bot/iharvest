import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Tractor, LayoutDashboard, Settings, FileText, PieChart, Activity, Map, Truck, ClipboardCheck, Briefcase, Syringe } from 'lucide-react';
import './Sidebar.css';
import { ROLES, ROLE_DASHBOARD } from '../../utils/constants';

const ROLE_NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: ROLE_DASHBOARD[ROLES.ADMIN], icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Farms', path: '/admin/farms', icon: Tractor },
    { name: 'Investments', path: '/admin/investments', icon: PieChart },
  ],
  [ROLES.FARMER]: [
    { name: 'Dashboard', path: ROLE_DASHBOARD[ROLES.FARMER], icon: LayoutDashboard },
    { name: 'Livestock', path: '/farmer/livestock', icon: Activity },
    { name: 'Tasks', path: '/farmer/tasks', icon: FileText },
  ],
  [ROLES.INVESTOR]: [
    { name: 'Portfolio', path: ROLE_DASHBOARD[ROLES.INVESTOR], icon: Briefcase },
    { name: 'Investments', path: '/investor/investments', icon: PieChart },
    { name: 'Transactions', path: '/investor/transactions', icon: FileText },
  ],
  [ROLES.VET]: [
    { name: 'Dashboard', path: ROLE_DASHBOARD[ROLES.VET], icon: LayoutDashboard },
    { name: 'Requests', path: '/vet/requests', icon: Syringe },
    { name: 'Reports', path: '/vet/reports', icon: FileText },
  ],
  [ROLES.FSO]: [
    { name: 'Dashboard', path: ROLE_DASHBOARD[ROLES.FSO], icon: LayoutDashboard },
    { name: 'Surveys', path: '/fso/surveys', icon: ClipboardCheck },
    { name: 'Farmers', path: '/fso/farmers', icon: Users },
  ],
  [ROLES.CLUSTER_MANAGER]: [
    { name: 'Dashboard', path: ROLE_DASHBOARD[ROLES.CLUSTER_MANAGER], icon: LayoutDashboard },
    { name: 'Clusters', path: '/manager/clusters', icon: Map },
    { name: 'Deliveries', path: '/manager/deliveries', icon: Truck },
  ],
  [ROLES.FUND_MANAGER]: [
    { name: 'Dashboard', path: ROLE_DASHBOARD[ROLES.FUND_MANAGER], icon: LayoutDashboard },
  ],
};

const Sidebar = ({ isCollapsed, toggleSidebar, role = ROLES.ADMIN, isMobileOpen, onMobileClose }) => {
  const navItems = ROLE_NAV_ITEMS[role] || [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard }
  ];

  // Build className
  const sidebarClass = [
    'sidebar',
    isCollapsed ? 'collapsed' : '',
    isMobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">iH</div>
          {(!isCollapsed || isMobileOpen) && <span className="logo-text">iHarvest</span>}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed && !isMobileOpen ? item.name : ''}
            onClick={onMobileClose}
          >
            <item.icon className="nav-icon" size={20} />
            {(!isCollapsed || isMobileOpen) && <span className="nav-text">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        {(!isCollapsed || isMobileOpen) && (
          <div className="user-role-badge">
            Role: {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

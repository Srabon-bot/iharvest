import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', noPadding = false, onClick, variant, title, value, icon, trend, style }) => {
  if (variant === 'stat') {
    return <StatCard title={title} value={value} icon={icon} trend={trend} className={className} style={style} />;
  }

  const paddingClass = noPadding ? 'card-no-padding' : '';
  const clickableClass = onClick ? 'card-clickable' : '';
  
  return (
    <div 
      className={`card ${paddingClass} ${clickableClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {title && <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>}
      {children}
    </div>
  );
};

export const CardHeader = ({ children, title, subtitle, action, className = '' }) => {
  return (
    <div className={`card-header ${className}`}>
      <div className="card-header-content">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="card-action">{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, className = '', style }) => {
  // Map my new trend format { value: 12, isPositive: true } to the old one or just render it directly
  let trendIcon = '';
  let trendClass = '';
  let trendText = '';
  
  if (trend) {
    if (typeof trend === 'object') {
      trendIcon = trend.isPositive ? '↑' : trend.isPositive === false ? '↓' : '→';
      trendClass = trend.isPositive ? 'trend-up' : trend.isPositive === false ? 'trend-down' : 'trend-flat';
      // Only show label if explicitly provided — never auto-format raw numbers as %
      trendText = trend.label || '';
    } else {
      trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
      trendClass = `trend-${trend}`;
      trendText = '';
    }
  }

  return (
    <div className={`card stat-card ${className}`} style={style}>
      <div className="stat-card-header">
        <h4 className="stat-card-title">{title}</h4>
        {Icon && <div className="stat-card-icon"><Icon size={20} /></div>}
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {trend && (
          <div className={`stat-card-trend ${trendClass}`}>
            {trendIcon} {trendText}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrap stat-icon-${color}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

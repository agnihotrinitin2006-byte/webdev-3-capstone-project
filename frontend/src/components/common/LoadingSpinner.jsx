import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
        {text}
      </p>
    </div>
  );
}

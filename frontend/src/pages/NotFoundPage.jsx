import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Building2 size={40} />
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '16px 0 8px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 28px' }}>
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <Home size={18} /> Back to Homepage
      </Link>
    </div>
  );
}

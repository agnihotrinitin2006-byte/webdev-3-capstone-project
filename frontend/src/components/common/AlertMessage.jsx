import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function AlertMessage({ type = 'danger', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      {type === 'danger' && <AlertCircle size={20} />}
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'info' && <Info size={20} />}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

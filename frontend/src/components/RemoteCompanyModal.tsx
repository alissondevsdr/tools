import React, { useEffect, useState, memo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Monitor,
  AlertCircle,
} from 'lucide-react';
import { createRemoteCompany, updateRemoteCompany } from '../services/api';

interface Props {
  company?: any;
  onClose: () => void;
  onSave: () => void;
}

interface FieldProps {
  label: string;
  icon?: any;
  children: React.ReactNode;
  hint?: string;
}

const Field = memo(
  ({ label, icon: Icon, children, hint }: FieldProps) => (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
        style={{ color: '#cccccc' }}
      >
        {Icon && <Icon size={11} style={{ color: '#ed0c00' }} />}
        {label}
      </label>

      {children}

      {hint && (
        <span className="text-xs" style={{ color: '#aaaaaa' }}>
          {hint}
        </span>
      )}
    </div>
  )
);

const RemoteCompanyModal: React.FC<Props> = ({
  company,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  useEffect(() => {
    if (company) {
      setName(company.name);
    } else {
      setName('');
    }
    setError('');
  }, [company]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Nome da empresa é obrigatório');
      return;
    }

    setSaving(true);
    try {
      if (company && company.id) {
        await updateRemoteCompany(company.id, name.trim());
      } else {
        await createRemoteCompany(name.trim());
      }
      onSave();
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.5)' }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-lg overflow-hidden"
        style={{ background: '#000000', border: '1px solid #333333' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #333333' }}
        >
          <h3 className="text-lg font-bold text-white">
            {company && company.id ? 'Editar Empresa' : 'Nova Empresa'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ color: '#666666' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg text-xs"
              style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)' }}
            >
              <AlertCircle size={14} style={{ color: '#ef4444', marginTop: 1, flexShrink: 0 }} />
              <span style={{ color: '#fca5a5' }}>{error}</span>
            </div>
          )}

          <Field label="Nome da Empresa" icon={Monitor}>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Digite o nome da empresa"
              className="field text-sm"
              autoFocus
            />
          </Field>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4"
          style={{ borderTop: '1px solid #333333' }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            className="btn btn-ghost flex-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex-1"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RemoteCompanyModal;

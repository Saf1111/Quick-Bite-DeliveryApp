import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bg =
    toast.type === 'error'
      ? 'bg-rose-900/90 border-rose-700 text-rose-100'
      : toast.type === 'info'
      ? 'bg-slate-900/90 border-slate-700 text-slate-100'
      : 'bg-emerald-900/90 border-emerald-700 text-emerald-100';

  const icon =
    toast.type === 'error' ? (
      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
    ) : toast.type === 'info' ? (
      <Info className="w-4 h-4 text-sky-400 shrink-0" />
    ) : (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    );

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md text-xs font-medium max-w-md ${bg}`}
      >
        {icon}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
}) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  // When isOpen becomes true → render first, then animate in
  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      // Small tick so the DOM element exists before we trigger the transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      // Animate out, then remove from DOM
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-300',
        visible ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          'bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-5 relative overflow-hidden',
          'transition-all duration-300 ease-out',
          visible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
        )}
      >

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              variant === 'danger'  && 'bg-red-50   text-red-600   border border-red-100',
              variant === 'warning' && 'bg-amber-50 text-amber-600 border border-amber-100',
              variant === 'info'    && 'bg-zinc-100 text-zinc-900  border border-zinc-200'
            )}
          >
            {(variant === 'danger' || variant === 'warning') && <AlertTriangle size={20} />}
            {variant === 'info' && <Info size={20} />}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-900 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50',
              variant === 'danger'  && 'bg-red-600  text-white hover:bg-red-700  shadow-red-500/20',
              variant === 'warning' && 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-500/20',
              variant === 'info'    && 'bg-zinc-900 text-white hover:bg-zinc-800'
            )}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}

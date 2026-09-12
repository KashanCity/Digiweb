import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'center' | 'right';
}

export function Modal({ open, onClose, title, children, side = 'center' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      <div
        className={
          side === 'right'
            ? 'relative mr-auto flex h-full w-full max-w-sm flex-col bg-surface-raised shadow-glass animate-fadeIn'
            : 'relative m-auto w-full max-w-lg rounded-2xl bg-surface-raised p-6 shadow-glass animate-fadeIn'
        }
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold text-ink">{title}</h3>}
          <button onClick={onClose} className="mr-auto flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-overlay hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className={side === 'right' ? 'flex-1 overflow-y-auto px-1' : ''}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

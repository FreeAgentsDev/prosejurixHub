import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-5xl">
        <div className="max-h-[90vh] overflow-hidden rounded-[30px] bg-gradient-to-br from-slate-200 via-white to-slate-100 p-[1px] shadow-2xl shadow-slate-900/25">
          <div className={`flex h-full max-h-[90vh] flex-col overflow-hidden rounded-[28px] bg-white/95 backdrop-blur ${className}`}>
            {title && (
              <div className="sticky top-0 z-10 bg-white/95 px-6 py-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;


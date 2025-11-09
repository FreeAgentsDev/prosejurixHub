import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'info' | 'success';
}

interface ConfirmDialogState extends Required<ConfirmOptions> {
  open: boolean;
  resolve: (value: boolean) => void;
}

interface ConfirmContextValue {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

const toneConfig = {
  danger: {
    icon: AlertTriangle,
    accent: 'bg-rose-500',
    button:
      'bg-rose-600 hover:bg-rose-500 text-white focus-visible:ring-rose-200',
    shadow: 'shadow-lg shadow-rose-900/20'
  },
  info: {
    icon: AlertTriangle,
    accent: 'bg-blue-500',
    button:
      'bg-blue-600 hover:bg-blue-500 text-white focus-visible:ring-blue-200',
    shadow: 'shadow-lg shadow-blue-900/15'
  },
  success: {
    icon: CheckCircle2,
    accent: 'bg-emerald-500',
    button:
      'bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:ring-emerald-200',
    shadow: 'shadow-lg shadow-emerald-900/15'
  }
} as const;

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<ConfirmDialogState | null>(null);

  const closeDialog = useCallback((result: boolean) => {
    setDialog((current) => {
      if (current) {
        current.resolve(result);
      }
      return null;
    });
  }, []);

  const confirm = useCallback(
    (options?: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setDialog({
          open: true,
          resolve,
          title: options?.title ?? '¿Estás seguro?',
          message:
            options?.message ??
            'Esta acción no se puede deshacer. Confirma si deseas continuar.',
          confirmText: options?.confirmText ?? 'Sí, continuar',
          cancelText: options?.cancelText ?? 'Cancelar',
          tone: options?.tone ?? 'danger'
        });
      }),
    []
  );

  const value = useMemo(() => ({ confirm }), [confirm]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeDialog(false);
      }
    },
    [closeDialog]
  );

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog?.open ? (
        <div
          className="fixed inset-0 z-[9998] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm px-4 pb-8 sm:items-center sm:px-6"
          onClick={handleOverlayClick}
        >
          <div
            className={`w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl transition-all ${toneConfig[dialog.tone].shadow}`}
          >
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-1.5 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="px-6 py-6 sm:px-8 sm:py-7">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white ${toneConfig[dialog.tone].accent}`}
                  >
                    {React.createElement(toneConfig[dialog.tone].icon, {
                      className: 'h-6 w-6'
                    })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {dialog.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{dialog.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => closeDialog(false)}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Cerrar diálogo de confirmación"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => closeDialog(false)}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 sm:w-auto"
                  >
                    {dialog.cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeDialog(true)}
                    className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 ${toneConfig[dialog.tone].button} sm:w-auto`}
                  >
                    {dialog.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextValue => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm debe usarse dentro de un ConfirmProvider');
  }
  return context;
};



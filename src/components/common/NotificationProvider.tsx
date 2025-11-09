import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationOptions {
  id?: string;
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface Notification extends Required<Omit<NotificationOptions, 'duration'>> {
  duration: number;
}

interface NotificationContextValue {
  notify: (options: NotificationOptions) => string;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const typeStyles: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; container: string; accent: string }
> = {
  info: {
    icon: Info,
    container: 'bg-blue-600/80 backdrop-blur border-blue-400/40',
    accent: 'bg-blue-400'
  },
  success: {
    icon: CheckCircle2,
    container: 'bg-emerald-600/80 backdrop-blur border-emerald-400/40',
    accent: 'bg-emerald-400'
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-amber-600/80 backdrop-blur border-amber-400/40',
    accent: 'bg-amber-400'
  },
  error: {
    icon: AlertCircle,
    container: 'bg-rose-600/80 backdrop-blur border-rose-400/40',
    accent: 'bg-rose-400'
  }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(
    ({ id, type = 'info', title, message, duration = 5000 }: NotificationOptions) => {
      const finalId = id ?? generateId();
      const notification: Notification = {
        id: finalId,
        type,
        title: title ?? '',
        message,
        duration
      };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        window.setTimeout(() => {
          dismiss(finalId);
        }, duration);
      }

      return finalId;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      notify,
      dismiss
    }),
    [notify, dismiss]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[9999] px-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {notifications.map((notification) => {
            const { icon: Icon, container, accent } = typeStyles[notification.type];
            return (
              <div
                key={notification.id}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border shadow-lg shadow-slate-900/20 transition-all`}
              >
                <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
                <div
                  className={`flex items-start gap-3 px-4 py-4 sm:px-5 sm:py-4 text-white ${container}`}
                >
                  <div className="mt-0.5">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1">
                    {notification.title ? (
                      <p className="text-sm font-semibold sm:text-base">{notification.title}</p>
                    ) : null}
                    <p className="text-xs sm:text-sm text-slate-100/90">{notification.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(notification.id)}
                    className="rounded-full p-1 text-slate-100/80 transition hover:bg-white/10 hover:text-white"
                    aria-label="Cerrar notificación"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de un NotificationProvider');
  }
  return context;
};



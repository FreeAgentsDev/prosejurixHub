import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

interface LoadingChecklistProps {
  items: ChecklistItem[];
  title?: string;
  subtitle?: string;
}

const LoadingChecklist = ({ items, title = 'Cargando datos...', subtitle }: LoadingChecklistProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex-shrink-0">
                {item.status === 'completed' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 animate-in fade-in zoom-in duration-300" />
                )}
                {item.status === 'loading' && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {item.status === 'pending' && (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
                {item.status === 'error' && (
                  <Circle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    item.status === 'completed'
                      ? 'text-green-700'
                      : item.status === 'loading'
                      ? 'text-blue-700'
                      : item.status === 'error'
                      ? 'text-red-700'
                      : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Por favor espera...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingChecklist;


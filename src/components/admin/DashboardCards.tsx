import React from 'react';
import { FileText, TrendingUp, Clock, CheckCircle, Eye } from 'lucide-react';

interface DashboardCardsProps {
  totalProcesos: number;
  procesosActivos: number;
  procesosEnNegociacion: number;
  procesosFinalizados?: number;
  procesosEnRevision?: number;
  onFinalizadosClick?: () => void;
}

const DashboardCards = ({
  totalProcesos,
  procesosActivos,
  procesosEnNegociacion,
  procesosFinalizados = 0,
  procesosEnRevision = 0,
  onFinalizadosClick
}: DashboardCardsProps) => {
  const cards = [
    {
      title: 'Total Procesos',
      value: totalProcesos,
      icon: FileText,
      gradient: 'from-sky-500 via-blue-500 to-indigo-500'
    },
    {
      title: 'Procesos Activos',
      value: procesosActivos,
      icon: Clock,
      gradient: 'from-amber-500 via-orange-500 to-rose-500'
    },
    {
      title: 'En Negociación',
      value: procesosEnNegociacion,
      icon: TrendingUp,
      gradient: 'from-fuchsia-500 via-purple-500 to-blue-600'
    },
    {
      title: 'En Revisión',
      value: procesosEnRevision,
      icon: Eye,
      gradient: 'from-lime-500 via-emerald-500 to-teal-500'
    },
    {
      title: 'Finalizados',
      value: procesosFinalizados,
      icon: CheckCircle,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      clickable: procesosFinalizados > 0 && !!onFinalizadosClick,
      onClick: onFinalizadosClick
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isClickable = (card as any).clickable;
        const handleClick = (card as any).onClick;
        
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl bg-white/70 p-1 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl ${
              isClickable ? 'cursor-pointer' : ''
            }`}
            onClick={(e) => {
              if (isClickable && handleClick) {
                e.preventDefault();
                e.stopPropagation();
                handleClick();
              }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (isClickable && handleClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            <div className={`relative flex h-full flex-col rounded-3xl bg-gradient-to-br ${card.gradient} p-5 text-white`}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl transition group-hover:scale-125" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">{card.title}</p>
                  <p className="mt-2 text-3xl font-semibold leading-none sm:text-4xl">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 shadow-inner backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                <span className="inline-flex h-1.5 w-12 rounded-full bg-white/40 transition-all group-hover:w-16" />
                Gestión Prosejurix
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;


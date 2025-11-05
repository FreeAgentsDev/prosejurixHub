import React from 'react';
import { Users, FileText, TrendingUp, Clock, CheckCircle, Eye, XCircle } from 'lucide-react';

interface DashboardCardsProps {
  totalClientes: number;
  totalProcesos: number;
  procesosActivos: number;
  procesosEnNegociacion: number;
  procesosFinalizados?: number;
  procesosEnRevision?: number;
}

const DashboardCards = ({
  totalClientes,
  totalProcesos,
  procesosActivos,
  procesosEnNegociacion,
  procesosFinalizados = 0,
  procesosEnRevision = 0
}: DashboardCardsProps) => {
  const cards = [
    {
      title: 'Total Procesos',
      value: totalProcesos,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Procesos Activos',
      value: procesosActivos,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'En Negociación',
      value: procesosEnNegociacion,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'En Revisión',
      value: procesosEnRevision,
      icon: Eye,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Finalizados',
      value: procesosFinalizados,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Clientes',
      value: totalClientes,
      icon: Users,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">{card.title}</p>
                <p className={`text-2xl sm:text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`${card.color} rounded-lg p-2 sm:p-3 flex-shrink-0`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;


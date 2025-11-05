import React from 'react';
import { Filter, X } from 'lucide-react';

interface ProcessFiltersProps {
  selectedEstado: string;
  onEstadoChange: (estado: string) => void;
  className?: string;
}

const estadosFiltro = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activos' },
  { value: 'en_espera', label: 'En Revisión' },
  { value: 'negociacion', label: 'En Negociación' },
  { value: 'finalizado', label: 'Finalizados' },
];

const ProcessFilters = ({ selectedEstado, onEstadoChange, className = '' }: ProcessFiltersProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Filter className="h-5 w-5 text-slate-400" />
      <select
        value={selectedEstado}
        onChange={(e) => onEstadoChange(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium text-slate-700"
      >
        {estadosFiltro.map((estado) => (
          <option key={estado.value} value={estado.value}>
            {estado.label}
          </option>
        ))}
      </select>
      {selectedEstado && (
        <button
          onClick={() => onEstadoChange('')}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Limpiar filtro"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      )}
    </div>
  );
};

export default ProcessFilters;


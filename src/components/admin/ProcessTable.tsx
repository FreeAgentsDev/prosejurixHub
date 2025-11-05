import React from 'react';
import { Edit, Trash2, Calendar, Eye, ExternalLink } from 'lucide-react';
import Table from '../common/Table';

interface Process {
  id: string | number;
  clienteId: number;
  clienteNombre: string;
  fechaIngreso: string;
  estadoInterno: string;
  estadoPublico: string;
  demandado: string;
  codigoAcceso: string;
}

interface ProcessTableProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onDelete: (id: string | number) => void;
  onView?: (process: Process) => void;
}

const ProcessTable = ({ processes, onEdit, onDelete, onView }: ProcessTableProps) => {
  const getStatusColor = (estadoInterno: string, estadoPublico: string) => {
    if (estadoInterno === 'activo' || estadoPublico.includes('investigación') || estadoInterno === 'investigacion') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (estadoInterno === 'finalizado' || estadoPublico.includes('Cerrado')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (estadoPublico.includes('negociación') || estadoInterno === 'negociacion' || estadoPublico.includes('negociacion')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (estadoInterno === 'en_espera' || estadoPublico.includes('revisión') || estadoPublico.includes('revision') || estadoPublico.includes('Evaluación')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  if (processes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500">No hay procesos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Proceso
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Demandado
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </Table.Header>
          <tbody className="bg-white divide-y divide-slate-200">
            {processes.map((proceso) => (
              <Table.Row key={proceso.id} className="hover:bg-slate-50">
                <Table.Cell>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{proceso.id}</div>
                    <div className="text-xs text-slate-500">Código: {proceso.codigoAcceso}</div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-slate-900">{proceso.clienteNombre}</div>
                  <div className="text-xs text-slate-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(proceso.fechaIngreso).toLocaleDateString('es-CO')}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(proceso.estadoInterno, proceso.estadoPublico)}`}>
                    {proceso.estadoPublico}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-sm text-slate-900 hidden sm:table-cell">
                  <div className="max-w-xs truncate" title={proceso.demandado}>
                    {proceso.demandado}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(proceso)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(proceso)}
                      className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(proceso.id)}
                      className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProcessTable;


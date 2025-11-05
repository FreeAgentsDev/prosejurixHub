import { Edit, Trash2, Phone, Eye } from 'lucide-react';
import Table from '../common/Table';

interface Process {
  id: string | number;
  clienteId?: number;
  clienteNombre?: string;
  fechaIngreso?: string;
  estadoInterno?: string;
  estadoPublico?: string;
  demandado?: string;
  codigoAcceso?: string;
  [key: string]: any; // Permitir campos adicionales de Supabase
}

interface ProcessTableProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onDelete: (id: string | number) => void;
  onView?: (process: Process) => void;
  procesosRaw?: any[]; // Datos crudos de Supabase
}

const ProcessTable = ({ processes, onEdit, onDelete, onView, procesosRaw }: ProcessTableProps) => {
  // Función helper para obtener valores de diferentes posibles nombres de columna
  const getValue = (obj: any, ...keys: string[]): any => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
    }
    return null;
  };

  // Usar datos crudos de Supabase si están disponibles
  const datosMostrar = procesosRaw && procesosRaw.length > 0 ? procesosRaw : processes;

  // Función para obtener el ID del proceso
  const obtenerId = (proceso: any): string | number => {
    return getValue(proceso, 'id', 'ID', 'Id', 'proceso_id', 'procesoId') || 'N/A';
  };

  // Función para obtener el nombre del cliente
  const obtenerNombre = (proceso: any): string => {
    return getValue(proceso, 'NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'NOMBRE_CLIENTE') || 'Sin nombre';
  };

  // Función para obtener el teléfono
  const obtenerTelefono = (proceso: any): string => {
    return getValue(proceso, 'telefono', 'Telefono', 'TELEFONO', 'telefono_fijo', 'celular', 'Celular', 'CELULAR') || 'Sin teléfono';
  };

  if (datosMostrar.length === 0) {
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
                ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </Table.Header>
          <tbody className="bg-white divide-y divide-slate-200">
            {datosMostrar.map((proceso, index) => {
              const idProceso = obtenerId(proceso);
              const nombreCliente = obtenerNombre(proceso);
              const telefono = obtenerTelefono(proceso);
              
              return (
                <Table.Row key={idProceso || index} className="hover:bg-slate-50">
                  <Table.Cell>
                    <div className="text-sm font-medium text-slate-900 font-mono">
                      {String(idProceso)}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-sm text-slate-900">
                      {nombreCliente}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-sm text-slate-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-slate-400" />
                      {telefono}
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
                        onClick={() => onDelete(idProceso)}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProcessTable;


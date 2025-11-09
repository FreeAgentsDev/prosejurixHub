import { Edit, Trash2, Phone, Eye, Calendar, UserCircle2 } from 'lucide-react';
import Table from '../common/Table';

interface Process {
  id: string | number;
  clienteId?: number;
  clienteNombre?: string;
  fechaIngreso?: string;
  estadoInterno?: string;
  estadoPublico?: string;
  demandado?: string;
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
    return getValue(proceso, 'ID', 'id', 'Id') || 'N/A';
  };

  // Función para obtener el nombre del cliente
  const obtenerNombre = (proceso: any): string => {
    return getValue(proceso, 'NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'NOMBRE_CLIENTE') || 'Sin nombre';
  };

  // Función para obtener el teléfono
  const obtenerTelefono = (proceso: any): string => {
    return getValue(proceso, 'telefono', 'Telefono', 'TELEFONO', 'telefono_fijo', 'celular', 'Celular', 'CELULAR') || 'Sin teléfono';
  };

  const obtenerEstadoPublico = (proceso: any): string => {
    return (
      getValue(
        proceso,
        'estado_publico',
        'Estado Público',
        'estadoPublico',
        'ESTADO_PUBLICO',
        'estado_para_cliente',
        'Estado Proceso',
        'estadoProceso'
      ) || 'Sin estado'
    );
  };

  const obtenerFechaIngreso = (proceso: any): string => {
    return (
      getValue(
        proceso,
        'fecha_ingreso',
        'fechaIngreso',
        'Fecha Ingreso',
        'Fecha de Ingreso',
        'created_at',
        'FECHA DE INGRESO'
      ) || '—'
    );
  };

  if (datosMostrar.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500">No hay procesos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/60 p-2 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="overflow-hidden rounded-3xl border border-white/60">
        <div className="overflow-x-auto">
          <Table className="bg-white/80">
            <Table.Header className="bg-gradient-to-r from-indigo-600 via-sky-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Acciones
                </th>
              </tr>
            </Table.Header>
            <tbody className="divide-y divide-slate-100/70">
              {datosMostrar.map((proceso, index) => {
                const idProceso = obtenerId(proceso);
                const nombreCliente = obtenerNombre(proceso);
                const telefono = obtenerTelefono(proceso);
                const estadoPublico = obtenerEstadoPublico(proceso);
                const fechaIngreso = obtenerFechaIngreso(proceso);

                return (
                  <Table.Row
                    key={idProceso || index}
                    className="group bg-white/80 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                  >
                    <Table.Cell className="align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 shadow-sm">
                          <UserCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{nombreCliente}</p>
                          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                            #{String(idProceso)}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="align-middle">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="rounded-full bg-slate-100 p-1.5 text-blue-500 shadow-inner">
                          <Phone className="h-4 w-4" />
                        </span>
                        {telefono}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="align-middle">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(proceso)}
                            className="rounded-full bg-white/80 p-2 text-sky-500 shadow-sm transition hover:bg-sky-50 hover:text-sky-700"
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(proceso)}
                          className="rounded-full bg-white/80 p-2 text-indigo-500 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-700"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(idProceso)}
                          className="rounded-full bg-white/80 p-2 text-rose-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-700"
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
    </div>
  );
};

export default ProcessTable;


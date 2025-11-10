import { Trash2, Phone, UserCircle2, BookOpen, Calendar, Tag } from 'lucide-react';
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
  onDelete: (id: string | number) => void;
  onView?: (process: Process) => void;
  procesosRaw?: any[]; // Datos crudos de Supabase
  onPortalView?: (payload: { raw?: any; normalized?: Process | null }) => void;
}

const ProcessTable = ({ processes, onDelete, onView, procesosRaw, onPortalView }: ProcessTableProps) => {
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

  const obtenerEstadoInterno = (proceso: any): string => {
    return (
      getValue(
        proceso,
        'estado',
        'Estado',
        'ESTADO',
        'estado_interno',
        'estadoInterno',
        'ESTADO_INTERNO'
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

  const obtenerDemandado = (proceso: any): string => {
    return getValue(proceso, 'demandado', 'Demandado', 'DEMANDADO') || 'Sin demandado';
  };

  const formatDate = (value: string | null | undefined) => {
    if (!value) return 'No especificada';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
      <div className="hidden overflow-hidden rounded-3xl border border-white/60 md:block">
        <Table className="bg-white/80">
          <Table.Header className="bg-gradient-to-r from-indigo-600 via-sky-500 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:px-6">
                Acciones
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:px-6">
                Cliente
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:px-6">
                Teléfono
              </th>
            </tr>
          </Table.Header>
          <tbody className="divide-y divide-slate-100/70">
            {datosMostrar.map((proceso, index) => {
              const idProceso = obtenerId(proceso);
              const nombreCliente = obtenerNombre(proceso);
              const telefono = obtenerTelefono(proceso);
              const rawRegistro =
                procesosRaw && procesosRaw.length > 0
                  ? procesosRaw.find((item) => obtenerId(item) === idProceso)
                  : datosMostrar === procesosRaw
                  ? proceso
                  : undefined;
              const normalizedRegistro =
                processes.find((item) => String(item.id) === String(idProceso)) ||
                (datosMostrar === processes ? (proceso as Process) : null);

              return (
                <Table.Row
                  key={idProceso || index}
                  className="group bg-white/80 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                >
                  <Table.Cell className="align-middle px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onPortalView?.({
                            raw: rawRegistro,
                            normalized: normalizedRegistro ?? null
                          })
                        }
                        className="rounded-full bg-white/80 p-2 text-blue-500 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                        title="Ver portal del cliente"
                        type="button"
                      >
                        <BookOpen className="h-4 w-4" />
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
                  <Table.Cell className="align-middle px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => onView?.(proceso)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-1 py-1 text-left transition ${
                        onView
                          ? 'cursor-pointer hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'
                          : ''
                      }`}
                      aria-label={onView ? `Ver detalles de ${nombreCliente}` : undefined}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 shadow-sm">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p
                          className={`font-semibold text-slate-800 ${
                            onView ? 'underline decoration-transparent hover:decoration-sky-400' : ''
                          }`}
                        >
                          {nombreCliente}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                          #{String(idProceso)}
                        </p>
                      </div>
                    </button>
                  </Table.Cell>
                  <Table.Cell className="align-middle px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="rounded-full bg-slate-100 p-1.5 text-blue-500 shadow-inner">
                        <Phone className="h-4 w-4" />
                      </span>
                      {telefono}
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {datosMostrar.map((proceso, index) => {
          const idProceso = obtenerId(proceso);
          const nombreCliente = obtenerNombre(proceso);
          const telefono = obtenerTelefono(proceso);
          const estadoPublico = obtenerEstadoPublico(proceso);
          const estadoInterno = obtenerEstadoInterno(proceso);
          const fechaIngreso = obtenerFechaIngreso(proceso);
          const demandado = obtenerDemandado(proceso);
          const rawRegistro =
            procesosRaw && procesosRaw.length > 0
              ? procesosRaw.find((item) => obtenerId(item) === idProceso)
              : datosMostrar === procesosRaw
              ? proceso
              : undefined;
          const normalizedRegistro =
            processes.find((item) => String(item.id) === String(idProceso)) ||
            (datosMostrar === processes ? (proceso as Process) : null);

          return (
            <div
              key={idProceso || index}
              className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm shadow-slate-900/5 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onView?.(proceso)}
                  className={`min-w-0 text-left ${
                    onView ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500' : ''
                  }`}
                  aria-label={onView ? `Ver detalles de ${nombreCliente}` : undefined}
                >
                  <p className="text-base font-semibold text-slate-900">{nombreCliente}</p>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                    #{String(idProceso)}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() =>
                      onPortalView?.({
                        raw: rawRegistro,
                        normalized: normalizedRegistro ?? null
                      })
                    }
                    className="rounded-full bg-slate-100 p-2 text-blue-500 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                    title="Ver portal del cliente"
                    type="button"
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(idProceso)}
                    className="rounded-full bg-slate-100 p-2 text-rose-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-700"
                    title="Eliminar"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 p-1.5 text-blue-500 shadow-inner">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="truncate">{telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span className="rounded-full bg-slate-100 p-1.5 text-indigo-500 shadow-inner">
                    <Tag className="h-4 w-4" />
                  </span>
                  <span className="text-slate-700">Estado público:</span>
                  <span className="text-slate-900">{estadoPublico}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span className="rounded-full bg-slate-100 p-1.5 text-purple-500 shadow-inner">
                    <Tag className="h-4 w-4" />
                  </span>
                  <span className="text-slate-700">Estado interno:</span>
                  <span className="text-slate-900">{estadoInterno}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 p-1.5 text-emerald-500 shadow-inner">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ingreso:
                  </span>
                  <span className="text-sm text-slate-900">{formatDate(fechaIngreso)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="rounded-full bg-slate-100 p-1.5 text-sky-500 shadow-inner">
                    <UserCircle2 className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Demandado
                    <p className="mt-1 text-sm font-normal normal-case tracking-normal text-slate-900">
                      {demandado}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessTable;


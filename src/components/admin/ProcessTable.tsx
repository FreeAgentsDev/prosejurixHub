import { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { Trash2, Phone, UserCircle2, BookOpen, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import Table from '../common/Table';
import { getProcessBorderColor, getProcessChipColor } from '../../services/processColorService';
import { 
  getProcessId, 
  getClientName, 
  getPhone, 
  getPublicState, 
  getInternalState,
  getResponsibility,
  getInsurer,
  getFechaIngreso,
  getDemandado,
  formatDate,
} from '../../utils/dataHelpers';
import { PAGINATION, PROCESS_COLORS } from '../../utils/constants';

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

const ProcessTable = memo(({ processes, onDelete, onView, procesosRaw, onPortalView }: ProcessTableProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = PAGINATION.DEFAULT_ITEMS_PER_PAGE;

  // Usar datos crudos de Supabase si están disponibles
  const todosLosDatos = useMemo(() => {
    return procesosRaw && procesosRaw.length > 0 ? procesosRaw : processes;
  }, [procesosRaw, processes]);

  // Calcular paginación
  const totalPaginas = useMemo(() => {
    return Math.ceil(todosLosDatos.length / elementosPorPagina);
  }, [todosLosDatos.length, elementosPorPagina]);

  const inicioIndice = useMemo(() => {
    return (paginaActual - 1) * elementosPorPagina;
  }, [paginaActual, elementosPorPagina]);

  const finIndice = useMemo(() => {
    return inicioIndice + elementosPorPagina;
  }, [inicioIndice, elementosPorPagina]);

  const datosMostrar = useMemo(() => {
    return todosLosDatos.slice(inicioIndice, finIndice);
  }, [todosLosDatos, inicioIndice, finIndice]);

  // Resetear a página 1 cuando cambian los datos
  useEffect(() => {
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      setPaginaActual(1);
    }
  }, [todosLosDatos.length, totalPaginas, paginaActual]);

  // Callbacks memoizados para evitar re-renders innecesarios
  const handlePreviousPage = useCallback(() => {
    setPaginaActual(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPaginaActual(prev => Math.min(totalPaginas, prev + 1));
  }, [totalPaginas]);

  const handlePageChange = useCallback((pagina: number) => {
    setPaginaActual(pagina);
  }, []);

  if (todosLosDatos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500">No hay procesos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/60 p-2 shadow-xl shadow-slate-900/5 backdrop-blur">
      {/* Leyenda de colores */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Significado de los colores:</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-emerald-500 bg-emerald-50"></div>
            <span className="text-xs font-medium text-slate-700">Verde - Finalizados</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-red-500 bg-red-50"></div>
            <span className="text-xs font-medium text-slate-700">Rojo - Reparación directa / Contractual</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-pink-500 bg-pink-50"></div>
            <span className="text-xs font-medium text-slate-700">Rosado - Extra / Aseguradora</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-cyan-400 bg-cyan-50"></div>
            <span className="text-xs font-medium text-slate-700">Cian - Extra / Persona natural</span>
          </div>
        </div>
      </div>

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
              const idProceso = getProcessId(proceso);
              const nombreCliente = getClientName(proceso);
              const telefono = getPhone(proceso);
              const estadoInterno = getInternalState(proceso);
              const estadoPublico = getPublicState(proceso);
              const responsabilidad = getResponsibility(proceso);
              const aseguradora = getInsurer(proceso);
              
              // Usar estado interno primero, si no está disponible usar público
              const estadoParaColor = (estadoInterno && estadoInterno !== 'Sin estado') 
                ? estadoInterno 
                : (estadoPublico && estadoPublico !== 'Sin estado' ? estadoPublico : '');
              
              const colorBorde = getProcessBorderColor(estadoParaColor, responsabilidad, aseguradora);
              const chipColor = getProcessChipColor(estadoParaColor, responsabilidad, aseguradora);
              const rawRegistro =
                procesosRaw && procesosRaw.length > 0
                  ? procesosRaw.find((item) => getProcessId(item) === idProceso)
                  : datosMostrar === procesosRaw
                  ? proceso
                  : undefined;
              const normalizedRegistro =
                processes.find((item) => String(item.id) === String(idProceso)) ||
                (datosMostrar === processes ? (proceso as Process) : null);

              return (
                <Table.Row
                  key={idProceso || index}
                  className={`group bg-white/80 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg ${colorBorde}`}
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

      {/* Paginación con puntos y flechas */}
      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 px-4 py-3">
          {/* Flecha anterior */}
          <button
            onClick={handlePreviousPage}
            disabled={paginaActual === 1}
            className={`flex items-center justify-center rounded-full p-2 transition-all ${
              paginaActual === 1
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200 hover:text-blue-800 hover:shadow-md border border-blue-200'
            }`}
            aria-label="Página anterior"
            title="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Puntos de paginación */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                onClick={() => handlePageChange(pagina)}
                className={`h-2 rounded-full transition-all ${
                  pagina === paginaActual
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ir a la página ${pagina}`}
                title={`Página ${pagina}`}
              />
            ))}
          </div>

          {/* Flecha siguiente */}
          <button
            onClick={handleNextPage}
            disabled={paginaActual === totalPaginas}
            className={`flex items-center justify-center rounded-full p-2 transition-all ${
              paginaActual === totalPaginas
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200 hover:text-blue-800 hover:shadow-md border border-blue-200'
            }`}
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Leyenda de colores para móvil */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:hidden">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Significado de los colores:</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-emerald-500 bg-emerald-50"></div>
            <span className="text-xs font-medium text-slate-700">Verde - Finalizados</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-red-500 bg-red-50"></div>
            <span className="text-xs font-medium text-slate-700">Rojo - Reparación directa / Contractual</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-pink-500 bg-pink-50"></div>
            <span className="text-xs font-medium text-slate-700">Rosado - Extra / Aseguradora</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-l-4 border-cyan-400 bg-cyan-50"></div>
            <span className="text-xs font-medium text-slate-700">Cian - Extra / Persona natural</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {datosMostrar.map((proceso, index) => {
          const idProceso = getProcessId(proceso);
          const nombreCliente = getClientName(proceso);
          const telefono = getPhone(proceso);
          const estadoPublico = getPublicState(proceso);
          const estadoInterno = getInternalState(proceso);
          const responsabilidad = getResponsibility(proceso);
          const aseguradora = getInsurer(proceso);
          const rawRegistro =
            procesosRaw && procesosRaw.length > 0
              ? procesosRaw.find((item) => getProcessId(item) === idProceso)
              : datosMostrar === procesosRaw
              ? proceso
              : undefined;
          const normalizedRegistro =
            processes.find((item) => String(item.id) === String(idProceso)) ||
            (datosMostrar === processes ? (proceso as Process) : null);

          // Usar estado interno primero, si no está disponible usar público
          const estadoParaColor = (estadoInterno && estadoInterno !== 'Sin estado') 
            ? estadoInterno 
            : (estadoPublico && estadoPublico !== 'Sin estado' ? estadoPublico : '');
          
          const colorBorde = getProcessBorderColor(estadoParaColor, responsabilidad, aseguradora);
          const chipColor = getProcessChipColor(estadoParaColor, responsabilidad, aseguradora);

          return (
            <div
              key={idProceso || index}
              className={`rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm shadow-slate-900/5 backdrop-blur ${colorBorde}`}
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
                  <span className={getProcessChipColor(estadoPublico, responsabilidad, aseguradora)}>{estadoPublico}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span className="rounded-full bg-slate-100 p-1.5 text-purple-500 shadow-inner">
                    <Tag className="h-4 w-4" />
                  </span>
                  <span className="text-slate-700">Estado interno:</span>
                  <span className={getProcessChipColor(estadoInterno, responsabilidad, aseguradora)}>{estadoInterno}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 p-1.5 text-emerald-500 shadow-inner">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ingreso:
                  </span>
                  <span className="text-sm text-slate-900">{formatDate(getFechaIngreso(proceso))}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="rounded-full bg-slate-100 p-1.5 text-sky-500 shadow-inner">
                    <UserCircle2 className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Demandado
                    <p className="mt-1 text-sm font-normal normal-case tracking-normal text-slate-900">
                      {getDemandado(proceso)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación con puntos y flechas para móvil */}
      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 px-4 py-3 md:hidden">
          {/* Flecha anterior */}
          <button
            onClick={handlePreviousPage}
            disabled={paginaActual === 1}
            className={`flex items-center justify-center rounded-full p-2 transition-all ${
              paginaActual === 1
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200 hover:text-blue-800 hover:shadow-md border border-blue-200'
            }`}
            aria-label="Página anterior"
            title="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Puntos de paginación */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                onClick={() => handlePageChange(pagina)}
                className={`h-2 rounded-full transition-all ${
                  pagina === paginaActual
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ir a la página ${pagina}`}
                title={`Página ${pagina}`}
              />
            ))}
          </div>

          {/* Flecha siguiente */}
          <button
            onClick={handleNextPage}
            disabled={paginaActual === totalPaginas}
            className={`flex items-center justify-center rounded-full p-2 transition-all ${
              paginaActual === totalPaginas
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200 hover:text-blue-800 hover:shadow-md border border-blue-200'
            }`}
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
});

ProcessTable.displayName = 'ProcessTable';

export default ProcessTable;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, LogOut, UserCircle2, Calendar, BadgeCheck } from 'lucide-react';
import Table from '../common/Table';
import { useNotifications } from '../common/NotificationProvider';

interface Process {
  id: number | string;
  estado: string;
  observaciones: string;
  fechaIngreso: string;
  tipo: string;
  datosCompletos?: any;
}

interface ClientProcessViewProps {
  processes: Process[];
  clientName: string;
  clientCedula: string;
  onLogout: () => void;
  procesosRaw?: any[]; // Procesos originales de Supabase para pasar a la página de detalle
}

const ClientProcessView = ({ processes, clientName, clientCedula, onLogout, procesosRaw }: ClientProcessViewProps) => {
  const navigate = useNavigate();
  const { notify } = useNotifications();

  // Usar datos crudos de Supabase si están disponibles, sino usar processes
  const datosMostrar = procesosRaw && procesosRaw.length > 0 ? procesosRaw : processes;

  const getValue = (obj: any, ...keys: string[]): any => {
    for (const key of keys) {
      if (key && obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
    }
    return null;
  };

  const hasMeaningfulValue = React.useCallback(
    (key: string) => datosMostrar?.some((item) => item && item[key] !== undefined && item[key] !== null && item[key] !== ''),
    [datosMostrar]
  );

  const columnConfig = React.useMemo(() => {
    const taken = new Set<string>();
    const ensureUnique = (key: string | null) => {
      if (!key) return null;
      if (taken.has(key)) return null;
      taken.add(key);
      return key;
    };

    const preferKey = (candidates: string[]) => {
      for (const candidate of candidates) {
        const normalized = String(candidate);
        if (!taken.has(normalized) && hasMeaningfulValue(normalized)) {
          taken.add(normalized);
          return normalized;
        }
      }
      return null;
    };

    const dataset = Array.isArray(datosMostrar) ? datosMostrar : [];
    if (dataset.length === 0) {
      return {
        idKey: null as string | null,
        nameKey: null as string | null,
        cedulaKey: null as string | null,
        columns: [] as { key: string; label: string; className?: string; formatter?: (value: any) => React.ReactNode }[],
      };
    }

    const sampleKeys = Object.keys(dataset[0] ?? {});

    const idKey = preferKey(['ID', 'id', 'Id', 'id_proceso', 'procesoId', 'Proceso ID', 'ID Proceso']);
    const nameKey = preferKey(['NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'CLIENTE']);
    const cedulaKey = preferKey(['CEDULA', 'cedula', 'Cédula', 'Cedula', 'CÉDULA', 'nit', 'NIT']);

    const columns: { key: string; label: string; className?: string; formatter?: (value: any) => React.ReactNode }[] = [];

    if (idKey) {
      columns.push({
        key: idKey,
        label: 'ID',
        className: 'font-mono text-sm text-slate-600',
      });
    }

    if (nameKey) {
      columns.push({
        key: nameKey,
        label: 'Nombre',
        className: 'font-semibold text-slate-800',
      });
    }

    if (cedulaKey) {
      columns.push({
        key: cedulaKey,
        label: 'Cédula / NIT',
        className: 'text-slate-600',
      });
    }

    const reserved = new Set([idKey, nameKey, cedulaKey].filter(Boolean) as string[]);
    sampleKeys.forEach((key) => {
      if (columns.length >= 3) return;
      if (reserved.has(key)) return;
      if (!hasMeaningfulValue(key)) return;
      columns.push({ key, label: key.replace(/_/g, ' '), className: 'text-slate-600' });
      reserved.add(key);
    });

    return {
      idKey: idKey || null,
      nameKey: nameKey || null,
      cedulaKey: cedulaKey || null,
      columns,
    };
  }, [datosMostrar, hasMeaningfulValue]);

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return '—';
    if (value instanceof Date) return value.toLocaleDateString('es-CO');
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value;
    return JSON.stringify(value);
  };

  const totalProcesos = datosMostrar?.length ?? 0;
  const estadosUnicos = React.useMemo(() => {
    const unique = new Set<string>();
    (datosMostrar || []).forEach((proceso: any) => {
      const estado = getValue(
        proceso,
        'estado_publico',
        'Estado Público',
        'estadoPublico',
        'ESTADO_PUBLICO',
        'estado',
        'Estado'
      );
      if (estado) {
        unique.add(String(estado));
      }
    });
    return unique.size;
  }, [datosMostrar]);

  const fechaMasReciente = React.useMemo(() => {
    const fechas: Date[] = [];
    (datosMostrar || []).forEach((proceso: any) => {
      const fecha = getValue(
        proceso,
        'fecha_ingreso',
        'fechaIngreso',
        'Fecha Ingreso',
        'Fecha de Ingreso',
        'created_at',
        'FECHA DE INGRESO',
        'fecha'
      );
      if (fecha) {
        const parsed = new Date(fecha);
        if (!Number.isNaN(parsed.getTime())) {
          fechas.push(parsed);
        }
      }
    });
    if (fechas.length === 0) return null;
    fechas.sort((a, b) => b.getTime() - a.getTime());
    return fechas[0];
  }, [datosMostrar]);

  const handleViewDetails = (proceso: any) => {
    const procId =
      getValue(proceso, 'ID', 'id', 'Id', 'id_proceso', 'procesoId', 'Proceso ID', 'ID Proceso', columnConfig.idKey || '') ||
      null;

    if (!procId) {
      notify({
        type: 'error',
        title: 'No se pudo abrir el proceso',
        message: 'No encontramos el identificador de este proceso. Intenta nuevamente.'
      });
      return;
    }

    navigate(`/portal/proceso/${procId}`, {
      state: {
        procesos: procesosRaw || []
      }
    });
  };



  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(79,70,229,0.25),_transparent_45%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="rounded-3xl border border-white/30 bg-white/15 p-3 shadow-2xl shadow-blue-900/20 backdrop-blur">
                <img
                  src="/prosejurix-rounded.png"
                  alt="Prosejurix Logo"
                  className="h-14 w-14 rounded-2xl border border-white/40"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-blue-200/70">Portal del Cliente</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Gestión de tus Procesos
                </h1>
                <p className="mt-2 text-sm text-blue-100/80">
                  Bienvenido a tu panel personalizado{clientName ? `, ${clientName}` : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 backdrop-blur transition hover:bg-white/20"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative pb-16 sm:pb-20">
        <div className="mt-12 sm:mt-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold sm:text-3xl">Bienvenido, {clientName}</h2>
                    <p className="mt-1 text-sm text-blue-100/80">
                      Identificación: {clientCedula || 'No disponible'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    <BadgeCheck className="h-4 w-4" /> Gestión Prosejurix
                  </span>
                </div>
              </div>

              <div className="space-y-6 px-6 py-8 sm:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Procesos</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{totalProcesos}</p>
                        <p className="text-xs text-slate-500">Registrados para ti</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                        <UserCircle2 className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Estados</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{estadosUnicos}</p>
                        <p className="text-xs text-slate-500">Diferentes estados encontrados</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                        <Calendar className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Última actualización</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                          {fechaMasReciente
                            ? fechaMasReciente.toLocaleDateString('es-CO', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })
                            : 'Sin registros'}
                        </p>
                        <p className="text-xs text-slate-500">Fecha más reciente registrada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Mis Procesos Legales</h3>
                  <p className="text-sm text-slate-500">Revisa el detalle de cada proceso y su estado actual.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  <BadgeCheck className="h-4 w-4 text-indigo-500" />
                  {totalProcesos} proceso{totalProcesos !== 1 ? 's' : ''} encontrado{totalProcesos !== 1 ? 's' : ''}
                </span>
              </div>

              {totalProcesos === 0 ? (
                <div className="px-6 py-12 text-center text-slate-500">
                  No se encontraron procesos asociados a tu cuenta.
                </div>
              ) : (
                <div className="p-3">
                  <div className="rounded-3xl border border-slate-100 bg-white/70 p-2 shadow-inner shadow-slate-900/5 backdrop-blur">
                    <div className="overflow-hidden rounded-3xl border border-white/60">
                      <Table className="bg-white/80">
                        <Table.Header className="bg-gradient-to-r from-indigo-600 via-sky-500 to-blue-600 text-white">
                          <tr>
                            {columnConfig.columns.map((column) => (
                              <th
                                key={column.key}
                                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-white/80"
                              >
                                {column.label}
                              </th>
                            ))}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                              Acciones
                            </th>
                          </tr>
                        </Table.Header>
                        <tbody className="divide-y divide-slate-100/70">
                          {datosMostrar.map((proceso: any, index: number) => {
                            const procId =
                              getValue(
                                proceso,
                                'ID',
                                'id',
                                'Id',
                                'id_proceso',
                                'procesoId',
                                'Proceso ID',
                                'ID Proceso',
                                columnConfig.idKey || ''
                              ) || index;

                            return (
                              <Table.Row
                                key={procId}
                                className="group bg-white/80 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                              >
                                {columnConfig.columns.map((column) => {
                                  const rawValue = proceso[column.key];
                                  const displayValue = formatValue(rawValue);
                                  const isNameColumn = columnConfig.nameKey === column.key;
                                  const isIdColumn = columnConfig.idKey === column.key;

                                  return (
                                    <Table.Cell
                                      key={column.key}
                                      className={`align-middle ${
                                        isNameColumn ? 'whitespace-normal text-sm font-semibold text-slate-800' : ''
                                      } ${isIdColumn ? 'text-xs font-semibold uppercase tracking-[0.35em] text-slate-400' : ''} ${
                                        column.className || 'text-sm text-slate-600'
                                      }`}
                                    >
                                      {isNameColumn ? (
                                        <div>
                                          <p className="text-sm font-semibold text-slate-800">{displayValue}</p>
                                          {columnConfig.idKey && (
                                            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                                              #{
                                                formatValue(
                                                  getValue(
                                                    proceso,
                                                    columnConfig.idKey,
                                                    'ID',
                                                    'id',
                                                    'Id',
                                                    'id_proceso',
                                                    'Proceso ID',
                                                    'ID Proceso'
                                                  )
                                                )
                                              }
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-sm text-slate-600">{displayValue}</span>
                                      )}
                                    </Table.Cell>
                                  );
                                })}
                                <Table.Cell className="align-middle">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleViewDetails(proceso)}
                                      className="rounded-full bg-white/80 p-2 text-sky-500 shadow-sm transition hover:bg-sky-50 hover:text-sky-700"
                                      title="Ver detalle"
                                    >
                                      <Eye className="h-4 w-4" />
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
              )}
            </section>

            <section className="overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/60 shadow-inner shadow-blue-100/50">
              <div className="grid gap-6 px-6 py-8 sm:grid-cols-[2fr,1fr] sm:px-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">¿Tienes preguntas sobre tu caso?</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Nuestro equipo está disponible para resolver cualquier duda sobre el estado de tu proceso. Escríbenos y te
                    responderemos en minutos.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <a
                    href="https://wa.me/573001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600"
                  >
                    Contactar por WhatsApp
                  </a>
                  <a
                    href="tel:+573001234567"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                  >
                    Llamar ahora
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientProcessView;


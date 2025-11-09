import React, { useState, useEffect } from 'react';

interface ProcessFormData {
  clienteId?: number;
  clienteNombre?: string;
  cedula?: string;
  estadoInterno?: string;
  estadoPublico?: string;
  estadoProceso?: string;
  tipo?: string;
  claseProceso?: string;
  responsabilidad?: string;
  fechaAccidente?: string;
  caducidad?: string;
  lugarAccidente?: string;
  ciudad1?: string;
  fechaQuerella?: string;
  fiscalia?: string;
  ciudad2?: string;
  aseguradora?: string;
  actuacion?: string;
  fechaReclamacion?: string;
  conciliacion?: string;
  fechaPresentacionDemanda?: string;
  rama?: string;
  radicado1?: string;
  ciudad3?: string;
  prestamos?: string;
  fecha?: string;
  fechaIngreso?: string;
  demandado?: string;
  observaciones?: string;
  observacionesInternas?: string;
  observacionesCliente?: string;
  juzgado?: string;
  placaVehiculo?: string;
  celular?: string;
  telefono?: string;
  celularSecundario?: string;
  correoElectronico?: string;
  direccion?: string;
  ciudad?: string;
  radicado?: string;
  valorHonorarios?: number;
  valorPeritaje?: number;
  valorPrestamos?: number;
  gastosAdicionales?: number;
  fechaRadicacion?: string;
}

interface ProcessFormProps {
  initialData?: ProcessFormData;
  estadosInternos: Array<{ value: string; label: string }>;
  onSubmit: (data: ProcessFormData) => void;
  onCancel: () => void;
  // Mostrar info del cliente en solo lectura (si se provee, oculta el selector)
  clienteNombre?: string;
  clienteCedula?: string;
}

const ProcessForm = ({ initialData, estadosInternos, onSubmit, onCancel, clienteNombre, clienteCedula }: ProcessFormProps) => {
  // Inicializar el formulario con los datos iniciales o valores por defecto
  const [formData, setFormData] = useState<ProcessFormData>(() => {
    if (initialData) {
      return initialData;
    }
    // Valores por defecto para un nuevo proceso
    return {
      estadoInterno: 'activo',
      estadoPublico: 'Evaluación Inicial',
      tipo: 'civil',
      fecha: new Date().toISOString().split('T')[0],
      fechaIngreso: new Date().toISOString().split('T')[0]
    };
  });

  // Actualizar cuando cambien los initialData (para edición)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Normalizar valores de estado y tipo a opciones conocidas si vienen como texto libre de la tabla
  useEffect(() => {
    const normalized: Partial<ProcessFormData> = {};
    // Estado Interno: intentar mapear por etiqueta de opciones
    if (!formData.estadoInterno || !estadosInternos.some(opt => opt.value === formData.estadoInterno)) {
      const source = (formData.estadoInterno || formData.estadoPublico || '').toLowerCase();
      const match = estadosInternos.find(opt => opt.label.toLowerCase().includes(source) || source.includes(opt.label.toLowerCase()));
      if (match) normalized.estadoInterno = match.value;
    }
    // Tipo: mapear a civil/penal/laboral/comercial desde texto libre
    if (!formData.tipo || !['civil','penal','laboral','comercial'].includes(String(formData.tipo).toLowerCase())) {
      const t = String(formData.tipo || '').toLowerCase();
      if (t.includes('civil')) normalized.tipo = 'civil';
      else if (t.includes('penal')) normalized.tipo = 'penal';
      else if (t.includes('labor')) normalized.tipo = 'laboral';
      else if (t.includes('comer')) normalized.tipo = 'comercial';
    }
    if (Object.keys(normalized).length > 0) {
      setFormData(prev => ({ ...prev, ...normalized }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadosInternos]);

  const isEditing = Boolean(initialData);

  const inputClasses =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-[75vh] flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/10"
    >
      <div className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">
              {isEditing ? 'Actualizar proceso' : 'Crear nuevo proceso'}
            </p>
            <p className="text-xs text-slate-500">
              Completa la información del cliente y del caso. Los campos marcados con * son obligatorios.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            >
              {isEditing ? 'Guardar cambios' : 'Crear proceso'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-5 pb-4">
          <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Información del Cliente</h4>
                <p className="text-xs text-slate-500">Datos de contacto y referencia del cliente</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Cliente
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Nombre del cliente *
            </label>
            <input
              type="text"
              value={formData.clienteNombre ?? clienteNombre ?? ''}
              onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                  className={inputClasses}
                  placeholder="Nombre completo del cliente"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Cédula / NIT
            </label>
            <input
              type="text"
                  value={formData.cedula || clienteCedula || ''}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  className={inputClasses}
                  placeholder="Documento de identidad"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Celular
            </label>
            <input
              type="text"
              value={formData.celular || ''}
              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className={inputClasses}
                  placeholder="Número de celular"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Teléfono
            </label>
            <input
              type="text"
              value={formData.telefono || ''}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className={inputClasses}
                  placeholder="Teléfono adicional (opcional)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Celular alterno
                </label>
                <input
                  type="text"
                  value={formData.celularSecundario || ''}
                  onChange={(e) => setFormData({ ...formData, celularSecundario: e.target.value })}
                  className={inputClasses}
                  placeholder="Número adicional (opcional)"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Gestión Jurídica</h4>
                <p className="text-xs text-slate-500">Seguimiento con aseguradoras y actuaciones</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                Gestión
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Aseguradora
                </label>
                <input
                  type="text"
                  value={formData.aseguradora || ''}
                  onChange={(e) => setFormData({ ...formData, aseguradora: e.target.value })}
                  className={inputClasses}
                  placeholder="Nombre de la aseguradora"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Actuación
                </label>
                <input
                  type="text"
                  value={formData.actuacion || ''}
                  onChange={(e) => setFormData({ ...formData, actuacion: e.target.value })}
                  className={inputClasses}
                  placeholder="Descripción de la actuación"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Rama
                </label>
                <input
                  type="text"
                  value={formData.rama || ''}
                  onChange={(e) => setFormData({ ...formData, rama: e.target.value })}
                  className={inputClasses}
                  placeholder="Rama judicial"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha reclamación
                </label>
                <input
                  type="date"
                  value={formData.fechaReclamacion || ''}
                  onChange={(e) => setFormData({ ...formData, fechaReclamacion: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Conciliación / estado
                </label>
                <input
                  type="text"
                  value={formData.conciliacion || ''}
                  onChange={(e) => setFormData({ ...formData, conciliacion: e.target.value })}
                  className={inputClasses}
                  placeholder="Fechas o estado de conciliación"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha presentación demanda
                </label>
                <input
                  type="text"
                  value={formData.fechaPresentacionDemanda || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaPresentacionDemanda: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="Fecha o estado de la demanda"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Radicado adicional
                </label>
                <input
                  type="text"
                  value={formData.radicado1 || ''}
                  onChange={(e) => setFormData({ ...formData, radicado1: e.target.value })}
                  className={`${inputClasses} font-mono`}
                  placeholder="Radicado secundario"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Observaciones préstamos / gastos
                </label>
                <input
                  type="text"
                  value={formData.prestamos || ''}
                  onChange={(e) => setFormData({ ...formData, prestamos: e.target.value })}
                  className={inputClasses}
                  placeholder="Notas sobre préstamos u otros gastos"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Detalles del Incidente</h4>
                <p className="text-xs text-slate-500">Fechas y lugares relacionados con el accidente</p>
              </div>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                Incidente
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha del accidente
                </label>
                <input
                  type="date"
                  value={formData.fechaAccidente || ''}
                  onChange={(e) => setFormData({ ...formData, fechaAccidente: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Caducidad
                </label>
                <input
                  type="date"
                  value={formData.caducidad || ''}
                  onChange={(e) => setFormData({ ...formData, caducidad: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha querella
                </label>
                <input
                  type="date"
                  value={formData.fechaQuerella || ''}
                  onChange={(e) => setFormData({ ...formData, fechaQuerella: e.target.value })}
                  className={inputClasses}
            />
          </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Lugar del accidente
                </label>
                <input
                  type="text"
                  value={formData.lugarAccidente || ''}
                  onChange={(e) => setFormData({ ...formData, lugarAccidente: e.target.value })}
                  className={inputClasses}
                  placeholder="Ubicación exacta del incidente"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fiscalía / entidad
                </label>
                <input
                  type="text"
                  value={formData.fiscalia || ''}
                  onChange={(e) => setFormData({ ...formData, fiscalia: e.target.value })}
                  className={inputClasses}
                  placeholder="Fiscalía encargada (si aplica)"
                />
        </div>
      </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ciudad incidente
                </label>
                <input
                  type="text"
                  value={formData.ciudad1 || ''}
                  onChange={(e) => setFormData({ ...formData, ciudad1: e.target.value })}
                  className={inputClasses}
                  placeholder="Ciudad del accidente"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ciudad fiscalía
                </label>
                <input
                  type="text"
                  value={formData.ciudad2 || ''}
                  onChange={(e) => setFormData({ ...formData, ciudad2: e.target.value })}
                  className={inputClasses}
                  placeholder="Ciudad de la entidad"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ciudad adicional
                </label>
                <input
                  type="text"
                  value={formData.ciudad3 || ''}
                  onChange={(e) => setFormData({ ...formData, ciudad3: e.target.value })}
                  className={inputClasses}
                  placeholder="Otra ciudad relacionada"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
          <div>
                <h4 className="text-sm font-semibold text-slate-800">Estado del Proceso</h4>
                <p className="text-xs text-slate-500">Ajusta el estado actual y el tipo de proceso</p>
              </div>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                Seguimiento
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estado interno *
            </label>
            <select
              value={formData.estadoInterno || ''}
              onChange={(e) => setFormData({ ...formData, estadoInterno: e.target.value })}
                  className={`${inputClasses} bg-white`}
            >
              <option value="">Seleccionar estado</option>
                  {estadosInternos.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estado público
            </label>
            <input
              type="text"
              value={formData.estadoPublico || ''}
              onChange={(e) => setFormData({ ...formData, estadoPublico: e.target.value })}
                  className={inputClasses}
              placeholder="Ej: En investigación"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estado del proceso (cliente)
                </label>
                <input
                  type="text"
                  value={formData.estadoProceso || ''}
                  onChange={(e) => setFormData({ ...formData, estadoProceso: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: Conciliación"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tipo de proceso
            </label>
            <select
              value={formData.tipo || ''}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className={`${inputClasses} bg-white`}
            >
              <option value="">Seleccionar tipo</option>
              <option value="civil">Civil</option>
              <option value="penal">Penal</option>
              <option value="laboral">Laboral</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Clase de proceso
                </label>
                <input
                  type="text"
                  value={formData.claseProceso || ''}
                  onChange={(e) => setFormData({ ...formData, claseProceso: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: Accidente"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Responsabilidad
                </label>
                <input
                  type="text"
                  value={formData.responsabilidad || ''}
                  onChange={(e) => setFormData({ ...formData, responsabilidad: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: Extracontractual"
                />
        </div>
      </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
          <div>
                <h4 className="text-sm font-semibold text-slate-800">Contacto y Ubicación</h4>
                <p className="text-xs text-slate-500">Información para comunicarnos con el cliente</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                Contacto
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Correo electrónico
                </label>
            <input
              type="email"
                  value={formData.correoElectronico || ''}
                  onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
                  className={inputClasses}
              placeholder="correo@ejemplo.com"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ciudad
                </label>
            <input
              type="text"
              value={formData.ciudad || ''}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  className={inputClasses}
              placeholder="Ciudad"
            />
          </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Dirección
                </label>
            <input
              type="text"
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className={inputClasses}
                  placeholder="Dirección completa del cliente"
            />
          </div>
        </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Fechas y Radicado</h4>
                <p className="text-xs text-slate-500">Mantén la línea de tiempo del proceso al día</p>
      </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                Calendario
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha de ingreso
            </label>
            <input
              type="date"
              value={formData.fechaIngreso || ''}
              onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                  className={inputClasses}
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha del proceso
            </label>
            <input
              type="date"
              value={formData.fecha || ''}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className={inputClasses}
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Fecha de radicación
            </label>
            <input
              type="date"
              value={formData.fechaRadicacion || ''}
              onChange={(e) => setFormData({ ...formData, fechaRadicacion: e.target.value })}
                  className={inputClasses}
            />
          </div>
        </div>
            <div className="mt-4 space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Número de radicado
              </label>
          <input
            type="text"
            value={formData.radicado || ''}
            onChange={(e) => setFormData({ ...formData, radicado: e.target.value })}
                className={`${inputClasses} font-mono`}
                placeholder="Ej: 17001-31-03-001-2024-00001-00"
          />
        </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Información Legal</h4>
                <p className="text-xs text-slate-500">Detalles del caso y datos del juzgado</p>
      </div>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                Caso
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Demandado
            </label>
            <input
              type="text"
              value={formData.demandado || ''}
              onChange={(e) => setFormData({ ...formData, demandado: e.target.value })}
                  className={inputClasses}
              placeholder="Nombre del demandado"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Juzgado
            </label>
            <input
              type="text"
              value={formData.juzgado || ''}
              onChange={(e) => setFormData({ ...formData, juzgado: e.target.value })}
                  className={inputClasses}
                  placeholder="Juzgado a cargo"
            />
          </div>
        </div>
            <div className="mt-4 space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Placa del vehículo
          </label>
          <input
            type="text"
            value={formData.placaVehiculo || ''}
                onChange={(e) =>
                  setFormData({ ...formData, placaVehiculo: e.target.value.toUpperCase() })
                }
                className={`${inputClasses} font-mono uppercase`}
            placeholder="ABC123"
            maxLength={6}
          />
        </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Valores Económicos</h4>
                <p className="text-xs text-slate-500">Registra los valores clave del proceso</p>
      </div>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Honorarios
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Valor honorarios
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
                  value={formData.valorHonorarios ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valorHonorarios: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className={inputClasses}
              placeholder="0.00"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Valor peritaje
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
                  value={formData.valorPeritaje ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valorPeritaje: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className={inputClasses}
              placeholder="0.00"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Valor préstamos
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
                  value={formData.valorPrestamos ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valorPrestamos: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className={inputClasses}
              placeholder="0.00"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Gastos adicionales
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
                  value={formData.gastosAdicionales ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gastosAdicionales: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className={inputClasses}
              placeholder="0.00"
            />
          </div>
        </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Observaciones</h4>
                <p className="text-xs text-slate-500">Notas internas y mensajes para el cliente</p>
      </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Notas
              </span>
            </header>

        <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Observaciones generales
            </label>
            <textarea
              rows={3}
              value={formData.observaciones || ''}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className={`${inputClasses} min-h-[110px] resize-none`}
              placeholder="Observaciones generales del proceso"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Observaciones internas
            </label>
            <textarea
              rows={3}
              value={formData.observacionesInternas || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, observacionesInternas: e.target.value })
                  }
                  className={`${inputClasses} min-h-[110px] resize-none`}
              placeholder="Notas internas (no visibles para el cliente)"
            />
          </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Observaciones para el cliente
            </label>
            <textarea
              rows={3}
              value={formData.observacionesCliente || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, observacionesCliente: e.target.value })
                  }
                  className={`${inputClasses} min-h-[110px] resize-none`}
              placeholder="Mensaje visible para el cliente"
            />
          </div>
        </div>
          </section>
      </div>
      </div>
    </form>
  );
};

export default ProcessForm;


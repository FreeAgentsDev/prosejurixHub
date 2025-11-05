import React, { useState, useEffect } from 'react';

interface ProcessFormData {
  clienteId?: number;
  cedula?: string;
  estadoInterno?: string;
  estadoPublico?: string;
  tipo?: string;
  fecha?: string;
  fechaIngreso?: string;
  demandado?: string;
  codigoAcceso?: string;
  observaciones?: string;
  observacionesInternas?: string;
  observacionesCliente?: string;
  juzgado?: string;
  placaVehiculo?: string;
  celular?: string;
  telefono?: string;
  valorHonorarios?: number;
  valorPeritaje?: number;
  valorPrestamos?: number;
  gastosAdicionales?: number;
  fechaRadicacion?: string;
}

interface ProcessFormProps {
  initialData?: ProcessFormData;
  clientes: Array<{ id: number; nombre: string }>;
  estadosInternos: Array<{ value: string; label: string }>;
  onSubmit: (data: ProcessFormData) => void;
  onCancel: () => void;
}

const ProcessForm = ({ initialData, clientes, estadosInternos, onSubmit, onCancel }: ProcessFormProps) => {
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
      fechaIngreso: new Date().toISOString().split('T')[0],
      codigoAcceso: ''
    };
  });

  // Actualizar cuando cambien los initialData (para edición)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, codigoAcceso: code });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Información Básica</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cliente *
            </label>
            <select
              value={formData.clienteId || ''}
              onChange={(e) => setFormData({ ...formData, clienteId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cédula
            </label>
            <input
              type="text"
              value={formData.cedula || ''}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cédula del cliente"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Celular
            </label>
            <input
              type="text"
              value={formData.celular || ''}
              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Celular del cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              value={formData.telefono || ''}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Teléfono del cliente"
            />
          </div>
        </div>
      </div>

      {/* Estado y Tipo */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Estado y Tipo</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado Interno *
            </label>
            <select
              value={formData.estadoInterno || ''}
              onChange={(e) => setFormData({ ...formData, estadoInterno: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar estado</option>
              {estadosInternos.map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado Público
            </label>
            <input
              type="text"
              value={formData.estadoPublico || ''}
              onChange={(e) => setFormData({ ...formData, estadoPublico: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: En investigación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de Proceso
            </label>
            <select
              value={formData.tipo || ''}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              <option value="civil">Civil</option>
              <option value="penal">Penal</option>
              <option value="laboral">Laboral</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Fechas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha de Ingreso
            </label>
            <input
              type="date"
              value={formData.fechaIngreso || ''}
              onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha del Proceso
            </label>
            <input
              type="date"
              value={formData.fecha || ''}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha de Radicación
            </label>
            <input
              type="date"
              value={formData.fechaRadicacion || ''}
              onChange={(e) => setFormData({ ...formData, fechaRadicacion: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Información Legal */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Información Legal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Demandado
            </label>
            <input
              type="text"
              value={formData.demandado || ''}
              onChange={(e) => setFormData({ ...formData, demandado: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del demandado"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Juzgado
            </label>
            <input
              type="text"
              value={formData.juzgado || ''}
              onChange={(e) => setFormData({ ...formData, juzgado: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del juzgado"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Placa Vehículo
          </label>
          <input
            type="text"
            value={formData.placaVehiculo || ''}
            onChange={(e) => setFormData({ ...formData, placaVehiculo: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="ABC123"
            maxLength={6}
          />
        </div>
      </div>

      {/* Código de Acceso */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Código de Acceso</h4>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Código de Acceso
          </label>
          <div className="flex">
            <input
              type="text"
              value={formData.codigoAcceso || ''}
              onChange={(e) => setFormData({ ...formData, codigoAcceso: e.target.value.toUpperCase() })}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 font-mono"
              placeholder="Código de acceso para el cliente"
            />
            <button
              type="button"
              onClick={generateAccessCode}
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Generar
            </button>
          </div>
        </div>
      </div>

      {/* Valores Económicos */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Valores Económicos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valor Honorarios
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.valorHonorarios || ''}
              onChange={(e) => setFormData({ ...formData, valorHonorarios: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valor Peritaje
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.valorPeritaje || ''}
              onChange={(e) => setFormData({ ...formData, valorPeritaje: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valor Préstamos
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.valorPrestamos || ''}
              onChange={(e) => setFormData({ ...formData, valorPrestamos: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gastos Adicionales
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.gastosAdicionales || ''}
              onChange={(e) => setFormData({ ...formData, gastosAdicionales: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Observaciones */}
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Observaciones</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Observaciones Generales
            </label>
            <textarea
              rows={3}
              value={formData.observaciones || ''}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observaciones generales del proceso"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Observaciones Internas
            </label>
            <textarea
              rows={3}
              value={formData.observacionesInternas || ''}
              onChange={(e) => setFormData({ ...formData, observacionesInternas: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas internas (no visibles para el cliente)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Observaciones para el Cliente
            </label>
            <textarea
              rows={3}
              value={formData.observacionesCliente || ''}
              onChange={(e) => setFormData({ ...formData, observacionesCliente: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mensaje visible para el cliente"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ProcessForm;


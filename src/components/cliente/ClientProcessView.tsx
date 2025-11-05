import React, { useState } from 'react';
import { FileText, Calendar, Eye, X } from 'lucide-react';
import Card from '../common/Card';
import Modal from '../common/Modal';

interface Process {
  id: number | string;
  estado: string;
  observaciones: string;
  fechaIngreso: string;
  tipo: string;
  datosCompletos?: any; // Datos completos del proceso
}

interface ClientProcessViewProps {
  processes: Process[];
  clientName: string;
  clientCedula: string;
  onLogout: () => void;
}

const ClientProcessView = ({ processes, clientName, clientCedula, onLogout }: ClientProcessViewProps) => {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (proceso: Process) => {
    setSelectedProcess(proceso);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProcess(null);
  };

  const formatFieldName = (fieldName: string): string => {
    // Convertir nombres de campo a formato legible
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\//g, ' / ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'No disponible';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getStatusColor = (estado: string) => {
    const e = (estado || '').toLowerCase();
    if (e.includes('investig') || e.includes('revisi') || e.includes('evalu')) return 'bg-amber-100 text-amber-800';
    if (e.includes('reclama') || e.includes('radic')) return 'bg-sky-100 text-sky-800';
    if (e.includes('concili')) return 'bg-blue-100 text-blue-800';
    if (e.includes('demanda') || e.includes('proceso') || e.includes('admis')) return 'bg-indigo-100 text-indigo-800';
    if (e.includes('final') || e.includes('cerr') || e.includes('paz')) return 'bg-green-100 text-green-800';
    return 'bg-slate-100 text-slate-800';
  };

  const getProgressFromEstado = (estado: string) => {
    const e = (estado || '').toLowerCase();
    if (e.includes('investig') || e.includes('revisi') || e.includes('evalu')) return 20;
    if (e.includes('document') || e.includes('pendiente')) return 35;
    if (e.includes('reclama') || e.includes('radic')) return 55;
    if (e.includes('concili')) return 70;
    if (e.includes('demanda') || e.includes('proceso') || e.includes('admis')) return 85;
    if (e.includes('paz') || e.includes('final') || e.includes('cerr')) return 100;
    return 40; // valor por defecto
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/prosejurix-rounded.png" 
                alt="Prosejurix Logo" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Portal del Cliente</h1>
                <p className="text-sm text-slate-600">Prosejurix</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bienvenido, {clientName}
              </h2>
              <p className="text-slate-600">
                {clientCedula.length > 10 ? 'NIT' : 'Cédula'}: {clientCedula}
              </p>
            </div>
          </div>
        </Card>

        {/* Processes Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-600" />
              Mis Procesos Legales
            </h3>
            <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-900">{processes.length}</span> proceso{processes.length !== 1 ? 's' : ''} encontrado{processes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {processes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-slate-500">No se encontraron procesos para tu cédula/NIT.</p>
            </Card>
          ) : (
            processes.map((proceso) => (
              <Card key={proceso.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">
                      Proceso {proceso.id}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Tipo: <span className="font-medium ml-1 capitalize">{proceso.tipo}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Fecha de ingreso: {new Date(proceso.fechaIngreso).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500">Avance del proceso</span>
                        <span className="text-xs font-semibold text-slate-700">{getProgressFromEstado(proceso.estado)}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-700"
                          style={{ width: `${getProgressFromEstado(proceso.estado)}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Estado: <span className="font-medium text-slate-700">{proceso.estado}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(proceso.estado)}`}>
                      {proceso.estado}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Última Actualización:
                  </h5>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {proceso.observaciones}
                  </p>
                </div>

                {/* Botón de Detalles */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleViewDetails(proceso)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Detalles */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Detalles del Proceso ${selectedProcess?.id || ''}`}
        >
          {selectedProcess?.datosCompletos && (
            <div className="space-y-6">
              {/* Información del Cliente */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-3 text-lg">Información del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProcess.datosCompletos)
                    .filter(([key]) => 
                      key.toLowerCase().includes('nombre') || 
                      key.toLowerCase().includes('cedula') || 
                      key.toLowerCase().includes('nit') ||
                      key.toLowerCase().includes('celular') ||
                      key.toLowerCase().includes('correo') ||
                      key.toLowerCase().includes('direccion') ||
                      key.toLowerCase().includes('ciudad')
                    )
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded p-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                        <p className="text-sm text-slate-900 mt-1">{formatFieldValue(value)}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Información del Proceso */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-bold text-indigo-900 mb-3 text-lg">Información del Proceso</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProcess.datosCompletos)
                    .filter(([key]) => 
                      key.toLowerCase().includes('proceso') || 
                      key.toLowerCase().includes('clase') ||
                      key.toLowerCase().includes('responsabilidad') ||
                      key.toLowerCase().includes('estado') ||
                      key.toLowerCase().includes('tipo') ||
                      key.toLowerCase().includes('radicado')
                    )
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded p-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                        <p className="text-sm text-slate-900 mt-1">{formatFieldValue(value)}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Información del Accidente */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-bold text-amber-900 mb-3 text-lg">Información del Accidente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProcess.datosCompletos)
                    .filter(([key]) => 
                      key.toLowerCase().includes('accidente') || 
                      key.toLowerCase().includes('fecha') ||
                      key.toLowerCase().includes('lugar') ||
                      key.toLowerCase().includes('caducidad')
                    )
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded p-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                        <p className="text-sm text-slate-900 mt-1">{formatFieldValue(value)}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Información Legal */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-3 text-lg">Información Legal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProcess.datosCompletos)
                    .filter(([key]) => 
                      key.toLowerCase().includes('quere') || 
                      key.toLowerCase().includes('fiscal') ||
                      key.toLowerCase().includes('juzgado') ||
                      key.toLowerCase().includes('rama') ||
                      key.toLowerCase().includes('demanda') ||
                      key.toLowerCase().includes('conciliacion') ||
                      key.toLowerCase().includes('reclamacion')
                    )
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded p-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                        <p className="text-sm text-slate-900 mt-1">{formatFieldValue(value)}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Información Financiera */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-3 text-lg">Información Financiera</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProcess.datosCompletos)
                    .filter(([key]) => 
                      key.toLowerCase().includes('asegur') || 
                      key.toLowerCase().includes('prestamo') ||
                      key.toLowerCase().includes('valor') ||
                      key.toLowerCase().includes('honorario') ||
                      key.toLowerCase().includes('peritaje') ||
                      key.toLowerCase().includes('gasto')
                    )
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded p-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                        <p className="text-sm text-slate-900 mt-1">{formatFieldValue(value)}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Todos los demás campos */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-bold text-slate-900 mb-3 text-lg">Información Adicional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProcess.datosCompletos)
                    .filter(([key]) => {
                      const k = key.toLowerCase();
                      return !k.includes('nombre') && 
                             !k.includes('cedula') && 
                             !k.includes('nit') &&
                             !k.includes('celular') &&
                             !k.includes('correo') &&
                             !k.includes('direccion') &&
                             !k.includes('ciudad') &&
                             !k.includes('proceso') &&
                             !k.includes('clase') &&
                             !k.includes('responsabilidad') &&
                             !k.includes('estado') &&
                             !k.includes('tipo') &&
                             !k.includes('radicado') &&
                             !k.includes('accidente') &&
                             !k.includes('fecha') &&
                             !k.includes('lugar') &&
                             !k.includes('caducidad') &&
                             !k.includes('quere') &&
                             !k.includes('fiscal') &&
                             !k.includes('juzgado') &&
                             !k.includes('rama') &&
                             !k.includes('demanda') &&
                             !k.includes('conciliacion') &&
                             !k.includes('reclamacion') &&
                             !k.includes('asegur') &&
                             !k.includes('prestamo') &&
                             !k.includes('valor') &&
                             !k.includes('honorario') &&
                             !k.includes('peritaje') &&
                             !k.includes('gasto');
                    })
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded p-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                        <p className="text-sm text-slate-900 mt-1">{formatFieldValue(value)}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            ¿Tienes Preguntas sobre tu Caso?
          </h3>
          <p className="text-slate-700 mb-4">
            Nuestro equipo está disponible para resolver cualquier duda que tengas sobre el estado de tu proceso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-center"
            >
              Contactar por WhatsApp
            </a>
            <a
              href="tel:+573001234567"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              Llamar Ahora
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientProcessView;


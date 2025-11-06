import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import DashboardCards from '../../components/admin/DashboardCards';
import ProcessTable from '../../components/admin/ProcessTable';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProcessForm from '../../components/admin/ProcessForm';
import { mockClientes, estadosInternos } from '../../data/mocks';
import { useProcesses } from '../../hooks/useProcesses';

const Procesos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Usar hook personalizado para gestionar procesos
  const { procesos, procesosRaw, createProcess, updateProcess, deleteProcess, isLoaded, error } = useProcesses();
  const clientes = mockClientes;

  // Helper para leer valores desde tabla cruda o mock
  const getValue = (obj: any, ...keys: string[]): any => {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
    }
    return null;
  };

  // Estadísticas basadas en tabla si existe, con fallback a mocks
  const stats = useMemo(() => {
    const origin = (procesosRaw && procesosRaw.length > 0) ? procesosRaw : procesos;
    const totalProcesos = origin.length;

    let activos = 0, finalizados = 0, enRevision = 0, enNegociacion = 0;
    for (const p of origin) {
      const estado = String(getValue(p, 'estado', 'Estado', 'ESTADO') ?? p.estado ?? '').toLowerCase();
      const estadoPublico = String(getValue(p, 'estado_publico', 'estadoPublico', 'ESTADO_PUBLICO') ?? p.estadoPublico ?? '').toLowerCase();

      if (estado === 'activo') activos++;
      if (estado === 'finalizado' || estado === 'cerrado') finalizados++;
      if (estado === 'en_espera' || estado.includes('revision') || estado.includes('revisión')) enRevision++;
      if (estadoPublico.includes('negociacion') || estadoPublico.includes('negociación')) enNegociacion++;
    }

    return {
      totalProcesos,
      procesosActivos: activos,
      procesosFinalizados: finalizados,
      procesosEnRevision: enRevision,
      procesosEnNegociacion: enNegociacion,
      totalClientes: clientes.length
    };
  }, [procesos, procesosRaw, clientes]);

  // Filtrar procesos por búsqueda (solo por nombre, INSENSIBLE a mayúsculas/minúsculas)
  const filteredProcesos = useMemo(() => {
    let filtered = procesos;

    // Búsqueda SOLO por nombre del cliente, case-insensitive (subcadena)
    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase();

      filtered = filtered.filter(p => {
        if (!p.clienteNombre) return false;
        const nombreCompleto = String(p.clienteNombre).toLowerCase();
        // Coincidencia de subcadena, ignorando mayúsculas/minúsculas
        return nombreCompleto.includes(term);
      });
    }

    return filtered;
  }, [searchTerm, procesos]);

  const openModal = (proceso?: any) => {
    setEditingItem(proceso || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleView = (proceso: any) => {
    // Obtener el ID del proceso desde diferentes posibles campos
    // Priorizar proceso_id (ID del proceso) sobre otros campos
    const procId = proceso.proceso_id || proceso.procesoId || proceso.proceso_ID || 
                  proceso.id || proceso.ID || proceso.Id || 
                  `PROC-${proceso.ID || proceso.id || 'N/A'}`;
    
    console.log('🔍 Navegando a detalles con ID:', procId, 'Proceso completo:', proceso);
    
    // Ir a la página de detalle en modo solo lectura
    navigate(`/admin/procesos/${encodeURIComponent(String(procId))}?mode=view`);
  };

  const handleEdit = (proceso: any) => {
    // Obtener el ID del proceso desde diferentes posibles campos
    // Priorizar proceso_id (ID del proceso) sobre otros campos
    const procId = proceso.proceso_id || proceso.procesoId || proceso.proceso_ID || 
                  proceso.id || proceso.ID || proceso.Id || 
                  `PROC-${proceso.ID || proceso.id || 'N/A'}`;
    
    console.log('🔍 Navegando a edición con ID:', procId, 'Proceso completo:', proceso);
    
    // Ir a la página de detalle en modo edición
    navigate(`/admin/procesos/${encodeURIComponent(String(procId))}?mode=edit`);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('¿Está seguro de eliminar este proceso? Esta acción no se puede deshacer.')) {
      try {
        await deleteProcess(String(id));
      } catch (error) {
        alert('Error al eliminar el proceso. Por favor, intente nuevamente.');
        console.error('Error:', error);
      }
    }
  };

  const handleSubmit = async (data: any) => {
    const cliente = clientes.find(c => c.id === data.clienteId);
    
    try {
      if (editingItem) {
        // Actualizar proceso existente
        await updateProcess(editingItem.id, {
          clienteId: data.clienteId,
          clienteNombre: cliente?.nombre || '',
          cedula: data.cedula || cliente?.cedula || '',
          estado: data.estadoInterno as 'activo' | 'finalizado' | 'en_espera',
          estadoPublico: data.estadoPublico,
          tipo: data.tipo as 'civil' | 'penal' | 'laboral' | 'comercial',
          fecha: data.fecha,
          fechaIngreso: data.fechaIngreso,
          demandado: data.demandado,
          codigoAcceso: data.codigoAcceso,
          observaciones: data.observaciones,
          observacionesInternas: data.observacionesInternas,
          observacionesCliente: data.observacionesCliente,
          juzgado: data.juzgado,
          placaVehiculo: data.placaVehiculo,
          valorHonorarios: data.valorHonorarios,
          valorPeritaje: data.valorPeritaje,
          valorPrestamos: data.valorPrestamos,
          gastosAdicionales: data.gastosAdicionales,
          fechaRadicacion: data.fechaRadicacion
        });
      } else {
        // Crear nuevo proceso - INCLUIR TODOS LOS CAMPOS DE LA TABLA
        if (!data.clienteId) {
          alert('Por favor, selecciona un cliente');
          return;
        }

        const nuevoProceso: Omit<MockProceso, 'id'> = {
          cedula: data.cedula || cliente?.cedula || '',
          estado: (data.estadoInterno || 'activo') as 'activo' | 'finalizado' | 'en_espera',
          estadoPublico: data.estadoPublico || 'Evaluación Inicial',
          tipo: (data.tipo || 'civil') as 'civil' | 'penal' | 'laboral' | 'comercial',
          fecha: data.fecha || new Date().toISOString().split('T')[0],
          fechaIngreso: data.fechaIngreso || new Date().toISOString().split('T')[0],
          clienteNombre: cliente?.nombre || '',
          clienteId: data.clienteId,
          demandado: data.demandado || '',
          codigoAcceso: data.codigoAcceso || '',
          observaciones: data.observaciones || undefined,
          observacionesInternas: data.observacionesInternas || undefined,
          observacionesCliente: data.observacionesCliente || undefined,
          juzgado: data.juzgado || undefined,
          placaVehiculo: data.placaVehiculo || undefined,
          valorHonorarios: data.valorHonorarios || undefined,
          valorPeritaje: data.valorPeritaje || undefined,
          valorPrestamos: data.valorPrestamos || undefined,
          gastosAdicionales: data.gastosAdicionales || undefined,
          fechaRadicacion: data.fechaRadicacion || undefined
        };
        
        console.log('📝 Creando nuevo proceso con todos los campos:', nuevoProceso);
        await createProcess(nuevoProceso);
      }
      closeModal();
    } catch (error) {
      alert('Error al guardar el proceso. Por favor, intente nuevamente.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/prosejurix-rounded.png" 
                alt="Prosejurix Logo" 
                className="h-12 sm:h-16 md:h-20"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Gestión de Procesos</h1>
                <p className="text-xs sm:text-sm text-slate-600">Lista completa de procesos legales</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">
                  <strong>Error de conexión:</strong> {error}
                </p>
                <div className="mt-2 text-xs text-red-600">
                  <p>Posibles soluciones:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Verifica que el archivo .env esté configurado correctamente</li>
                    <li>Verifica que la tabla "CTRANTECEDENTES" exista en Supabase</li>
                    <li>Verifica los permisos RLS (Row Level Security) en Supabase</li>
                    <li>Abre la consola del navegador (F12) para más detalles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <DashboardCards
          totalProcesos={stats.totalProcesos}
          procesosActivos={stats.procesosActivos}
          procesosEnNegociacion={stats.procesosEnNegociacion}
          procesosFinalizados={stats.procesosFinalizados}
          procesosEnRevision={stats.procesosEnRevision}
        />

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <SearchBar
              placeholder="Buscar usuario"
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => openModal()}
            className="w-full sm:w-auto flex items-center justify-center whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proceso
          </Button>
        </div>

        {!isLoaded ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-500">Cargando procesos desde Supabase...</p>
              <p className="text-xs text-slate-400">Por favor espera mientras se conecta a la base de datos</p>
            </div>
          </div>
        ) : (
          <>
            {filteredProcesos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="max-w-md mx-auto">
                  {error ? (
                    <>
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-700 mb-2 font-semibold">Error al cargar los procesos</p>
                      <p className="text-sm text-slate-500 mb-4">{error}</p>
                      <p className="text-xs text-slate-400 mb-4">
                        Verifica la consola del navegador (F12) para más detalles sobre el error.
                      </p>
                    </>
                  ) : searchTerm ? (
                    <>
                      <p className="text-slate-500 mb-4">
                        No se encontraron procesos con los filtros seleccionados
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                        }}
                        className="inline-flex items-center"
                      >
                        Limpiar Filtros
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-700 mb-2 font-semibold">No hay procesos registrados</p>
                      <p className="text-sm text-slate-500 mb-4">
                        La tabla "CTRANTECEDENTES" está vacía. Crea tu primer proceso para comenzar.
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => openModal()}
                        className="inline-flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Proceso
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <p className="text-sm text-slate-600">
                    Mostrando <span className="font-semibold text-slate-900">{filteredProcesos.length}</span> de{' '}
                    <span className="font-semibold text-slate-900">{procesos.length}</span> procesos
                  </p>
                </div>
                <ProcessTable
                  processes={filteredProcesos.map(p => ({
                    id: p.id,
                    clienteId: p.clienteId,
                    clienteNombre: p.clienteNombre,
                    fechaIngreso: p.fechaIngreso,
                    estadoInterno: p.estado,
                    estadoPublico: p.estadoPublico,
                    demandado: p.demandado,
                    codigoAcceso: p.codigoAcceso
                  }))}
                  procesosRaw={procesosRaw && procesosRaw.length > 0 ? procesosRaw.filter((p: any) => {
                    // Filtrar datos crudos replicando la búsqueda SOLO por nombre (case-insensitive)
                    if (searchTerm) {
                      const term = searchTerm.trim().toLowerCase();
                      const nombreOriginal = String(
                        p.NOMBRE ?? p.nombre ?? p.cliente_nombre ?? p.Nombre ?? ''
                      ).toLowerCase();
                      if (!nombreOriginal.includes(term)) return false;
                    }
                    return true;
                  }) : undefined}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </>
            )}
          </>
        )}
      </main>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingItem ? 'Editar Proceso' : 'Nuevo Proceso'}
      >
        <ProcessForm
          initialData={editingItem}
          clientes={clientes.map(c => ({ id: c.id, nombre: c.nombre }))}
          estadosInternos={estadosInternos}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Procesos;

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LogOut } from 'lucide-react';
import DashboardCards from '../../components/admin/DashboardCards';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import ProcessTable from '../../components/admin/ProcessTable';
import Button from '../../components/common/Button';
 
import { useProcesses } from '../../hooks/useProcesses';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab] = useState<'procesos'>('procesos');
  const [searchTerm, setSearchTerm] = useState('');

  // Usar hook personalizado para gestionar procesos
  const { procesos, procesosRaw, deleteProcess } = useProcesses();
  

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalProcesos = procesos.length;
    const procesosActivos = procesos.filter(p => p.estado === 'activo').length;
    const procesosFinalizados = procesos.filter(p => p.estado === 'finalizado').length;
    const procesosEnRevision = procesos.filter(p => p.estado === 'en_espera').length;
    const procesosEnNegociacion = procesos.filter(p => 
      p.estadoPublico.toLowerCase().includes('negociación') || 
      p.estadoPublico.toLowerCase().includes('negociacion')
    ).length;
    
    return {
      totalProcesos,
      procesosActivos,
      procesosFinalizados,
      procesosEnRevision,
      procesosEnNegociacion
    };
  }, [procesos]);

  // Filtrar procesos (mostrar todos desde el inicio) - búsqueda SOLO por nombre, insensible a mayúsculas/minúsculas
  const filteredProcesos = useMemo(() => {
    const base = [...procesos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    if (!searchTerm) return base;

    const term = searchTerm.trim().toLowerCase();

    return base.filter(p => {
      if (!p.clienteNombre) return false;
      const nombreCompleto = String(p.clienteNombre).toLowerCase();
      return nombreCompleto.includes(term); // case-insensitive substring
    });
  }, [searchTerm, procesos]);

  // Filtrar clientes - búsqueda mejorada por nombre
  

  const getStatusColor = (estado: string) => {
    if (estado === 'activo' || estado.includes('investigación')) return 'bg-yellow-100 text-yellow-800';
    if (estado === 'finalizado' || estado.includes('Cerrado')) return 'bg-green-100 text-green-800';
    if (estado.includes('negociación')) return 'bg-blue-100 text-blue-800';
    return 'bg-slate-100 text-slate-800';
  };

  // Handlers para usar la tabla unificada de procesos
  const handleView = (proceso: any) => {
    const procId =
      proceso.proceso_id || proceso.procesoId || proceso.proceso_ID ||
      proceso.id || proceso.ID || proceso.Id ||
      `PROC-${proceso.ID || proceso.id || 'N/A'}`;
    navigate(`/admin/procesos/${encodeURIComponent(String(procId))}?mode=view`);
  };

  const handleEdit = (proceso: any) => {
    const procId =
      proceso.proceso_id || proceso.procesoId || proceso.proceso_ID ||
      proceso.id || proceso.ID || proceso.Id ||
      `PROC-${proceso.ID || proceso.id || 'N/A'}`;
    navigate(`/admin/procesos/${encodeURIComponent(String(procId))}?mode=edit`);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('¿Está seguro de eliminar este proceso? Esta acción no se puede deshacer.')) {
      await deleteProcess(String(id));
    }
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
                className="h-12 sm:h-16 md:h-20"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Panel Administrativo</h1>
                <p className="text-xs sm:text-sm text-slate-600">Gestión de Procesos</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation (solo Procesos) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <div className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600 whitespace-nowrap">
              <FileText className="h-5 w-5 inline mr-2" />
              Procesos
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards - Solo mostrar en tab de procesos */}
        {
          <DashboardCards
            totalProcesos={stats.totalProcesos}
            procesosActivos={stats.procesosActivos}
            procesosEnNegociacion={stats.procesosEnNegociacion}
            procesosFinalizados={stats.procesosFinalizados}
            procesosEnRevision={stats.procesosEnRevision}
          />
        }

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 space-y-4 sm:space-y-0 gap-4">
          <SearchBar
            placeholder={'Buscar usuario'}
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full sm:flex-1"
          />
        </div>

        {/* Procesos Table - usar vista unificada */}
        {
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Todos los Procesos</h2>
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
              procesosRaw={procesosRaw}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        }
      </main>
    </div>
  );
};

export default Dashboard;

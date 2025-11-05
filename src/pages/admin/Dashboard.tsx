import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, LogOut, Calendar } from 'lucide-react';
import DashboardCards from '../../components/admin/DashboardCards';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { mockClientes } from '../../data/mocks';
import { useProcesses } from '../../hooks/useProcesses';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'clientes' | 'procesos'>('procesos');
  const [searchTerm, setSearchTerm] = useState('');

  // Usar hook personalizado para gestionar procesos
  const { procesos } = useProcesses();
  const clientes = mockClientes;

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
    const totalClientes = clientes.length;
    
    return {
      totalProcesos,
      procesosActivos,
      procesosFinalizados,
      procesosEnRevision,
      procesosEnNegociacion,
      totalClientes
    };
  }, [procesos, clientes]);

  // Filtrar procesos (mostrar todos desde el inicio)
  const filteredProcesos = useMemo(() => {
    const base = [...procesos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    if (!searchTerm) return base;
    const term = searchTerm.toLowerCase();
    return base.filter(p =>
      p.id.toLowerCase().includes(term) ||
      p.clienteNombre.toLowerCase().includes(term) ||
      p.estadoPublico.toLowerCase().includes(term) ||
      p.demandado.toLowerCase().includes(term)
    );
  }, [searchTerm, procesos]);

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    if (!searchTerm) return clientes;
    const term = searchTerm.toLowerCase();
    return clientes.filter(c =>
      c.nombre.toLowerCase().includes(term) ||
      c.cedula.includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  }, [searchTerm, clientes]);

  const getStatusColor = (estado: string) => {
    if (estado === 'activo' || estado.includes('investigación')) return 'bg-yellow-100 text-yellow-800';
    if (estado === 'finalizado' || estado.includes('Cerrado')) return 'bg-green-100 text-green-800';
    if (estado.includes('negociación')) return 'bg-blue-100 text-blue-800';
    return 'bg-slate-100 text-slate-800';
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
                <p className="text-xs sm:text-sm text-slate-600">Gestión de Clientes y Procesos</p>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('procesos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'procesos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Procesos
            </button>
            <button
              onClick={() => setActiveTab('clientes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'clientes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Clientes
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards - Solo mostrar en tab de procesos */}
        {activeTab === 'procesos' && (
          <DashboardCards
            totalClientes={stats.totalClientes}
            totalProcesos={stats.totalProcesos}
            procesosActivos={stats.procesosActivos}
            procesosEnNegociacion={stats.procesosEnNegociacion}
            procesosFinalizados={stats.procesosFinalizados}
            procesosEnRevision={stats.procesosEnRevision}
          />
        )}

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 space-y-4 sm:space-y-0 gap-4">
          <SearchBar
            placeholder={`Buscar ${activeTab}...`}
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full sm:flex-1"
          />
        </div>

        {/* Procesos Table */}
        {activeTab === 'procesos' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Todos los Procesos</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Proceso
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </Table.Header>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredProcesos.length === 0 ? (
                    <Table.Row>
                      <Table.Cell className="py-8 text-slate-500">No se encontraron procesos</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                    </Table.Row>
                  ) : (
                    filteredProcesos.map((proceso) => (
                      <Table.Row key={proceso.id} className="hover:bg-slate-50">
                        <Table.Cell>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{proceso.id}</div>
                            <div className="text-xs text-slate-500">Código: {proceso.codigoAcceso}</div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="text-sm text-slate-900">{proceso.clienteNombre}</div>
                          <div className="text-xs text-slate-500">CC: {proceso.cedula}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proceso.estadoPublico)}`}>
                            {proceso.estadoPublico}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="text-sm text-slate-900 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(proceso.fecha).toLocaleDateString('es-CO')}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/procesos/${proceso.id}`)}
                          >
                            Ver Detalle
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {/* Clientes Table */}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Clientes Registrados</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Procesos
                    </th>
                  </tr>
                </Table.Header>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredClientes.length === 0 ? (
                    <Table.Row>
                      <Table.Cell className="py-8 text-slate-500">No se encontraron clientes</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                      <Table.Cell>{''}</Table.Cell>
                    </Table.Row>
                  ) : (
                    filteredClientes.map((cliente) => {
                      const procesosDelCliente = procesos.filter(p => p.clienteId === cliente.id);
                      return (
                        <Table.Row key={cliente.id} className="hover:bg-slate-50">
                          <Table.Cell>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{cliente.nombre}</div>
                              <div className="text-xs text-slate-500">CC: {cliente.cedula}</div>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm text-slate-900">{cliente.telefono}</div>
                            <div className="text-xs text-slate-500">{cliente.email}</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm text-slate-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(cliente.fechaRegistro).toLocaleDateString('es-CO')}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="text-sm text-slate-900 font-medium">
                              {procesosDelCliente.length} proceso{procesosDelCliente.length !== 1 ? 's' : ''}
                            </span>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

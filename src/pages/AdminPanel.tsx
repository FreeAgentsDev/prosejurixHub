import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'cliente' | 'proceso'>('cliente');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock data
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: 'María González Pérez',
      cedula: '12345678',
      telefono: '300 123 4567',
      email: 'maria.gonzalez@email.com',
      direccion: 'Calle 50 #25-30, Manizales',
      fechaRegistro: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez López',
      cedula: '87654321',
      telefono: '301 987 6543',
      email: 'carlos.rodriguez@email.com',
      direccion: 'Carrera 15 #40-20, Manizales',
      fechaRegistro: '2024-01-10'
    }
  ]);

  const [procesos, setProcesos] = useState([
    {
      id: 1,
      clienteId: 1,
      clienteNombre: 'María González Pérez',
      fechaIngreso: '2024-01-15',
      estadoInterno: 'investigacion',
      estadoPublico: 'En investigación',
      observacionesInternas: 'Pendiente peritaje del vehículo. Contactar perito la próxima semana.',
      observacionesCliente: 'Estamos recopilando las pruebas necesarias para su caso. El peritaje del vehículo está programado para la próxima semana.',
      juzgado: 'Juzgado Civil del Circuito de Manizales',
      demandado: 'Seguros Bolívar S.A.',
      placaVehiculo: 'ABC123',
      valorHonorarios: 5000000,
      valorPeritaje: 800000,
      valorPrestamos: 0,
      gastosAdicionales: 200000,
      fechaRadicacion: '',
      codigoAcceso: 'ABC123'
    },
    {
      id: 2,
      clienteId: 1,
      clienteNombre: 'María González Pérez',
      fechaIngreso: '2023-11-20',
      estadoInterno: 'negociacion',
      estadoPublico: 'En negociación',
      observacionesInternas: 'Aseguradora ofreció $15M. Cliente quiere $20M. Programar reunión.',
      observacionesCliente: 'Hemos presentado la reclamación a la aseguradora. Esperamos respuesta en los próximos 15 días hábiles.',
      juzgado: '',
      demandado: 'SURA S.A.',
      placaVehiculo: 'XYZ789',
      valorHonorarios: 8000000,
      valorPeritaje: 1200000,
      valorPrestamos: 2000000,
      gastosAdicionales: 500000,
      fechaRadicacion: '',
      codigoAcceso: 'XYZ789'
    }
  ]);

  const estadosInternos = [
    { value: 'inicial', label: 'Evaluación Inicial' },
    { value: 'investigacion', label: 'En Investigación' },
    { value: 'negociacion', label: 'En Negociación' },
    { value: 'demanda', label: 'Demanda Presentada' },
    { value: 'audiencia', label: 'En Audiencia' },
    { value: 'sentencia', label: 'Sentencia' },
    { value: 'ejecucion', label: 'En Ejecución' },
    { value: 'cerrado', label: 'Caso Cerrado' }
  ];

  const handleLogout = () => {
    navigate('/admin');
  };

  const openModal = (type: 'cliente' | 'proceso', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cedula.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcesos = procesos.filter(proceso =>
    proceso.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.estadoPublico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.demandado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/prosejurix.png" 
                alt="Prosejurix Logo" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Panel Administrativo</h1>
                <p className="text-sm text-slate-600">Gestión de Clientes y Procesos</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('clientes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'clientes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Clientes
            </button>
            <button
              onClick={() => setActiveTab('procesos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'procesos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Procesos
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Buscar ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => openModal(activeTab as 'cliente' | 'proceso')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo {activeTab === 'clientes' ? 'Cliente' : 'Proceso'}
          </button>
        </div>

        {/* Clientes Table */}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{cliente.nombre}</div>
                          <div className="text-sm text-slate-500">CC: {cliente.cedula}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {cliente.telefono}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {cliente.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(cliente.fechaRegistro).toLocaleDateString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('cliente', cliente)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Procesos Table */}
        {activeTab === 'procesos' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Proceso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Demandado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredProcesos.map((proceso) => (
                    <tr key={proceso.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">Proceso #{proceso.id}</div>
                          <div className="text-sm text-slate-500">Código: {proceso.codigoAcceso}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{proceso.clienteNombre}</div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(proceso.fechaIngreso).toLocaleDateString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proceso.estadoInterno === 'investigacion' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : proceso.estadoInterno === 'negociacion'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {proceso.estadoPublico}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {proceso.demandado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('proceso', proceso)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                {editingItem ? 'Editar' : 'Nuevo'} {modalType === 'cliente' ? 'Cliente' : 'Proceso'}
              </h3>
              
              {modalType === 'cliente' ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={editingItem?.nombre || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Cédula/NIT
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={editingItem?.cedula || ''}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={editingItem?.telefono || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={editingItem?.email || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingItem?.direccion || ''}
                    />
                  </div>
                </form>
              ) : (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Cliente
                      </label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
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
                        Estado Interno
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={editingItem?.estadoInterno || ''}
                      >
                        <option value="">Seleccionar estado</option>
                        {estadosInternos.map(estado => (
                          <option key={estado.value} value={estado.value}>
                            {estado.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Estado Público (Para el cliente)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingItem?.estadoPublico || ''}
                      placeholder="Ej: En investigación"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Observaciones Internas
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingItem?.observacionesInternas || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Observaciones para el Cliente
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingItem?.observacionesCliente || ''}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Demandado
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={editingItem?.demandado || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Código de Acceso
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingItem?.codigoAcceso || ''}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.querySelector('input[defaultValue*="codigoAcceso"]') as HTMLInputElement;
                            if (input) input.value = generateAccessCode();
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                        >
                          Generar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
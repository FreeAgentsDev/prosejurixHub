import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, LogOut } from 'lucide-react';
import Card from '../common/Card';
import Table from '../common/Table';

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

  // Usar datos crudos de Supabase si están disponibles, sino usar processes
  const datosMostrar = procesosRaw && procesosRaw.length > 0 ? procesosRaw : processes;

  // Obtener las primeras 3 columnas/campos de los datos
  const obtenerPrimerasColumnas = () => {
    if (datosMostrar.length === 0) return [];
    
    const primerRegistro = datosMostrar[0];
    const columnas = Object.keys(primerRegistro);
    
    // Obtener las primeras 3 columnas (excluyendo campos internos si existen)
    const columnasFiltradas = columnas.filter(col => 
      !col.toLowerCase().includes('created_at') && 
      !col.toLowerCase().includes('updated_at')
    );
    
    return columnasFiltradas.slice(0, 3);
  };

  const columnasMostrar = obtenerPrimerasColumnas();

  const handleViewDetails = (proceso: any) => {
    // Obtener el ID del proceso de los datos crudos
    const procId = proceso.proceso_id || proceso.procesoId || proceso.proceso_ID || 
                   proceso.ID || proceso.id || proceso.Id || 
                   `PROC-${proceso.ID || proceso.id || 'N/A'}`;
    
    // Navegar a la página de detalle con el ID del proceso y los datos originales
    navigate(`/portal/proceso/${procId}`, {
      state: {
        procesos: procesosRaw || []
      }
    });
  };



  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/prosejurix-rounded.png"
                  alt="Prosejurix Logo"
                  className="h-10 w-10 rounded-full ring-2 ring-blue-100 shadow-sm"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Portal del Cliente</h1>
                <p className="text-sm text-slate-600">Prosejurix</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
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
              <span className="font-semibold text-blue-900">{datosMostrar.length}</span> proceso{datosMostrar.length !== 1 ? 's' : ''} encontrado{datosMostrar.length !== 1 ? 's' : ''}
            </div>
          </div>

          {datosMostrar.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-slate-500">No se encontraron procesos.</p>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Header>
                    <tr>
                      {columnasMostrar.map((columna) => (
                        <th key={columna} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {columna.replace(/_/g, ' ').replace(/\//g, ' / ')}
                        </th>
                      ))}
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </Table.Header>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {datosMostrar.map((proceso, index) => {
                      // Obtener el ID único para la key
                      const procId = proceso.proceso_id || proceso.procesoId || proceso.proceso_ID || 
                                   proceso.ID || proceso.id || proceso.Id || 
                                   `proceso-${index}`;
                      
                      return (
                        <Table.Row key={procId} className="hover:bg-slate-50">
                          {columnasMostrar.map((columna) => {
                            const valor = proceso[columna];
                            const valorFormateado = valor === null || valor === undefined 
                              ? 'N/A' 
                              : typeof valor === 'object' 
                                ? JSON.stringify(valor).substring(0, 50) + '...'
                                : String(valor);
                            
                            return (
                              <Table.Cell key={columna}>
                                <div className="text-sm text-slate-900 max-w-xs truncate" title={String(valor)}>
                                  {valorFormateado}
                      </div>
                              </Table.Cell>
                            );
                          })}
                          <Table.Cell>
                            <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewDetails(proceso)}
                                className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
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
          )}
        </div>


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


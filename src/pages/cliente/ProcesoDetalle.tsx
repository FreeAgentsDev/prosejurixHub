import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Building2, FileText, Tag, DollarSign, AlertCircle, Phone, Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';

const ProcesoDetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos del estado de navegación si vienen de la lista
  const { procesos: procesosFromState } = location.state || {};
  
  const [proceso, setProceso] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función helper para obtener valores de diferentes posibles nombres de columna
  const getValue = (obj: any, ...keys: string[]): any => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
    }
    return null;
  };

  // Función para formatear nombres de campo
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\//g, ' / ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Cargar proceso
  useEffect(() => {
    const loadProcess = async () => {
      if (!id) {
        navigate('/portal/proceso');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let procesoData = null;

        // Primero intentar obtener desde el estado de navegación
        if (procesosFromState && Array.isArray(procesosFromState)) {
          procesoData = procesosFromState.find((p: any) => {
            // Priorizar proceso_id (ID del proceso) sobre otros campos
            const procId = getValue(p, 'proceso_id', 'procesoId', 'PROCESO_ID', 'ID', 'id', 'Id');
            const procIdStr = procId ? String(procId) : '';
            
            // Formatear el ID priorizando proceso_id (como se hace en Proceso.tsx)
            const procIdFormatted = p.proceso_id || p.procesoId || p['PROCESO_ID'] || 
                                   p.ID || p.id || p.Id || 
                                   `PROC-${p.ID || p.id || 'N/A'}`;
            const procIdFormattedStr = String(procIdFormatted);
            
            // Comparar con diferentes formatos, priorizando proceso_id
            return String(procIdStr) === String(id) || 
                   procIdFormattedStr === String(id) ||
                   (String(id).startsWith('PROC-') && String(id).replace('PROC-', '') === procIdStr) ||
                   (procIdStr && String(id).includes(procIdStr));
          });
        }

        // Si no se encontró en el estado, buscar en Supabase
        // Priorizar búsqueda por proceso_id (ID del proceso)
        if (!procesoData && supabase) {
          // Primero intentar buscar por proceso_id (ID del proceso)
          const { data: foundDataByProcesoId, error: errorProcesoId } = await supabase
            .from('CTRANTECEDENTES')
            .select('*')
            .eq('proceso_id', id)
            .maybeSingle();
          
          if (foundDataByProcesoId && !errorProcesoId) {
            procesoData = foundDataByProcesoId;
          } else {
            // Si no se encuentra por proceso_id y el ID parece numérico, buscar por id numérico
            const numericId = Number(id);
            if (!isNaN(numericId)) {
              const { data: foundDataById, error: errorId } = await supabase
                .from('CTRANTECEDENTES')
                .select('*')
                .eq('id', numericId)
                .maybeSingle();
              
              if (foundDataById && !errorId) {
                procesoData = foundDataById;
              }
            }
          }
        }

        // Si aún no se encontró, intentar búsquedas adicionales por proceso_id
        if (!procesoData && supabase && id) {
          // Intentar buscar con diferentes variaciones, priorizando proceso_id
          const idStr = String(id);
          const searchTerms = [
            { field: 'proceso_id', value: idStr },
            { field: 'proceso_id', value: idStr.toUpperCase() },
            { field: 'proceso_id', value: idStr.toLowerCase() }
          ];

          for (const searchTerm of searchTerms) {
            try {
              const { data: foundData, error: searchError } = await supabase
                .from('CTRANTECEDENTES')
                .select('*')
                .eq(searchTerm.field, searchTerm.value)
                .maybeSingle();
              
              if (foundData && !searchError) {
                procesoData = foundData;
                break;
              }
            } catch (err) {
              // Continuar con el siguiente término de búsqueda
              continue;
            }
          }
        }

        if (procesoData) {
          setProceso(procesoData);
        } else {
          setError('No se encontró el proceso');
        }
      } catch (err) {
        console.error('Error al cargar proceso:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el proceso');
      } finally {
        setIsLoading(false);
      }
    };

    loadProcess();
  }, [id, navigate, procesosFromState]);

  // Si no existe, redirigir
  useEffect(() => {
    if (!isLoading && !proceso && !error && id) {
      navigate('/portal/proceso');
    }
  }, [proceso, isLoading, error, id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 mb-4">Cargando proceso...</p>
        </div>
      </div>
    );
  }

  if (error || !proceso) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold mb-2">Error al cargar el proceso</p>
          <p className="text-slate-600 mb-4">{error || 'No se encontró el proceso'}</p>
          <Button
            variant="primary"
            onClick={() => navigate('/portal/proceso')}
          >
            Volver a Mis Procesos
          </Button>
        </div>
      </div>
    );
  }

  // Obtener valores usando los helpers
  const procesoId = getValue(proceso, 'proceso_id', 'procesoId', 'Proceso ID', 'ID', 'id', 'Id') || id;
  const clienteNombre = getValue(proceso, 'NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'Cliente Nombre') || 'Cliente';
  const cedula = getValue(proceso, 'CÉDULA / NIT', 'CÉDULA_NIT', 'cedula_nit', 'cedula', 'Cedula', 'CEDULA', 'nit', 'NIT') || '';
  const estado = getValue(proceso, 'Estado', 'estado', 'ESTADO', 'estado_publico', 'estadoPublico') || 'Sin estado';
  const tipo = getValue(proceso, 'CLASE DE PROCESO', 'CLASE_DE_PROCESO', 'clase_proceso', 'tipo', 'Tipo') || 'Sin tipo';
  const fechaIngreso = getValue(proceso, 'FECHA DE INGRESO', 'fecha_ingreso', 'fechaIngreso', 'Fecha Ingreso', 'created_at') || '';
  const fechaAccidente = getValue(proceso, 'FECHA DE ACCIDENTE', 'FECHA_DE_ACCIDENTE', 'fecha_accidente', 'fecha') || '';
  const observaciones = getValue(proceso, 'observaciones', 'Observaciones', 'OBSERVACIONES', 'observaciones_cliente', 'OBSERVACIONES_CLIENTE') || '';
  const demandado = getValue(proceso, 'demandado', 'Demandado', 'DEMANDADO') || '';
  const juzgado = getValue(proceso, 'juzgado', 'Juzgado', 'JUZGADO') || '';
  const codigoAcceso = getValue(proceso, 'codigo_acceso', 'codigoAcceso', 'Código Acceso', 'CODIGO_ACCESO') || '';
  const radicado = getValue(proceso, 'RADICADO', 'radicado', 'Radicado') || '';
  
  // Campos adicionales
  const celular = getValue(proceso, 'celular', 'Celular', 'CELULAR', 'telefono_celular') || '';
  const telefono = getValue(proceso, 'telefono', 'Telefono', 'TELEFONO', 'telefono_fijo') || '';
  const correo = getValue(proceso, 'correo', 'Correo', 'CORREO', 'email', 'Email', 'EMAIL') || '';
  const direccion = getValue(proceso, 'direccion', 'Direccion', 'DIRECCION', 'dirección') || '';
  const ciudad = getValue(proceso, 'ciudad', 'Ciudad', 'CIUDAD') || '';
  const placaVehiculo = getValue(proceso, 'placa_vehiculo', 'placaVehiculo', 'Placa Vehículo', 'PLACA', 'placa') || '';
  const valorHonorarios = getValue(proceso, 'valor_honorarios', 'valorHonorarios', 'Valor Honorarios', 'honorarios') || '';
  const valorPeritaje = getValue(proceso, 'valor_peritaje', 'valorPeritaje', 'Valor Peritaje', 'peritaje') || '';
  const valorPrestamos = getValue(proceso, 'valor_prestamos', 'valorPrestamos', 'Valor Préstamos', 'prestamos') || '';
  const gastosAdicionales = getValue(proceso, 'gastos_adicionales', 'gastosAdicionales', 'Gastos Adicionales', 'gastos') || '';
  const fechaRadicacion = getValue(proceso, 'fecha_radicacion', 'fechaRadicacion', 'Fecha Radicación', 'FECHA_RADICACION') || '';

  // Obtener todos los campos adicionales que no están mapeados
  const camposAdicionales = Object.entries(proceso)
    .filter(([key]) => {
      const k = key.toLowerCase();
      return ![
        'id', 'proceso_id', 'procesoid', 'nombre', 'cliente_nombre', 'clientenombre',
        'cédula', 'cedula', 'nit', 'cédula / nit', 'cedula_nit',
        'estado', 'estado_publico', 'estadopublico',
        'clase de proceso', 'clase_de_proceso', 'tipoproceso', 'tipo',
        'fecha de ingreso', 'fecha_ingreso', 'fechaingreso', 'created_at',
        'fecha de accidente', 'fecha_de_accidente', 'fechaaccidente', 'fecha',
        'observaciones', 'observaciones_cliente', 'observacionescliente',
        'demandado', 'juzgado', 'codigo_acceso', 'codigoacceso',
        'radicado', 'celular', 'telefono', 'correo', 'email',
        'direccion', 'dirección', 'ciudad', 'placa_vehiculo', 'placavehiculo', 'placa',
        'valor_honorarios', 'valorhonorarios', 'honorarios',
        'valor_peritaje', 'valorperitaje', 'peritaje',
        'valor_prestamos', 'valorprestamos', 'prestamos',
        'gastos_adicionales', 'gastosadicionales', 'gastos',
        'fecha_radicacion', 'fecharadicacion', 'updated_at'
      ].includes(k);
    })
    .map(([key, value]) => ({ key, value }));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/portal/proceso', { state: location.state })}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Detalle del Proceso {String(procesoId)}</h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Vista completa del proceso
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Vista de información actual */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{String(procesoId)}</h2>
                <p className="text-blue-100 text-sm mt-1">Información del Proceso</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-medium">{estado}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Información del Cliente */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Información del Cliente</h3>
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Cliente</p>
                    <p className="text-sm text-slate-900 font-medium">{clienteNombre || 'No especificado'}</p>
                  </div>
                </div>
                {cedula && (
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Cédula / NIT</p>
                      <p className="text-sm text-slate-900">{cedula}</p>
                    </div>
                  </div>
                )}
                {celular && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Celular</p>
                      <p className="text-sm text-slate-900">{celular}</p>
                    </div>
                  </div>
                )}
                {telefono && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Teléfono</p>
                      <p className="text-sm text-slate-900">{telefono}</p>
                    </div>
                  </div>
                )}
                {correo && (
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Correo</p>
                      <p className="text-sm text-slate-900">{correo}</p>
                    </div>
                  </div>
                )}
                {direccion && (
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Dirección</p>
                      <p className="text-sm text-slate-900">{direccion}</p>
                    </div>
                  </div>
                )}
                {ciudad && (
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Ciudad</p>
                      <p className="text-sm text-slate-900">{ciudad}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información del Proceso */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Información del Proceso</h3>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">ID Proceso</p>
                    <p className="text-sm text-slate-900 font-mono">{String(procesoId)}</p>
                  </div>
                </div>
                {codigoAcceso && (
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Código de Acceso</p>
                      <p className="text-sm text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded">{codigoAcceso}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Tipo</p>
                    <p className="text-sm text-slate-900 capitalize">{tipo || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Estado</p>
                    <p className="text-sm text-slate-900">{estado || 'No especificado'}</p>
                  </div>
                </div>
                {radicado && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Radicado</p>
                      <p className="text-sm text-slate-900">{radicado}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información Legal */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Información Legal</h3>
                {demandado && (
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Demandado</p>
                      <p className="text-sm text-slate-900">{demandado}</p>
                    </div>
                  </div>
                )}
                {juzgado && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Juzgado</p>
                      <p className="text-sm text-slate-900">{juzgado}</p>
                    </div>
                  </div>
                )}
                {placaVehiculo && (
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Placa Vehículo</p>
                      <p className="text-sm text-slate-900 font-mono">{placaVehiculo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fechas */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Fechas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fechaIngreso && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Fecha de Ingreso</p>
                      <p className="text-sm text-slate-900">
                        {new Date(fechaIngreso).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {fechaAccidente && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Fecha del Accidente</p>
                      <p className="text-sm text-slate-900">
                        {new Date(fechaAccidente).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {fechaRadicacion && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Fecha de Radicación</p>
                      <p className="text-sm text-slate-900">
                        {new Date(fechaRadicacion).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Valores Económicos */}
            {(valorHonorarios || valorPeritaje || valorPrestamos || gastosAdicionales) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Valores Económicos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {valorHonorarios && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Honorarios</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(Number(valorHonorarios))}
                      </p>
                    </div>
                  )}
                  {valorPeritaje && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Peritaje</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(Number(valorPeritaje))}
                      </p>
                    </div>
                  )}
                  {valorPrestamos && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Préstamos</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(Number(valorPrestamos))}
                      </p>
                    </div>
                  )}
                  {gastosAdicionales && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Gastos Adicionales</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(Number(gastosAdicionales))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Observaciones */}
            {observaciones && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Observaciones</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{observaciones}</p>
                </div>
              </div>
            )}

            {/* Campos Adicionales */}
            {camposAdicionales.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {camposAdicionales.map(({ key, value }) => (
                    <div key={key} className="bg-slate-50 rounded p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase">{formatFieldName(key)}</p>
                      <p className="text-sm text-slate-900 mt-1">
                        {value === null || value === undefined || value === '' 
                          ? 'No disponible' 
                          : typeof value === 'object' 
                            ? JSON.stringify(value) 
                            : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcesoDetalleCliente;


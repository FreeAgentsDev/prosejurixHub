import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, User, Building2, FileText, Tag, DollarSign, AlertCircle, Phone, Mail } from 'lucide-react';
import ProcessForm from '../../components/admin/ProcessForm';
import Button from '../../components/common/Button';
import { mockClientes, estadosInternos } from '../../data/mocks';
import { useProcesses } from '../../hooks/useProcesses';
import * as api from '../../services/api';
import { transformSupabaseToMock } from '../../hooks/useProcesses';
import { ControlProcesoAntecedente } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { detectTableAndIdType } from '../../lib/supabaseInspector';

const ProcesoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view'; // 'view' o 'edit'
  const { updateProcess } = useProcesses();

  const [proceso, setProceso] = useState<any>(null);
  const [rawProcessData, setRawProcessData] = useState<ControlProcesoAntecedente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  // Función helper para obtener valores de diferentes posibles nombres de columna
  const getValue = (obj: any, ...keys: string[]): any => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
    }
    return null;
  };

  // Cargar proceso completo desde Supabase por ID
  useEffect(() => {
    const loadProcess = async () => {
      if (!id) {
        navigate('/admin/procesos');
        return;
      }

      // Validar ID antes de procesar
      if (id.trim().length < 1) {
        setError('ID inválido: El ID no puede estar vacío');
        setIsLoading(false);
        return;
      }

      // Decodificar el ID si viene codificado en la URL
      const decodedId = decodeURIComponent(id);
      console.log('🔍 Buscando proceso con ID:', decodedId);

      setIsLoading(true);
      setError(null);

      try {
        let procesoData = null;

        // Primero intentar buscar directamente en Supabase por ID
        if (supabase) {
          // Detectar tabla y tipo de ID
          const tableInfo = await detectTableAndIdType();
          console.log('📡 Buscando en Supabase por proceso_id:', decodedId);
          
          // Prioridad 1: Buscar por proceso_id (si existe)
          const { data: foundByProcesoId, error: errorProcesoId } = await supabase
            .from(tableInfo.tableName)
            .select('*')
            .eq('proceso_id', decodedId)
            .maybeSingle();
          
          if (foundByProcesoId && !errorProcesoId) {
            console.log('✅ Proceso encontrado por proceso_id:', foundByProcesoId);
            procesoData = foundByProcesoId;
          } else {
            // Prioridad 2: Si no se encuentra por proceso_id, intentar por id según su tipo
            console.log('⚠️ No encontrado por proceso_id, intentando por columna ID');
            
            // Convertir el ID al tipo correcto según la detección
            let searchId: number | string = decodedId;
            if (tableInfo.idType === 'number') {
              const numericId = Number(decodedId);
              if (!isNaN(numericId)) {
                searchId = numericId;
                console.log(`📡 Buscando por ${tableInfo.idColumnName} (numérico):`, searchId);
              } else {
                console.log('⚠️ ID no es numérico, no se puede buscar por columna numérica');
                searchId = decodedId; // Mantener como string
              }
            } else {
              searchId = String(decodedId);
              console.log(`📡 Buscando por ${tableInfo.idColumnName} (string):`, searchId);
            }
            
            const { data: foundById, error: errorId } = await supabase
              .from(tableInfo.tableName)
              .select('*')
              .eq(tableInfo.idColumnName, searchId)
              .maybeSingle();
            
            if (foundById && !errorId) {
              console.log('✅ Proceso encontrado por columna ID:', foundById);
              procesoData = foundById;
            }
          }
        }

        // Si se encontró en Supabase, usar esos datos
        if (procesoData) {
          console.log('✅ Usando datos encontrados en Supabase');
          setRawProcessData(procesoData);
          const transformedProcess = transformSupabaseToMock(procesoData);
          setProceso(transformedProcess);
        } else {
          console.log('⚠️ No se encontró en Supabase, intentando con la API como fallback');
          
          // Si no se encontró en Supabase, intentar con la API como fallback
          // La API ahora acepta tanto IDs numéricos como proceso_id strings
          try {
            const response = await api.getRecordById(decodedId);
            const rawData = response.data;
            
            if (rawData) {
              console.log('✅ Datos obtenidos desde la API:', rawData);
              setRawProcessData(rawData);
              const transformedProcess = transformSupabaseToMock(rawData);
              setProceso(transformedProcess);
            } else {
              console.error('❌ No se encontró el proceso en la API (respuesta vacía)');
              setError('No se encontró el proceso con el ID proporcionado. Verifica que el ID sea correcto.');
            }
          } catch (apiError) {
            console.error('❌ Error al obtener el proceso desde la API:', apiError);
            const errorMessage = apiError instanceof Error ? apiError.message : 'Error desconocido';
            
            // Distinguir diferentes tipos de errores con mensajes claros
            if (errorMessage.includes('No se encontró') || errorMessage.includes('404')) {
              setError(`No se encontró el proceso con ID "${decodedId}". Verifica el ID o contacta al administrador.`);
            } else if (errorMessage.includes('Error del servidor') || errorMessage.includes('500')) {
              setError('Error del servidor. Por favor, intente más tarde.');
            } else if (errorMessage.includes('Error de validación') || errorMessage.includes('400')) {
              setError(`Error de validación: El ID "${decodedId}" no es válido. Verifica el formato del ID.`);
            } else {
              setError(`Error al cargar el proceso con ID "${decodedId}": ${errorMessage}`);
            }
          }
        }
      } catch (err) {
        console.error('Error al cargar proceso:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        
        // Mensaje de error más descriptivo
        if (errorMessage.includes('Tabla') && errorMessage.includes('no encontrada')) {
          setError(`Error de configuración: ${errorMessage}`);
        } else if (errorMessage.includes('No se encontró')) {
          setError(`No se encontró el proceso con ID "${decodedId}". Verifica el ID o contacta al administrador.`);
        } else {
          setError(`Error al cargar el proceso: ${errorMessage}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProcess();
  }, [id, navigate, supabase]);

  // Si no existe, redirigir
  useEffect(() => {
    if (!isLoading && !proceso && !error && id) {
      navigate('/admin/procesos');
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
            onClick={() => navigate('/admin/procesos')}
          >
            Volver a Procesos
          </Button>
        </div>
      </div>
    );
  }

  // Obtener datos originales completos para mostrar todos los campos
  const rawData = rawProcessData || proceso as any;

  const handleSubmit = async (data: any) => {
    const cliente = mockClientes.find(c => c.id === data.clienteId);
    
    try {
      await updateProcess(proceso.id, {
        clienteId: data.clienteId,
        clienteNombre: cliente?.nombre || proceso.clienteNombre || '',
        cedula: data.cedula || cliente?.cedula || proceso.cedula || '',
        celular: data.celular,
        telefono: data.telefono,
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
      } as any);
      
      // Recargar los datos del proceso
      if (id) {
        try {
          // La API ahora acepta tanto IDs numéricos como proceso_id strings
          const decodedId = decodeURIComponent(id);
          const response = await api.getRecordById(decodedId);
          if (response.data) {
            // Guardar los datos originales completos
            setRawProcessData(response.data);
            // Transformar los datos al formato esperado
            const transformedProcess = transformSupabaseToMock(response.data);
            setProceso(transformedProcess);
          }
        } catch (err) {
          console.error('Error al recargar proceso:', err);
        }
      }
      
      // Volver a modo vista después de actualizar
      setIsEditing(false);
    } catch (error) {
      alert('Error al actualizar el proceso. Por favor, intente nuevamente.');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/procesos')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Detalle del Proceso {proceso.id}</h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  {isEditing ? 'Editando información del proceso' : 'Vista completa del proceso'}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Proceso
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Vista de información actual */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{proceso.id}</h2>
                <p className="text-blue-100 text-sm mt-1">Información del Proceso</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-medium">{proceso.estadoPublico}</span>
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
                    <p className="text-sm text-slate-900 font-medium">{proceso.clienteNombre || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Cédula</p>
                    <p className="text-sm text-slate-900">{proceso.cedula || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">ID Cliente</p>
                    <p className="text-sm text-slate-900">{proceso.clienteId || 'N/A'}</p>
                  </div>
                </div>
                {(rawData.celular || rawData.telefono) && (
                  <>
                    {rawData.celular && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500">Celular</p>
                          <p className="text-sm text-slate-900">{rawData.celular}</p>
                        </div>
                      </div>
                    )}
                    {rawData.telefono && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500">Teléfono</p>
                          <p className="text-sm text-slate-900">{rawData.telefono}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Información del Proceso */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Información del Proceso</h3>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">ID Proceso</p>
                    <p className="text-sm text-slate-900 font-mono">{proceso.id}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Código de Acceso</p>
                    <p className="text-sm text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded">{proceso.codigoAcceso || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Tipo</p>
                    <p className="text-sm text-slate-900 capitalize">{proceso.tipo || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Estado Interno</p>
                    <p className="text-sm text-slate-900 capitalize">{proceso.estado || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Estado Público</p>
                    <p className="text-sm text-slate-900">{proceso.estadoPublico || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              {/* Información Legal */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Información Legal</h3>
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Demandado</p>
                    <p className="text-sm text-slate-900">{proceso.demandado || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Juzgado</p>
                    <p className="text-sm text-slate-900">{proceso.juzgado || 'No especificado'}</p>
                  </div>
                </div>
                {proceso.placaVehiculo && (
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Placa Vehículo</p>
                      <p className="text-sm text-slate-900 font-mono">{proceso.placaVehiculo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rawData.created_at && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Fecha de Creación</p>
                      <p className="text-sm text-slate-900">
                        {new Date(rawData.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {rawData.updated_at && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Última Actualización</p>
                      <p className="text-sm text-slate-900">
                        {new Date(rawData.updated_at).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {rawData.id && (
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">ID Base de Datos</p>
                      <p className="text-sm text-slate-900 font-mono">{rawData.id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fechas */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Fechas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Fecha de Ingreso</p>
                    <p className="text-sm text-slate-900">
                      {proceso.fechaIngreso ? new Date(proceso.fechaIngreso).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'No especificado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Fecha del Proceso</p>
                    <p className="text-sm text-slate-900">
                      {proceso.fecha ? new Date(proceso.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'No especificado'}
                    </p>
                  </div>
                </div>
                {proceso.fechaRadicacion && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Fecha de Radicación</p>
                      <p className="text-sm text-slate-900">
                        {new Date(proceso.fechaRadicacion).toLocaleDateString('es-CO', {
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
            {(proceso.valorHonorarios || proceso.valorPeritaje || proceso.valorPrestamos || proceso.gastosAdicionales) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Valores Económicos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {proceso.valorHonorarios !== undefined && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Honorarios</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(proceso.valorHonorarios)}
                      </p>
                    </div>
                  )}
                  {proceso.valorPeritaje !== undefined && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Peritaje</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(proceso.valorPeritaje)}
                      </p>
                    </div>
                  )}
                  {proceso.valorPrestamos !== undefined && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Préstamos</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(proceso.valorPrestamos)}
                      </p>
                    </div>
                  )}
                  {proceso.gastosAdicionales !== undefined && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Gastos Adicionales</p>
                      <p className="text-sm text-slate-900 font-semibold">
                        ${new Intl.NumberFormat('es-CO').format(proceso.gastosAdicionales)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Observaciones</h3>
              <div className="space-y-4">
                {proceso.observaciones ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Observaciones Generales</p>
                    <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded whitespace-pre-wrap">{proceso.observaciones}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Observaciones Generales</p>
                    <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded">No hay observaciones generales</p>
                  </div>
                )}
                {proceso.observacionesInternas ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Observaciones Internas</p>
                    <p className="text-sm text-slate-900 bg-blue-50 p-3 rounded whitespace-pre-wrap">{proceso.observacionesInternas}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Observaciones Internas</p>
                    <p className="text-sm text-slate-400 italic bg-blue-50 p-3 rounded">No hay observaciones internas</p>
                  </div>
                )}
                {proceso.observacionesCliente ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Observaciones para el Cliente</p>
                    <p className="text-sm text-slate-900 bg-green-50 p-3 rounded whitespace-pre-wrap">{proceso.observacionesCliente}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Observaciones para el Cliente</p>
                    <p className="text-sm text-slate-400 italic bg-green-50 p-3 rounded">No hay observaciones para el cliente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de edición - Solo mostrar si está en modo edición */}
        {isEditing ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Editar Información</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancelar Edición
              </Button>
            </div>
            <ProcessForm
              initialData={{
                clienteId: proceso.clienteId,
                cedula: proceso.cedula,
                celular: rawData?.celular || '',
                telefono: rawData?.telefono || '',
                estadoInterno: proceso.estado,
                estadoPublico: proceso.estadoPublico,
                tipo: proceso.tipo,
                fecha: proceso.fecha,
                fechaIngreso: proceso.fechaIngreso,
                demandado: proceso.demandado,
                codigoAcceso: proceso.codigoAcceso,
                observaciones: proceso.observaciones,
                observacionesInternas: proceso.observacionesInternas,
                observacionesCliente: proceso.observacionesCliente,
                juzgado: proceso.juzgado,
                placaVehiculo: proceso.placaVehiculo,
                valorHonorarios: proceso.valorHonorarios,
                valorPeritaje: proceso.valorPeritaje,
                valorPrestamos: proceso.valorPrestamos,
                gastosAdicionales: proceso.gastosAdicionales,
                fechaRadicacion: proceso.fechaRadicacion
              }}
              clientes={mockClientes.map(c => ({ id: c.id, nombre: c.nombre }))}
              estadosInternos={estadosInternos}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ProcesoDetalle;


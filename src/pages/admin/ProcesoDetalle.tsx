import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Building2, FileText, Tag, DollarSign, AlertCircle, Phone, Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import ProcessForm from '../../components/admin/ProcessForm';
import * as api from '../../services/api';
import { transformSupabaseToMock } from '../../hooks/useProcesses';
import { mockClientes, estadosInternos } from '../../data/mocks';
import { useProcesses } from '../../hooks/useProcesses';
import { ControlProcesoAntecedente } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { detectTableAndIdType } from '../../lib/supabaseInspector';

const ProcesoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
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

  // Valores derivados desde la tabla (rawData) con fallback a transformado
  const view_procesoId = getValue(rawData, 'proceso_id', 'procesoId', 'PROCESO_ID', 'ID', 'id', 'Id') || proceso?.id;
  const view_clienteNombre = getValue(rawData, 'NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'Cliente Nombre') || proceso?.clienteNombre;
  const view_cedula = getValue(rawData, 'CÉDULA / NIT', 'CÉDULA_NIT', 'cedula_nit', 'cedula', 'Cedula', 'CEDULA', 'nit', 'NIT') || proceso?.cedula;
  const view_clienteId = getValue(rawData, 'cliente_id', 'clienteId', 'CLIENTE_ID') || proceso?.clienteId;
  const view_celular = getValue(rawData, 'celular', 'Celular', 'CELULAR', 'telefono_celular') || rawData?.celular;
  const view_telefono = getValue(rawData, 'telefono', 'Telefono', 'TELEFONO', 'telefono_fijo') || rawData?.telefono;
  const view_codigoAcceso = getValue(rawData, 'codigo_acceso', 'codigoAcceso', 'CODIGO_ACCESO') || proceso?.codigoAcceso;
  const view_tipo = getValue(rawData, 'CLASE DE PROCESO', 'CLASE_DE_PROCESO', 'clase_proceso', 'tipo', 'Tipo') || proceso?.tipo;
  const view_estadoInterno = getValue(rawData, 'estado', 'Estado', 'ESTADO') || proceso?.estado;
  const view_estadoPublico = getValue(rawData, 'estado_publico', 'estadoPublico', 'Estado Público') || proceso?.estadoPublico;
  const view_demandado = getValue(rawData, 'demandado', 'Demandado', 'DEMANDADO') || proceso?.demandado;
  const view_juzgado = getValue(rawData, 'juzgado', 'Juzgado', 'JUZGADO') || proceso?.juzgado;
  const view_placaVehiculo = getValue(rawData, 'placa_vehiculo', 'placaVehiculo', 'Placa Vehículo', 'PLACA', 'placa') || proceso?.placaVehiculo;
  const view_fechaIngreso = getValue(rawData, 'fecha_ingreso', 'FECHA DE INGRESO', 'fechaIngreso', 'created_at') || proceso?.fechaIngreso;
  const view_fecha = getValue(rawData, 'fecha', 'FECHA', 'fecha_accidente', 'FECHA DE ACCIDENTE') || proceso?.fecha;
  const view_fechaRadicacion = getValue(rawData, 'fecha_radicacion', 'fechaRadicacion', 'Fecha Radicación', 'FECHA_RADICACION') || proceso?.fechaRadicacion;
  const view_correo = getValue(rawData, 'correo', 'Correo', 'CORREO', 'email', 'Email', 'EMAIL');
  const view_direccion = getValue(rawData, 'direccion', 'Direccion', 'DIRECCION', 'dirección');
  const view_ciudad = getValue(rawData, 'ciudad', 'Ciudad', 'CIUDAD');
  const view_radicado = getValue(rawData, 'radicado', 'RADICADO', 'Radicado');

  // Normalizador de claves para evitar duplicados por acentos o formatos
  const normalizeKey = (key: string): string => {
    return String(key)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // quita acentos
      .replace(/[^a-z0-9]+/g, '_')     // reemplaza separadores por _
      .replace(/^_+|_+$/g, '');        // recorta guiones bajos extremos
  };

  // Conjunto de claves que ya se muestran arriba (sin duplicados, normalizadas)
  const shownKeysNormalized = new Set<string>([
    // Identificadores
    'id','proceso_id','cliente_id',
    // Cliente
    'cliente_nombre','nombre','cedula','cedula_nit','nit','cedula_nit','cedula__nit',
    'celular','telefono','telefono_fijo','telefono_celular',
    // Proceso
    'codigo_acceso','tipo','clase_de_proceso','clase_proceso',
    'estado','estado_publico',
    // Legal
    'demandado','juzgado','placa_vehiculo','placa',
    // Fechas
    'fecha','fecha_accidente','fecha_ingreso','created_at','fecha_radicacion',
  ]);

  // UI helpers: chips de color para estado y tipo
  const chipClass =
    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border';
  const estadoChipClass = (estado: string | null | undefined) => {
    const v = String(estado || '').toLowerCase();
    if (v.includes('final')) return `${chipClass} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (v.includes('espera') || v.includes('revision') || v.includes('revisión'))
      return `${chipClass} bg-amber-50 text-amber-700 border-amber-200`;
    if (v.includes('negoci')) return `${chipClass} bg-sky-50 text-sky-700 border-sky-200`;
    if (v.includes('error') || v.includes('rechaz'))
      return `${chipClass} bg-rose-50 text-rose-700 border-rose-200`;
    return `${chipClass} bg-indigo-50 text-indigo-700 border-indigo-200`;
  };

  const tipoChipClass = (tipo: string | null | undefined) => {
    const v = String(tipo || '').toLowerCase();
    if (v.includes('civil')) return `${chipClass} bg-blue-50 text-blue-700 border-blue-200`;
    if (v.includes('penal')) return `${chipClass} bg-rose-50 text-rose-700 border-rose-200`;
    if (v.includes('laboral')) return `${chipClass} bg-amber-50 text-amber-700 border-amber-200`;
    if (v.includes('comercial')) return `${chipClass} bg-emerald-50 text-emerald-700 border-emerald-200`;
    return `${chipClass} bg-slate-50 text-slate-700 border-slate-200`;
  };

  // Elegir icono por clave normalizada
  const getIconForKey = (nk: string) => {
    if (nk.includes('fecha')) return <Calendar className="h-4 w-4 text-blue-600" />;
    if (nk.includes('telefono') || nk.includes('celular')) return <Phone className="h-4 w-4 text-blue-600" />;
    if (nk.includes('correo') || nk.includes('email')) return <Mail className="h-4 w-4 text-blue-600" />;
    if (nk.includes('valor') || nk.includes('monto') || nk.includes('precio')) return <DollarSign className="h-4 w-4 text-blue-600" />;
    if (nk.includes('ciudad') || nk.includes('direccion') || nk.includes('ubicacion') || nk.includes('lugar')) return <Building2 className="h-4 w-4 text-blue-600" />;
    if (nk.includes('juzgado') || nk.includes('fiscalia') || nk.includes('radicado')) return <FileText className="h-4 w-4 text-blue-600" />;
    if (nk.includes('placa')) return <Tag className="h-4 w-4 text-blue-600" />;
    return <Tag className="h-4 w-4 text-blue-600" />;
  };

  const handleSubmit = async (data: any) => {
    const cliente = mockClientes.find(c => c.id === data.clienteId);
    
    try {
      await updateProcess(proceso.id, {
        clienteId: data.clienteId,
        clienteNombre: data.clienteNombre || cliente?.nombre || proceso.clienteNombre || '',
        cedula: data.cedula || cliente?.cedula || proceso.cedula || '',
        celular: data.celular,
        telefono: data.telefono,
        correo: data.correo,
        direccion: data.direccion,
        ciudad: data.ciudad,
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
        fechaRadicacion: data.fechaRadicacion,
        radicado: data.radicado
      } as any);
      
      // Recargar los datos del proceso
      if (id) {
        try {
          const decodedId = decodeURIComponent(id);
          const response = await api.getRecordById(decodedId);
          if (response.data) {
            setRawProcessData(response.data);
            const transformedProcess = transformSupabaseToMock(response.data);
            setProceso(transformedProcess);
          }
        } catch (err) {
          console.error('Error al recargar proceso:', err);
        }
      }
      
      setIsEditing(false);
      // Volver a modo vista en la URL
      navigate(`/admin/procesos/${encodeURIComponent(String(proceso.id))}?mode=view`);
    } catch (error) {
      alert('Error al actualizar el proceso. Por favor, intente nuevamente.');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    navigate(`/admin/procesos/${encodeURIComponent(String(proceso.id))}?mode=view`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/procesos')}
                className="flex items-center justify-center w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white hover:scale-105 active:scale-95"
                aria-label="Volver a la lista de procesos"
                title="Volver"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Detalle del Proceso {view_clienteNombre ? `${view_clienteNombre} · ` : ''}{String(view_procesoId)}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs sm:text-sm text-slate-600">{isEditing ? 'Editando información del proceso' : 'Vista completa del proceso'}</span>
                  {view_tipo && (
                    <span className={tipoChipClass(view_tipo)}>{view_tipo}</span>
                  )}
                  {view_estadoPublico && (
                    <span className={estadoChipClass(view_estadoPublico)}>{view_estadoPublico}</span>
                  )}
                  {view_codigoAcceso && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                      {String(view_codigoAcceso)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Vista de información actual - oculta en modo edición */}
        {!isEditing && (
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{view_clienteNombre || 'Cliente'}</h2>
                <p className="text-blue-100 text-sm mt-1">ID Proceso: {String(view_procesoId)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-white font-medium">{view_estadoPublico}</span>
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
                      <p className="text-sm text-slate-900 font-medium">{view_clienteNombre || 'No especificado'}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Cédula</p>
                      <p className="text-sm text-slate-900">{view_cedula || 'No especificado'}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">ID Cliente</p>
                      <p className="text-sm text-slate-900">{view_clienteId || 'N/A'}</p>
                    </div>
                  </div>
                  {(view_celular || view_telefono) && (
                  <>
                      {view_celular && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500">Celular</p>
                            <p className="text-sm text-slate-900">{view_celular}</p>
                          </div>
                      </div>
                    )}
                      {view_telefono && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500">Teléfono</p>
                            <p className="text-sm text-slate-900">{view_telefono}</p>
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
                      <p className="text-sm text-slate-900 font-mono">{String(view_procesoId)}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Código de Acceso</p>
                      <p className="text-sm text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded">{view_codigoAcceso || 'No especificado'}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Tipo</p>
                      <div className="mt-1">
                        <span className={tipoChipClass(view_tipo)}>
                          {view_tipo || 'No especificado'}
                        </span>
                      </div>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Estado Interno</p>
                      <div className="mt-1">
                        <span className={estadoChipClass(view_estadoInterno)}>
                          {view_estadoInterno || 'No especificado'}
                        </span>
                      </div>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Estado Público</p>
                      <div className="mt-1">
                        <span className={estadoChipClass(view_estadoPublico)}>
                          {view_estadoPublico || 'No especificado'}
                        </span>
                      </div>
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
                      <p className="text-sm text-slate-900">{view_demandado || 'No especificado'}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500">Juzgado</p>
                      <p className="text-sm text-slate-900">{view_juzgado || 'No especificado'}</p>
                    </div>
                  </div>
                  {view_placaVehiculo && (
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Placa Vehículo</p>
                      <p className="text-sm text-slate-900 font-mono">{view_placaVehiculo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Todos los campos adicionales de la tabla */}
            {rawData && (() => {
              const camposAdicionales = Object.entries(rawData)
                  .filter(([key]) => !shownKeysNormalized.has(normalizeKey(String(key))))
                .filter(([_, value]) => value !== null && value !== undefined && value !== '')
                .map(([key, value]) => ({ key, value }));
              if (camposAdicionales.length === 0) return null;
              const formatFieldName = (fieldName: string): string => {
                  return String(fieldName)
                  .replace(/_/g, ' ')
                  .replace(/\//g, ' / ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
              };
              return (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Todos los Campos de la Tabla</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {camposAdicionales.map(({ key, value }) => {
                        const nk = normalizeKey(String(key));
                        return (
                          <div key={String(key)} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-start space-x-3">
                              <div className="mt-0.5">{getIconForKey(nk)}</div>
                              <div className="flex-1">
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{formatFieldName(String(key))}</p>
                                <p className="text-sm text-slate-900 mt-1 break-words leading-6">
                          {value === null || value === undefined || value === '' 
                            ? 'No disponible' 
                            : typeof value === 'object' 
                              ? JSON.stringify(value, null, 2) 
                              : String(value)}
                        </p>
                      </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        )}

        {/* Formulario de edición - Solo mostrar si está en modo edición */}
        {isEditing ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Editar Información</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancelar Edición
              </Button>
            </div>
            <ProcessForm
              initialData={{
                clienteId: getValue(rawData, 'cliente_id', 'clienteId', 'CLIENTE_ID') || proceso.clienteId,
                clienteNombre: view_clienteNombre || proceso.clienteNombre,
                cedula: getValue(rawData, 'CÉDULA / NIT', 'CÉDULA_NIT', 'cedula_nit', 'cedula', 'Cedula', 'CEDULA', 'nit', 'NIT') || proceso.cedula || '',
                celular: getValue(rawData, 'celular', 'Celular', 'CELULAR', 'telefono_celular') || rawData?.celular || '',
                telefono: getValue(rawData, 'telefono', 'Telefono', 'TELEFONO', 'telefono_fijo') || rawData?.telefono || '',
                correo: view_correo || '',
                direccion: view_direccion || '',
                ciudad: view_ciudad || '',
                estadoInterno: getValue(rawData, 'estado', 'Estado', 'ESTADO') || proceso.estado || '',
                estadoPublico: getValue(rawData, 'estado_publico', 'estadoPublico', 'Estado Público', 'ESTADO_PUBLICO') || proceso.estadoPublico || '',
                tipo: getValue(rawData, 'CLASE DE PROCESO', 'CLASE_DE_PROCESO', 'clase_proceso', 'tipo', 'Tipo') || proceso.tipo || '',
                fecha: getValue(rawData, 'fecha', 'FECHA', 'fecha_accidente', 'FECHA DE ACCIDENTE', 'FECHA_ACCIDENTE') || proceso.fecha || '',
                fechaIngreso: getValue(rawData, 'fecha_ingreso', 'FECHA DE INGRESO', 'fechaIngreso', 'created_at') || proceso.fechaIngreso || '',
                demandado: getValue(rawData, 'demandado', 'Demandado', 'DEMANDADO') || proceso.demandado || '',
                codigoAcceso: getValue(rawData, 'codigo_acceso', 'codigoAcceso', 'CODIGO_ACCESO') || proceso.codigoAcceso || '',
                observaciones: getValue(rawData, 'observaciones', 'Observaciones', 'OBSERVACIONES') || proceso.observaciones || '',
                observacionesInternas: getValue(rawData, 'observaciones_internas', 'observacionesInternas', 'OBSERVACIONES_INTERNAS') || proceso.observacionesInternas || '',
                observacionesCliente: getValue(rawData, 'observaciones_cliente', 'observacionesCliente', 'OBSERVACIONES_CLIENTE') || proceso.observacionesCliente || '',
                juzgado: getValue(rawData, 'juzgado', 'Juzgado', 'JUZGADO') || proceso.juzgado || '',
                placaVehiculo: getValue(rawData, 'placa_vehiculo', 'placaVehiculo', 'Placa Vehículo', 'PLACA', 'placa') || proceso.placaVehiculo || '',
                valorHonorarios: getValue(rawData, 'valor_honorarios', 'valorHonorarios', 'Valor Honorarios', 'honorarios', 'HONORARIOS') ? Number(getValue(rawData, 'valor_honorarios', 'valorHonorarios', 'Valor Honorarios', 'honorarios', 'HONORARIOS')) : proceso.valorHonorarios,
                valorPeritaje: getValue(rawData, 'valor_peritaje', 'valorPeritaje', 'Valor Peritaje', 'peritaje', 'PERITAJE') ? Number(getValue(rawData, 'valor_peritaje', 'valorPeritaje', 'Valor Peritaje', 'peritaje', 'PERITAJE')) : proceso.valorPeritaje,
                valorPrestamos: getValue(rawData, 'valor_prestamos', 'valorPrestamos', 'Valor Préstamos', 'prestamos', 'PRESTAMOS') ? Number(getValue(rawData, 'valor_prestamos', 'valorPrestamos', 'Valor Préstamos', 'prestamos', 'PRESTAMOS')) : proceso.valorPrestamos,
                gastosAdicionales: getValue(rawData, 'gastos_adicionales', 'gastosAdicionales', 'Gastos Adicionales', 'gastos', 'GASTOS') ? Number(getValue(rawData, 'gastos_adicionales', 'gastosAdicionales', 'Gastos Adicionales', 'gastos', 'GASTOS')) : proceso.gastosAdicionales,
                fechaRadicacion: getValue(rawData, 'fecha_radicacion', 'fechaRadicacion', 'Fecha Radicación', 'FECHA_RADICACION') || proceso.fechaRadicacion || '',
                radicado: view_radicado || ''
              }}
              clienteNombre={view_clienteNombre || proceso.clienteNombre}
              clienteCedula={view_cedula || proceso.cedula}
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


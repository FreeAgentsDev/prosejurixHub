import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Building2, FileText, Tag, DollarSign, AlertCircle, Phone, Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { detectTableAndIdType } from '../../lib/supabaseInspector';
import { getValue } from '../../utils/dataHelpers';
import { logger } from '../../utils/logger';

const ProcesoDetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos del estado de navegación si vienen de la lista
  const { procesos: procesosFromState } = location.state || {};
  
  const [proceso, setProceso] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear nombres de campo
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\//g, ' / ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Cargar proceso completo desde Supabase
  useEffect(() => {
    const loadProcess = async () => {
      if (!id) {
        navigate('/portal/proceso');
        return;
      }

      // Decodificar el ID si viene codificado en la URL
      const decodedId = decodeURIComponent(id);
      logger.debug('Buscando proceso con ID', 'ProcesoDetalleCliente', { id: decodedId });

      setIsLoading(true);
      setError(null);

      try {
        let procesoData = null;

        // Buscar en Supabase para obtener los datos más actualizados
        if (supabase) {
          const tableInfo = await detectTableAndIdType();
          let searchValue: string | number = decodedId;
          if (tableInfo.idType === 'number') {
            const numericId = Number(decodedId);
            if (Number.isNaN(numericId)) {
              throw new Error(`El ID "${decodedId}" no es válido. Se esperaba un número.`);
            }
            searchValue = numericId;
          }

          logger.debug('Buscando en Supabase', 'ProcesoDetalleCliente', { column: tableInfo.idColumnName });

          const { data: foundById, error: errorById } = await supabase
            .from(tableInfo.tableName)
            .select('*')
            .eq(tableInfo.idColumnName, searchValue)
            .maybeSingle();

          if (foundById && !errorById) {
            logger.debug('Proceso encontrado por ID', 'ProcesoDetalleCliente');
            procesoData = foundById;
          }
        }

        // Si no se encontró en Supabase, intentar con el estado de navegación como fallback
        if (!procesoData && procesosFromState && Array.isArray(procesosFromState)) {
          logger.debug('Usando datos del estado de navegación', 'ProcesoDetalleCliente');
          procesoData = procesosFromState.find((p: any) => {
            const procId = getValue(p, 'ID', 'id', 'Id');
            const procIdStr = procId ? String(procId) : '';
            return String(procIdStr) === String(decodedId);
          });
        }

        if (procesoData) {
          logger.debug('Datos del proceso cargados', 'ProcesoDetalleCliente', {
            fieldsCount: Object.keys(procesoData).length
          });
          setProceso(procesoData);
        } else {
          logger.warn('No se encontró el proceso', 'ProcesoDetalleCliente', { id: decodedId });
          setError(`No se encontró el proceso con ID "${decodedId}". Verifica el ID o contacta al administrador.`);
        }
      } catch (err) {
        logger.error('Error al cargar proceso', 'ProcesoDetalleCliente', err);
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
  const procesoId = getValue(proceso, 'ID', 'id', 'Id') || id;
  const clienteNombre = getValue(proceso, 'NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'Cliente Nombre') || 'Cliente';
  const cedula = getValue(proceso, 'CEDULA', 'cedula', 'Cedula', 'CÉDULA', 'nit', 'NIT') || '';
  const estado = getValue(proceso, 'Estado', 'estado', 'ESTADO', 'estado_publico', 'estadoPublico') || 'Sin estado';
  const tipo = getValue(proceso, 'CLASE DE PROCESO', 'CLASE_DE_PROCESO', 'clase_proceso', 'tipo', 'Tipo') || 'Sin tipo';
  const fechaIngreso = getValue(proceso, 'FECHA DE INGRESO', 'fecha_ingreso', 'fechaIngreso', 'Fecha Ingreso', 'created_at') || '';
  const fechaAccidente = getValue(proceso, 'FECHA DE ACCIDENTE', 'FECHA_DE_ACCIDENTE', 'fecha_accidente', 'fecha') || '';
  const observaciones = getValue(proceso, 'observaciones', 'Observaciones', 'OBSERVACIONES', 'observaciones_cliente', 'OBSERVACIONES_CLIENTE') || '';
  const demandado = getValue(proceso, 'demandado', 'Demandado', 'DEMANDADO') || '';
  const juzgado = getValue(proceso, 'juzgado', 'Juzgado', 'JUZGADO') || '';
  const radicado = getValue(proceso, 'RADICADO', 'radicado', 'Radicado') || '';
  const responsabilidad = getValue(proceso, 'responsabilidad', 'Responsabilidad', 'RESPONSABILIDAD') || '';
  const aseguradora = getValue(proceso, 'aseguradora', 'ASEGURADORA', 'Aseguradora') || '';
  const caducidad = getValue(proceso, 'caducidad', 'CADUCIDAD') || '';
  const fechaRenuncia = getValue(proceso, 'fecha_renuncia', 'FECHA RENUNCIA', 'FECHA_RENUNCIA', 'fechaRenuncia') || '';
  const fechaReclamacion = getValue(proceso, 'fecha_reclamacion', 'FECHA RECLAMACIÓN', 'FECHA RECLAMACION', 'fechaReclamacion') || '';
  const conciliacion = getValue(proceso, 'conciliacion', 'CONCILIACIÓN', 'CONCILIACION') || '';
  const fechaPresentacionDemanda = getValue(proceso, 'fecha_presentacion_demanda', 'FECHA PRESENTACIÓN DEMANDA', 'FECHA PRESENTACION DEMANDA', 'fechaPresentacionDemanda') || '';

  // Función para obtener el texto del flujo de proceso
  const obtenerFlujoProceso = (responsabilidad: string | null | undefined): string => {
    const responsabilidadLower = String(responsabilidad || '').toLowerCase();
    
    if (responsabilidadLower.includes('extracontractual') || responsabilidadLower.includes('extra-contractual')) {
      return 'Extra-contractual: Hasta 5 años';
    } else if (responsabilidadLower.includes('contractual')) {
      return 'Contractual: 2 años';
    } else if (responsabilidadLower.includes('reparación directa') || responsabilidadLower.includes('reparacion directa')) {
      return 'Reparación directa: 2 años';
    }
    
    return 'No especificado';
  };

  // Función para verificar si está cerca de caducar (menos de 6 meses)
  const estaCercaDeCaducar = (caducidad: string | null | undefined): boolean => {
    if (!caducidad) return false;
    const fechaCaducidad = new Date(caducidad);
    if (Number.isNaN(fechaCaducidad.getTime())) return false;
    
    const hoy = new Date();
    const seisMeses = new Date();
    seisMeses.setMonth(seisMeses.getMonth() + 6);
    
    return fechaCaducidad <= seisMeses && fechaCaducidad >= hoy;
  };

  // Función para verificar si ya caducó
  const yaCaduco = (caducidad: string | null | undefined): boolean => {
    if (!caducidad) return false;
    const fechaCaducidad = new Date(caducidad);
    if (Number.isNaN(fechaCaducidad.getTime())) return false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaCaducidad.setHours(0, 0, 0, 0);
    
    return fechaCaducidad < hoy;
  };

  // Función para determinar el color del estado según responsabilidad y estado
  const estadoChipClass = (
    estado: string | null | undefined,
    responsabilidad?: string | null | undefined,
    aseguradora?: string | null | undefined
  ): string => {
    const chipClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border';
    const estadoLower = String(estado || '').toLowerCase();
    const responsabilidadLower = String(responsabilidad || '').toLowerCase();
    const aseguradoraValue = String(aseguradora || '').trim();
    const tieneAseguradora = aseguradoraValue && aseguradoraValue.toLowerCase() !== 'n/a' && aseguradoraValue.toLowerCase() !== 'sin aseguradora';

    // Verde → Finalizados
    if (estadoLower.includes('final') || estadoLower.includes('cerrado') || estadoLower.includes('inactivo')) {
      return `${chipClass} bg-emerald-50 text-emerald-700 border-emerald-200`;
    }

    // Rojo → Reparación directa / contractual
    if (responsabilidadLower.includes('contractual') || responsabilidadLower.includes('reparación directa') || responsabilidadLower.includes('reparacion directa')) {
      return `${chipClass} bg-red-50 text-red-700 border-red-200`;
    }

    // Rosado → Extra / aseguradora
    if (responsabilidadLower.includes('extracontractual') && tieneAseguradora) {
      return `${chipClass} bg-pink-50 text-pink-700 border-pink-200`;
    }

    // Cian → Extra / persona natural
    if (responsabilidadLower.includes('extracontractual') && !tieneAseguradora) {
      return `${chipClass} bg-cyan-50 text-cyan-700 border-cyan-200`;
    }

    // Fallback para otros estados
    if (estadoLower.includes('espera') || estadoLower.includes('revision') || estadoLower.includes('revisión'))
      return `${chipClass} bg-amber-50 text-amber-700 border-amber-200`;
    if (estadoLower.includes('negoci')) return `${chipClass} bg-sky-50 text-sky-700 border-sky-200`;
    if (estadoLower.includes('error') || estadoLower.includes('rechaz'))
      return `${chipClass} bg-rose-50 text-rose-700 border-rose-200`;
    return `${chipClass} bg-indigo-50 text-indigo-700 border-indigo-200`;
  };
  
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
        'id', 'nombre', 'cliente_nombre', 'clientenombre',
        'cédula', 'cedula', 'nit', 'cédula / nit', 'cedula_nit',
        'estado', 'estado_publico', 'estadopublico',
        'clase de proceso', 'clase_de_proceso', 'tipoproceso', 'tipo',
        'fecha de ingreso', 'fecha_ingreso', 'fechaingreso', 'created_at',
        'fecha de accidente', 'fecha_de_accidente', 'fechaaccidente', 'fecha',
        'observaciones', 'observaciones_cliente', 'observacionescliente',
        'demandado', 'juzgado',
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
              <div className={`${estadoChipClass(estado, responsabilidad, aseguradora)}`}>
                <span className="font-medium">{estado}</span>
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
                    <span className={`mt-1 inline-flex ${estadoChipClass(estado, responsabilidad, aseguradora)}`}>
                      {estado || 'No especificado'}
                    </span>
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
                {fechaRenuncia && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Fecha Renuncia Expresa</p>
                      <p className="text-sm text-slate-900">
                        {new Date(fechaRenuncia).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 italic">Proceso → Renuncia expresa → Reclamación</p>
                    </div>
                  </div>
                )}
                {fechaReclamacion && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">Fecha Reclamación</p>
                      <p className="text-sm text-slate-900">
                        {new Date(fechaReclamacion).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 italic">Reclamación → Esperar antes (se necesitan todos los procesos / observaciones)</p>
                    </div>
                  </div>
                )}
                {caducidad && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500">
                        Caducidad
                        {responsabilidad && (
                          <span className="ml-2 text-xs font-normal normal-case text-slate-400">
                            ({obtenerFlujoProceso(responsabilidad)})
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-sm ${yaCaduco(caducidad) ? 'font-semibold text-red-600' : estaCercaDeCaducar(caducidad) ? 'font-semibold text-amber-600' : 'text-slate-900'}`}>
                          {new Date(caducidad).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {yaCaduco(caducidad) && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            Caducado
                          </span>
                        )}
                        {estaCercaDeCaducar(caducidad) && !yaCaduco(caducidad) && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            Próximo a caducar
                          </span>
                        )}
                      </div>
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

            {/* Sección de información de flujo de proceso */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
                <header className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">Flujo de Proceso</h3>
                    <p className="text-xs text-blue-700">Información sobre el manejo de tu proceso</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Flujo
                  </span>
                </header>

                <div className="space-y-3 text-xs text-blue-900">
                  <div className="rounded-lg border border-blue-200 bg-white/80 p-3">
                    <p className="font-semibold mb-1">Flujo Principal:</p>
                    <p className="text-blue-800">Proceso → Renuncia expresa → Reclamación</p>
                    <p className="text-blue-800 mt-1">Conciliación → Demanda → Juzgados</p>
                  </div>
                  
                  <div className="rounded-lg border border-blue-200 bg-white/80 p-3">
                    <p className="font-semibold mb-1">Actualizaciones:</p>
                    <p className="text-blue-800">7 días → semana se actualizan todos</p>
                  </div>

                  {responsabilidad && (
                    <div className="rounded-lg border border-blue-200 bg-white/80 p-3">
                      <p className="font-semibold mb-1">Flujo de Caducidad:</p>
                      <p className="text-blue-800">{obtenerFlujoProceso(responsabilidad)}</p>
                    </div>
                  )}

                  {fechaRenuncia && aseguradora && (
                    <div className="rounded-lg border border-green-200 bg-green-50/80 p-3">
                      <p className="font-semibold mb-1 text-green-800">✓ Información Completa:</p>
                      <p className="text-green-700">Fecha de renuncia: {new Date(fechaRenuncia).toLocaleDateString('es-CO')}</p>
                      <p className="text-green-700">Aseguradora: {aseguradora}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcesoDetalleCliente;


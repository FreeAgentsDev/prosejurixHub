import { useState, useEffect } from 'react';
import { mockProcesos, MockProceso } from '../data/mocks';
import { supabase } from '../lib/supabase';
import { ControlProcesoAntecedente } from '../types/supabase';
import * as api from '../services/api';
import { detectTableAndIdType, TableInfo } from '../lib/supabaseInspector';

// Función helper para obtener un valor de un objeto usando múltiples posibles nombres de claves
const getValue = (obj: any, ...keys: string[]): any => {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }
  return null;
};

// Función para transformar datos de Supabase al formato MockProceso
// Esta función es flexible y detecta automáticamente los nombres de columnas
export const transformSupabaseToMock = (data: any): MockProceso => {
  // Detectar nombres de columnas automáticamente
  const id = getValue(data, 'proceso_id', 'procesoId', 'Proceso ID', 'id') || `PROC-${data.id || Math.random().toString(36).substr(2, 9)}`;
  const cedula = getValue(data, 'cedula', 'Cedula', 'CÉDULA', 'cedula_cliente') || '';
  const estado = (getValue(data, 'estado', 'Estado', 'estado_interno') as 'activo' | 'finalizado' | 'en_espera') || 'activo';
  const estadoPublico = getValue(data, 'estado_publico', 'estadoPublico', 'Estado Publico', 'Estado Público', 'estado_para_cliente') || 'Evaluación Inicial';
  const tipo = (getValue(data, 'tipo', 'Tipo', 'tipo_proceso') as 'civil' | 'penal' | 'laboral' | 'comercial') || 'civil';
  const fecha = getValue(data, 'fecha', 'Fecha', 'fecha_proceso') || new Date().toISOString().split('T')[0];
  const fechaIngreso = getValue(data, 'fecha_ingreso', 'fechaIngreso', 'Fecha Ingreso', 'Fecha de Ingreso', 'fecha_ingreso_proceso', 'created_at') || fecha;
  const clienteNombre = getValue(data, 'cliente_nombre', 'clienteNombre', 'Cliente Nombre', 'Nombre Cliente', 'nombre_cliente', 'cliente', 'Nombre') || '';
  const clienteId = getValue(data, 'cliente_id', 'clienteId', 'Cliente ID', 'id_cliente') || 0;
  const demandado = getValue(data, 'demandado', 'Demandado', 'demandado_nombre') || '';
  const codigoAcceso = getValue(data, 'codigo_acceso', 'codigoAcceso', 'Código Acceso', 'codigo', 'Codigo Acceso') || '';
  const observaciones = getValue(data, 'observaciones', 'Observaciones', 'observaciones_generales');
  const observacionesInternas = getValue(data, 'observaciones_internas', 'observacionesInternas', 'Observaciones Internas', 'notas_internas');
  const observacionesCliente = getValue(data, 'observaciones_cliente', 'observacionesCliente', 'Observaciones Cliente', 'notas_cliente');
  const juzgado = getValue(data, 'juzgado', 'Juzgado', 'juzgado_nombre');
  const placaVehiculo = getValue(data, 'placa_vehiculo', 'placaVehiculo', 'Placa Vehículo', 'placa', 'Placa');
  const valorHonorarios = getValue(data, 'valor_honorarios', 'valorHonorarios', 'Valor Honorarios', 'honorarios');
  const valorPeritaje = getValue(data, 'valor_peritaje', 'valorPeritaje', 'Valor Peritaje', 'peritaje');
  const valorPrestamos = getValue(data, 'valor_prestamos', 'valorPrestamos', 'Valor Préstamos', 'prestamos');
  const gastosAdicionales = getValue(data, 'gastos_adicionales', 'gastosAdicionales', 'Gastos Adicionales', 'gastos');
  const fechaRadicacion = getValue(data, 'fecha_radicacion', 'fechaRadicacion', 'Fecha Radicación', 'Fecha de Radicación');

  return {
    id: String(id),
    cedula,
    estado,
    estadoPublico,
    tipo,
    fecha,
    fechaIngreso,
    clienteNombre,
    clienteId: Number(clienteId),
    demandado,
    codigoAcceso,
    observaciones,
    observacionesInternas,
    observacionesCliente,
    juzgado,
    placaVehiculo,
    valorHonorarios: valorHonorarios ? Number(valorHonorarios) : undefined,
    valorPeritaje: valorPeritaje ? Number(valorPeritaje) : undefined,
    valorPrestamos: valorPrestamos ? Number(valorPrestamos) : undefined,
    gastosAdicionales: gastosAdicionales ? Number(gastosAdicionales) : undefined,
    fechaRadicacion
  };
};

// Hook para gestionar procesos con Supabase
export const useProcesses = () => {
  const [procesos, setProcesos] = useState<MockProceso[]>([]);
  const [procesosRaw, setProcesosRaw] = useState<any[]>([]); // Datos crudos de Supabase
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);

  // Detectar tabla y tipo de ID una sola vez
  const detectTableInfo = async (): Promise<TableInfo> => {
    if (tableInfo) return tableInfo;
    
    try {
      const info = await detectTableAndIdType();
      setTableInfo(info);
      return info;
    } catch (err) {
      console.error('❌ Error al detectar información de la tabla:', err);
      throw err;
    }
  };

  // Función helper para ordenar los datos usando las columnas reales
  const sortDataByClient = (data: any[]): any[] => {
    if (!data || data.length === 0) return data;

    const sampleRow = data[0];
    const clienteColumn = 
      sampleRow.cliente_nombre !== undefined ? 'cliente_nombre' :
      sampleRow.clienteNombre !== undefined ? 'clienteNombre' :
      sampleRow['Nombre Cliente'] !== undefined ? 'Nombre Cliente' :
      sampleRow.nombre_cliente !== undefined ? 'nombre_cliente' :
      sampleRow.cliente !== undefined ? 'cliente' :
      sampleRow.nombre !== undefined ? 'nombre' :
      null;

    const fechaColumn = 
      sampleRow.fecha_ingreso !== undefined ? 'fecha_ingreso' :
      sampleRow.fechaIngreso !== undefined ? 'fechaIngreso' :
      sampleRow['Fecha Ingreso'] !== undefined ? 'Fecha Ingreso' :
      sampleRow.fecha !== undefined ? 'fecha' :
      sampleRow.created_at !== undefined ? 'created_at' :
      null;

    if (!clienteColumn && !fechaColumn) return data;

    return [...data].sort((a: any, b: any) => {
      if (clienteColumn) {
        const nameA = (a[clienteColumn] || '').toString().toLowerCase();
        const nameB = (b[clienteColumn] || '').toString().toLowerCase();
        if (nameA !== nameB) {
          return nameA.localeCompare(nameB);
        }
      }
      
      if (fechaColumn) {
        const dateA = a[fechaColumn] ? new Date(a[fechaColumn]).getTime() : 0;
        const dateB = b[fechaColumn] ? new Date(b[fechaColumn]).getTime() : 0;
        return dateB - dateA;
      }
      
      return 0;
    });
  };

  // Cargar procesos desde Supabase
  useEffect(() => {
    const loadProcesses = async () => {
      try {
        console.log('🔄 Iniciando carga de procesos desde Supabase...');
        setIsLoaded(false);
        setError(null);

        // Verificar si el cliente de Supabase está inicializado
        if (!supabase) {
          const envUrl = import.meta.env.VITE_SUPABASE_URL;
          const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          console.error('❌ Cliente de Supabase no inicializado');
          console.error('VITE_SUPABASE_URL:', envUrl ? '✅ Configurado' : '❌ No configurado');
          console.error('VITE_SUPABASE_ANON_KEY:', envKey ? '✅ Configurado' : '❌ No configurado');
          throw new Error('Cliente de Supabase no inicializado. Por favor, crea un archivo .env en la raíz del proyecto con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Consulta SETUP_SUPABASE.md para más información.');
        }

        console.log('✓ Cliente de Supabase inicializado correctamente');

        // Detectar tabla y tipo de ID
        console.log('🔍 Detectando tabla y tipo de ID...');
        const info = await detectTableInfo();
        console.log(`✓ Tabla: "${info.tableName}", Columna ID: "${info.idColumnName}" (tipo: ${info.idType})`);

        // Obtener los datos SIN ordenamiento primero para evitar errores de columnas
        console.log('📥 Obteniendo datos de Supabase...');
        const { data: rawData, error: supabaseError } = await supabase
          .from(info.tableName)
          .select('*');

        if (supabaseError) {
          console.error('❌ Error de Supabase:', supabaseError);
          console.error('Código:', supabaseError.code);
          console.error('Mensaje:', supabaseError.message);
          console.error('Detalles:', supabaseError.details);
          console.error('Hint:', supabaseError.hint);

          // Mejorar mensaje de error si la tabla no existe o columnas incorrectas
          if (supabaseError.message?.includes('relation') || supabaseError.message?.includes('does not exist')) {
            throw new Error(`Tabla "${info.tableName}" no encontrada. Verifica el nombre de la tabla en Supabase. Error: ${supabaseError.message}`);
          }
          if (supabaseError.message?.includes('column') && supabaseError.message?.includes('does not exist')) {
            // El error es de columnas, no de la tabla - aún podemos trabajar con los datos
            console.warn('⚠️ Advertencia sobre columnas:', supabaseError.message);
            // Intentar obtener datos sin ordenamiento
            const { data: fallbackData } = await supabase
              .from(info.tableName)
              .select('*');
            if (fallbackData) {
              const data = sortDataByClient(fallbackData);
              const transformedProcesses = data.map(transformSupabaseToMock);
              setProcesos(transformedProcesses);
              setIsLoaded(true);
              return;
            }
          }
          // Si es un error de permisos RLS
          if (supabaseError.code === 'PGRST301' || supabaseError.message?.includes('permission')) {
            throw new Error(`Error de permisos: La tabla requiere permisos de Row Level Security (RLS) configurados en Supabase. Error: ${supabaseError.message}`);
          }
          throw supabaseError;
        }

        // Mostrar en consola las columnas disponibles para debug
        if (rawData && rawData.length > 0) {
          console.log('✅ Datos obtenidos de Supabase exitosamente');
          console.log(`📊 Total de registros: ${rawData.length}`);
          console.log('📋 Columnas disponibles en el primer registro:', Object.keys(rawData[0]));
          console.log('📄 Primer registro completo:', rawData[0]);
        } else {
          console.warn('⚠️ No se encontraron datos en Supabase (tabla vacía)');
        }

        // Ordenar los datos en JavaScript usando las columnas reales
        const data = sortDataByClient(rawData || []);

        if (data && data.length > 0) {
          // Guardar datos crudos de Supabase
          setProcesosRaw(data);
          // Transformar los datos de Supabase al formato esperado
          const transformedProcesses = data.map(transformSupabaseToMock);
          console.log(`✅ ${transformedProcesses.length} procesos transformados y listos para mostrar`);
          setProcesos(transformedProcesses);
        } else {
          // Si no hay datos en Supabase, mostrar mensaje pero no usar mocks
          console.warn('⚠️ La tabla está vacía. No hay procesos registrados en Supabase.');
          setProcesos([]);
          setProcesosRaw([]);
          setError('La tabla de procesos está vacía. Crea tu primer proceso para comenzar.');
        }
      } catch (err) {
        console.error('❌ Error al cargar procesos desde Supabase:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        // En caso de error, no usar mocks - mostrar error real
        setProcesos([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProcesses();
  }, []);

  const createProcess = async (processData: Omit<MockProceso, 'id'>) => {
    try {
      // Generar proceso_id automáticamente si no existe
      const procesoId = `PROC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Preparar datos para la API - incluir TODOS los campos de la tabla
      const apiData: Omit<ControlProcesoAntecedente, 'id'> = {
        cliente_id: processData.clienteId || undefined,
        cliente_nombre: processData.clienteNombre || undefined,
        cedula: processData.cedula || undefined,
        proceso_id: procesoId, // Generado automáticamente
        estado: processData.estado || undefined,
        estado_publico: processData.estadoPublico || undefined,
        tipo: processData.tipo || undefined,
        fecha: processData.fecha || undefined,
        fecha_ingreso: processData.fechaIngreso || undefined,
        demandado: processData.demandado || undefined,
        codigo_acceso: processData.codigoAcceso || undefined,
        observaciones: processData.observaciones || undefined,
        observaciones_internas: processData.observacionesInternas || undefined,
        observaciones_cliente: processData.observacionesCliente || undefined,
        juzgado: processData.juzgado || undefined,
        placa_vehiculo: processData.placaVehiculo || undefined,
        valor_honorarios: processData.valorHonorarios ?? undefined,
        valor_peritaje: processData.valorPeritaje ?? undefined,
        valor_prestamos: processData.valorPrestamos ?? undefined,
        gastos_adicionales: processData.gastosAdicionales ?? undefined,
        fecha_radicacion: processData.fechaRadicacion || undefined
      };

      console.log('📝 Creando proceso a través de la API:', apiData);

      // Llamar a la API para crear el registro
      const response = await api.createRecord(apiData);
      
      if (response.data) {
        const newProcess = transformSupabaseToMock(response.data);
        // Recargar todos los procesos
        await refreshProcesses();
        return newProcess;
      }
      
      throw new Error('No se recibieron datos del servidor');
    } catch (err) {
      console.error('Error al crear proceso:', err);
      throw err;
    }
  };

  const updateProcess = async (id: string, updates: Partial<MockProceso>) => {
    try {
      // Buscar el proceso original para obtener el ID numérico de la base de datos
      const procesoOriginal = procesos.find(p => p.id === id);
      if (!procesoOriginal) throw new Error('Proceso no encontrado');

      // Preparar datos actualizados para la API
      const updateData: Partial<ControlProcesoAntecedente> = {};
      
      if (updates.clienteId !== undefined) updateData.cliente_id = updates.clienteId;
      if (updates.clienteNombre !== undefined) updateData.cliente_nombre = updates.clienteNombre;
      if (updates.cedula !== undefined) updateData.cedula = updates.cedula;
      if (updates.estado !== undefined) updateData.estado = updates.estado;
      if (updates.estadoPublico !== undefined) updateData.estado_publico = updates.estadoPublico;
      if (updates.tipo !== undefined) updateData.tipo = updates.tipo;
      if (updates.fecha !== undefined) updateData.fecha = updates.fecha;
      if (updates.fechaIngreso !== undefined) updateData.fecha_ingreso = updates.fechaIngreso;
      if (updates.demandado !== undefined) updateData.demandado = updates.demandado;
      if (updates.codigoAcceso !== undefined) updateData.codigo_acceso = updates.codigoAcceso;
      if (updates.observaciones !== undefined) updateData.observaciones = updates.observaciones;
      if (updates.observacionesInternas !== undefined) updateData.observaciones_internas = updates.observacionesInternas;
      if (updates.observacionesCliente !== undefined) updateData.observaciones_cliente = updates.observacionesCliente;
      if (updates.juzgado !== undefined) updateData.juzgado = updates.juzgado;
      if (updates.placaVehiculo !== undefined) updateData.placa_vehiculo = updates.placaVehiculo;
      if ((updates as any).celular !== undefined) updateData.celular = (updates as any).celular;
      if ((updates as any).telefono !== undefined) updateData.telefono = (updates as any).telefono;
      if (updates.valorHonorarios !== undefined) updateData.valor_honorarios = updates.valorHonorarios;
      if (updates.valorPeritaje !== undefined) updateData.valor_peritaje = updates.valorPeritaje;
      if (updates.valorPrestamos !== undefined) updateData.valor_prestamos = updates.valorPrestamos;
      if (updates.gastosAdicionales !== undefined) updateData.gastos_adicionales = updates.gastosAdicionales;
      if (updates.fechaRadicacion !== undefined) updateData.fecha_radicacion = updates.fechaRadicacion;

      // Necesitamos obtener el ID numérico de la base de datos
      // Primero intentamos buscar en los procesos existentes para obtener el ID numérico
      // Si no lo encontramos, necesitamos buscar en Supabase directamente
      let dbId: number | string = id;
      
      // Si el ID es un string como "PROC-123", necesitamos buscar el ID numérico
      if (id.startsWith('PROC-')) {
        // Buscar en Supabase para obtener el ID numérico usando el tipo correcto
        if (supabase) {
          const info = await detectTableInfo();
          
          // Buscar por proceso_id para obtener el id numérico
          const { data: foundData } = await supabase
            .from(info.tableName)
            .select(info.idColumnName)
            .eq('proceso_id', id)
            .maybeSingle();
          
          if (foundData && foundData[info.idColumnName] !== undefined) {
            dbId = foundData[info.idColumnName];
          }
        }
      }

      console.log('📝 Actualizando proceso a través de la API:', { id: dbId, updates: updateData });

      // Llamar a la API para actualizar el registro
      await api.updateRecord(dbId, updateData);

      // Recargar todos los procesos
      await refreshProcesses();
    } catch (err) {
      console.error('Error al actualizar proceso:', err);
      throw err;
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      // Necesitamos obtener el ID numérico de la base de datos
      let dbId: number | string = id;
      
      // Si el ID es un string como "PROC-123", necesitamos buscar el ID numérico
      if (id.startsWith('PROC-')) {
        // Buscar en Supabase para obtener el ID numérico usando el tipo correcto
        if (supabase) {
          const info = await detectTableInfo();
          
          // Buscar por proceso_id para obtener el id numérico
          const { data: foundData } = await supabase
            .from(info.tableName)
            .select(info.idColumnName)
            .eq('proceso_id', id)
            .maybeSingle();
          
          if (foundData && foundData[info.idColumnName] !== undefined) {
            dbId = foundData[info.idColumnName];
          } else {
            throw new Error('No se encontró el proceso en la base de datos');
          }
        } else {
          throw new Error('No se puede obtener el ID numérico. Supabase no está inicializado.');
        }
      }

      console.log('🗑️ Eliminando proceso a través de la API:', dbId);

      // Llamar a la API para eliminar el registro
      await api.deleteRecord(dbId);

      // Recargar todos los procesos
      await refreshProcesses();
    } catch (err) {
      console.error('Error al eliminar proceso:', err);
      throw err;
    }
  };

  const getProcess = (id: string) => {
    return procesos.find(p => p.id === id);
  };

  const refreshProcesses = async () => {
    if (!supabase) {
      throw new Error('Cliente de Supabase no inicializado. Verifica tu archivo .env');
      return;
    }

    try {
      const info = await detectTableInfo();
      const { data, error: supabaseError } = await supabase
        .from(info.tableName)
        .select('*');

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0) {
        const sortedData = sortDataByClient(data);
        // Guardar datos crudos de Supabase
        setProcesosRaw(sortedData);
        setProcesos(sortedData.map(transformSupabaseToMock));
      } else {
        setProcesosRaw([]);
        setProcesos([]);
      }
    } catch (err) {
      console.error('Error al refrescar procesos:', err);
    }
  };

  return {
    procesos,
    procesosRaw, // Datos crudos de Supabase
    isLoaded,
    error,
    createProcess,
    updateProcess,
    deleteProcess,
    getProcess,
    refreshProcesses,
    setProcesos
  };
};


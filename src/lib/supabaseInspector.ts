/**
 * Inspector de Supabase - Detecta tabla y tipo de ID
 * Usa una sola consulta segura para inspeccionar el esquema
 */

import { supabase } from './supabase';

export interface TableInfo {
  tableName: string;
  idColumnName: string;
  idType: 'number' | 'string';
  idColumnValue: any;
  sampleRecord: any;
}

/**
 * Detectar tabla válida y tipo de ID con una sola consulta segura
 */
export async function detectTableAndIdType(): Promise<TableInfo> {
  if (!supabase) {
    throw new Error('Cliente de Supabase no inicializado. Verifica tu archivo .env');
  }

  // Intentar solo con el nombre de tabla esperado
  const tableName = 'CTRANTECEDENTES';
  
  console.log(`🔍 Inspeccionando tabla: ${tableName}`);
  
  try {
    // Consulta segura: obtener 1 registro sin filtros para inspeccionar estructura
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      // Si la tabla no existe, lanzar error claro
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error(`Tabla "${tableName}" no encontrada en Supabase. Error: ${error.message}`);
      }
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Tabla "${tableName}" existe pero está vacía. No se puede determinar el tipo de ID.`);
    }

    const sampleRecord = data[0];
    console.log('✅ Tabla encontrada:', tableName);
    console.log('📋 Columnas disponibles:', Object.keys(sampleRecord));
    console.log('📄 Registro de muestra:', sampleRecord);

    // Detectar columna de ID priorizando variaciones comunes de "ID"
    const idCandidates = ['id', 'ID', 'Id'];
    let idColumnName: string | null = null;
    let idColumnValue: any = null;

    for (const candidate of idCandidates) {
      if (sampleRecord[candidate] !== undefined && sampleRecord[candidate] !== null) {
        idColumnName = candidate;
        idColumnValue = sampleRecord[candidate];
        break;
      }
    }

    if (idColumnName === null) {
      throw new Error(`No se encontró una columna de ID (id/ID) en la tabla. Columnas disponibles: ${Object.keys(sampleRecord).join(', ')}`);
    }

    // Determinar tipo de ID
    const idType: 'number' | 'string' = typeof idColumnValue === 'number' ? 'number' : 'string';
    
    console.log(`✅ Columna de ID detectada: "${idColumnName}" (tipo: ${idType})`);
    console.log(`📊 Valor de muestra:`, idColumnValue);

    return {
      tableName,
      idColumnName,
      idType,
      idColumnValue,
      sampleRecord
    };
  } catch (err) {
    console.error('❌ Error al inspeccionar tabla:', err);
    throw err;
  }
}


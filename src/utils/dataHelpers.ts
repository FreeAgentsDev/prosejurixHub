/**
 * Utilidades para manejo de datos
 * Centraliza funciones comunes de transformación y acceso a datos
 */

import { COLUMN_NAMES, NO_INSURER_VALUES } from './constants';
import { hasValue } from './validation';

/**
 * Obtiene un valor de un objeto usando múltiples posibles nombres de claves
 * Aplica el principio DRY (Don't Repeat Yourself)
 */
export const getValue = (obj: any, ...keys: string[]): any => {
  if (!obj || typeof obj !== 'object') return null;
  
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return null;
};

/**
 * Normaliza una clave removiendo acentos y caracteres especiales
 */
export const normalizeKey = (key: string): string => {
  return String(key)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '');
};

/**
 * Resuelve el nombre de columna correcto de un registro
 */
export const resolveColumnName = (sampleRecord: any, candidates: string[]): string | null => {
  if (!sampleRecord || typeof sampleRecord !== 'object') return null;

  const recordKeys = Object.keys(sampleRecord);

  // Primero intentar coincidencia exacta
  for (const candidate of candidates) {
    if (recordKeys.includes(candidate)) {
      return candidate;
    }
  }

  // Luego intentar coincidencia normalizada
  const normalizedKeysMap = new Map<string, string>();
  for (const key of recordKeys) {
    normalizedKeysMap.set(normalizeKey(key), key);
  }

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeKey(candidate);
    if (normalizedKeysMap.has(normalizedCandidate)) {
      return normalizedKeysMap.get(normalizedCandidate)!;
    }
  }

  return null;
};

/**
 * Obtiene el ID de un proceso
 */
export const getProcessId = (proceso: any): string | number => {
  return getValue(proceso, ...COLUMN_NAMES.ID) || 'N/A';
};

/**
 * Obtiene el nombre del cliente
 */
export const getClientName = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.NOMBRE) || 'Sin nombre';
};

/**
 * Obtiene el teléfono
 */
export const getPhone = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.TELEFONO) || 'Sin teléfono';
};

/**
 * Obtiene el estado público
 */
export const getPublicState = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.ESTADO_PUBLICO) || 'Sin estado';
};

/**
 * Obtiene el estado interno
 */
export const getInternalState = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.ESTADO_INTERNO) || 'Sin estado';
};

/**
 * Obtiene la responsabilidad
 */
export const getResponsibility = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.RESPONSABILIDAD) || '';
};

/**
 * Obtiene la aseguradora
 */
export const getInsurer = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.ASEGURADORA) || '';
};

/**
 * Obtiene la fecha de ingreso
 */
export const getFechaIngreso = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.FECHA_INGRESO) || '—';
};

/**
 * Obtiene el demandado
 */
export const getDemandado = (proceso: any): string => {
  return getValue(proceso, ...COLUMN_NAMES.DEMANDADO) || 'Sin demandado';
};

/**
 * Verifica si tiene aseguradora válida
 */
export const hasInsurer = (aseguradora: string | null | undefined): boolean => {
  if (!hasValue(aseguradora)) return false;
  const normalized = String(aseguradora).trim().toLowerCase();
  return !NO_INSURER_VALUES.includes(normalized as any);
};

/**
 * Formatea una fecha
 */
export const formatDate = (value: string | null | undefined): string => {
  if (!value) return 'No especificada';
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '$0';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(num);
};


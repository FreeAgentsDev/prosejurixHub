/**
 * Servicio para determinar colores de procesos
 * Aplica Single Responsibility Principle - solo se encarga de la lógica de colores
 */

import { PROCESS_COLORS, PROCESS_STATES, RESPONSIBILITY_TYPES, NO_INSURER_VALUES } from '../utils/constants';
import { hasValue } from '../utils/validation';

/**
 * Normaliza un texto removiendo acentos y convirtiendo a minúsculas
 */
const normalizeText = (text: string): string => {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Verifica si un estado corresponde a "finalizado"
 */
const isFinalizedState = (estado: string | null | undefined): boolean => {
  if (!estado) return false;
  const normalized = normalizeText(String(estado));
  // Verificar si el estado normalizado coincide exactamente o contiene alguna palabra clave de finalizado
  return PROCESS_STATES.FINALIZADO.some(state => {
    const stateNormalized = normalizeText(state);
    // Coincidencia exacta o contiene la palabra clave
    return normalized === stateNormalized || normalized.includes(stateNormalized);
  });
};

/**
 * Verifica si una responsabilidad es contractual o reparación directa
 */
const isContractualOrDirectRepair = (responsabilidad: string | null | undefined): boolean => {
  if (!hasValue(responsabilidad)) return false;
  const normalized = normalizeText(String(responsabilidad));
  
  return RESPONSIBILITY_TYPES.CONTRACTUAL.some(type => normalized.includes(type)) ||
         RESPONSIBILITY_TYPES.REPARACION_DIRECTA.some(type => normalized.includes(type));
};

/**
 * Verifica si una responsabilidad es extracontractual
 */
const isExtracontractual = (responsabilidad: string | null | undefined): boolean => {
  if (!hasValue(responsabilidad)) return false;
  const normalized = normalizeText(String(responsabilidad));
  return RESPONSIBILITY_TYPES.EXTRACONTRACTUAL.some(type => normalized.includes(type));
};

/**
 * Verifica si tiene aseguradora válida
 */
const hasValidInsurer = (aseguradora: string | null | undefined): boolean => {
  if (!hasValue(aseguradora)) return false;
  const normalized = String(aseguradora).trim().toLowerCase();
  return !NO_INSURER_VALUES.includes(normalized as any);
};

/**
 * Obtiene la clase CSS para el borde de la fila según el estado y responsabilidad
 */
export const getProcessBorderColor = (
  estado: string | null | undefined,
  responsabilidad?: string | null | undefined,
  aseguradora?: string | null | undefined
): string => {
  // PRIORIDAD 1: Verde → Finalizados (máxima prioridad)
  if (isFinalizedState(estado)) {
    return PROCESS_COLORS.FINALIZADO.border;
  }

  // PRIORIDAD 2: Rojo → Contractual / Reparación directa
  if (isContractualOrDirectRepair(responsabilidad)) {
    return PROCESS_COLORS.CONTRACTUAL.border;
  }

  // PRIORIDAD 3: Rosado → Extra / aseguradora
  if (isExtracontractual(responsabilidad) && hasValidInsurer(aseguradora)) {
    return PROCESS_COLORS.EXTRA_ASEGURADORA.border;
  }

  // PRIORIDAD 4: Cian → Extra / persona natural (sin aseguradora)
  if (isExtracontractual(responsabilidad) && !hasValidInsurer(aseguradora)) {
    return PROCESS_COLORS.EXTRA_PERSONA_NATURAL.border;
  }

  // Fallback
  return PROCESS_COLORS.DEFAULT.border;
};

/**
 * Obtiene la clase CSS para el chip de estado
 */
export const getProcessChipColor = (
  estado: string | null | undefined,
  responsabilidad?: string | null | undefined,
  aseguradora?: string | null | undefined
): string => {
  const chipClass = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border';
  const estadoNormalizado = normalizeText(String(estado || ''));

  // Verde → Finalizados
  if (isFinalizedState(estado)) {
    return `${chipClass} ${PROCESS_COLORS.FINALIZADO.chip}`;
  }

  // Rojo → Contractual / Reparación directa
  if (isContractualOrDirectRepair(responsabilidad)) {
    return `${chipClass} ${PROCESS_COLORS.CONTRACTUAL.chip}`;
  }

  // Rosado → Extra / aseguradora
  if (isExtracontractual(responsabilidad) && hasValidInsurer(aseguradora)) {
    return `${chipClass} ${PROCESS_COLORS.EXTRA_ASEGURADORA.chip}`;
  }

  // Cian → Extra / persona natural
  if (isExtracontractual(responsabilidad) && !hasValidInsurer(aseguradora)) {
    return `${chipClass} ${PROCESS_COLORS.EXTRA_PERSONA_NATURAL.chip}`;
  }

  // Fallback para otros estados
  if (estadoNormalizado.includes('espera') || estadoNormalizado.includes('revision') || estadoNormalizado.includes('revisión')) {
    return `${chipClass} bg-amber-50 text-amber-700 border-amber-200`;
  }
  if (estadoNormalizado.includes('negoci')) {
    return `${chipClass} bg-sky-50 text-sky-700 border-sky-200`;
  }
  if (estadoNormalizado.includes('error') || estadoNormalizado.includes('rechaz')) {
    return `${chipClass} bg-rose-50 text-rose-700 border-rose-200`;
  }

  return `${chipClass} ${PROCESS_COLORS.DEFAULT.chip}`;
};


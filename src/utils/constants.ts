/**
 * Constantes de la aplicación
 * Centraliza todos los valores constantes para facilitar mantenimiento
 */

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,
} as const;

// Nombres de columnas de la base de datos (variantes posibles)
export const COLUMN_NAMES = {
  ID: ['ID', 'id', 'Id'],
  NOMBRE: ['NOMBRE', 'nombre', 'Nombre', 'cliente_nombre', 'clienteNombre', 'NOMBRE_CLIENTE'],
  TELEFONO: ['telefono', 'Telefono', 'TELEFONO', 'telefono_fijo', 'celular', 'Celular', 'CELULAR'],
  ESTADO_PUBLICO: ['estado_publico', 'Estado Público', 'estadoPublico', 'ESTADO_PUBLICO', 'estado_para_cliente', 'Estado Proceso', 'estadoProceso'],
  ESTADO_INTERNO: ['estado', 'Estado', 'ESTADO', 'estado_interno', 'estadoInterno', 'ESTADO_INTERNO'],
  RESPONSABILIDAD: ['RESPONSABILIDAD', 'responsabilidad', 'Responsabilidad', 'RESPONSABILIDAD_', 'responsabilidad_', 'Responsabilidad_'],
  ASEGURADORA: ['ASEGURADORA', 'aseguradora', 'Aseguradora', 'ASEGURADORA_', 'aseguradora_', 'Aseguradora_'],
  FECHA_INGRESO: ['fecha_ingreso', 'fechaIngreso', 'Fecha Ingreso', 'Fecha de Ingreso', 'created_at', 'FECHA DE INGRESO'],
  DEMANDADO: ['demandado', 'Demandado', 'DEMANDADO'],
} as const;

// Colores para estados de procesos
export const PROCESS_COLORS = {
  FINALIZADO: {
    border: 'border-l-4 border-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CONTRACTUAL: {
    border: 'border-l-4 border-red-500',
    chip: 'bg-red-50 text-red-700 border-red-200',
  },
  EXTRA_ASEGURADORA: {
    border: 'border-l-4 border-pink-500',
    chip: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  EXTRA_PERSONA_NATURAL: {
    border: 'border-l-4 border-cyan-400',
    chip: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  DEFAULT: {
    border: 'border-l-4 border-slate-200',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
} as const;

// Estados de procesos
export const PROCESS_STATES = {
  FINALIZADO: ['final', 'cerrado', 'inactivo', 'finalizado'],
  EN_ESPERA: ['espera', 'revision', 'revisión'],
  EN_NEGOCIACION: ['negoci'],
  ERROR: ['error', 'rechaz'],
} as const;

// Tipos de responsabilidad
export const RESPONSIBILITY_TYPES = {
  CONTRACTUAL: ['contractual'],
  REPARACION_DIRECTA: ['reparación directa', 'reparacion directa'],
  EXTRACONTRACTUAL: ['extracontractual', 'extra-contractual', 'extra contractual'],
} as const;

// Valores que indican "sin aseguradora"
export const NO_INSURER_VALUES = ['n/a', 'sin aseguradora', 'na', 'null', 'undefined', ''] as const;

// Configuración de seguridad
export const SECURITY = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_ID: 'ID inválido',
  NETWORK_ERROR: 'Error de conexión. Por favor, intenta nuevamente.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor. Por favor, contacta al administrador.',
} as const;


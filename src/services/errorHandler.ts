/**
 * Servicio centralizado para manejo de errores
 * Aplica Single Responsibility Principle - solo maneja errores
 */

import { ERROR_MESSAGES } from '../utils/constants';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  originalError?: Error;
}

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  code?: string;
  statusCode?: number;
  originalError?: Error;

  constructor(message: string, code?: string, statusCode?: number, originalError?: Error) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Maneja errores de Supabase y los convierte en errores de la aplicación
 */
export const handleSupabaseError = (error: any): AppError => {
  if (!error) {
    return new AppError(ERROR_MESSAGES.SERVER_ERROR, 'UNKNOWN_ERROR', 500);
  }

  // Error de red
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return new AppError(ERROR_MESSAGES.NETWORK_ERROR, 'NETWORK_ERROR', 0, error);
  }

  // Error de autenticación
  if (error.status === 401 || error.message?.includes('JWT')) {
    return new AppError(ERROR_MESSAGES.UNAUTHORIZED, 'UNAUTHORIZED', 401, error);
  }

  // Error de recurso no encontrado
  if (error.status === 404 || error.code === 'PGRST116') {
    return new AppError(ERROR_MESSAGES.NOT_FOUND, 'NOT_FOUND', 404, error);
  }

  // Error del servidor
  if (error.status >= 500) {
    return new AppError(ERROR_MESSAGES.SERVER_ERROR, 'SERVER_ERROR', error.status, error);
  }

  // Error genérico
  return new AppError(
    error.message || ERROR_MESSAGES.SERVER_ERROR,
    error.code || 'UNKNOWN_ERROR',
    error.status || 500,
    error
  );
};

/**
 * Logs de error de forma segura (sin exponer información sensible)
 */
export const logError = (error: AppError | Error, context?: string): void => {
  const errorMessage = error instanceof AppError 
    ? error.message 
    : error.message || 'Error desconocido';
  
  const logData = {
    message: errorMessage,
    code: error instanceof AppError ? error.code : undefined,
    statusCode: error instanceof AppError ? error.statusCode : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  // En producción, enviar a un servicio de logging
  // Por ahora, solo console.error
  console.error('Error:', logData);
  
  if (error instanceof AppError && error.originalError) {
    console.error('Original error:', error.originalError);
  }
};

/**
 * Obtiene un mensaje de error amigable para el usuario
 */
export const getUserFriendlyMessage = (error: AppError | Error): string => {
  if (error instanceof AppError && error.message) {
    return error.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};


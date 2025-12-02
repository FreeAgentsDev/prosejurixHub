/**
 * Sistema de logging seguro
 * Reemplaza console.log/error para evitar exponer información sensible
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Remover información sensible
    const sensitiveKeys = ['password', 'secret', 'token', 'key', 'apiKey', 'authorization'];
    const sanitized = { ...data };
    
    for (const key in sanitized) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      data: data ? this.sanitizeData(data) : undefined,
      timestamp: new Date().toISOString(),
    };

    // En desarrollo, mostrar logs completos
    if (this.isDevelopment) {
      const logMethod = level === 'error' ? console.error : 
                       level === 'warn' ? console.warn : 
                       level === 'info' ? console.info : 
                       console.log;
      
      const prefix = context ? `[${context}]` : '';
      logMethod(`${prefix} ${message}`, data ? this.sanitizeData(data) : '');
    }

    // En producción, solo errores críticos
    if (this.isProduction && level === 'error') {
      // Aquí podrías enviar a un servicio de logging externo
      // Por ahora, solo console.error para errores críticos
      console.error(`[ERROR] ${message}`, context || '');
    }
  }

  debug(message: string, context?: string, data?: any): void {
    if (this.isDevelopment) {
      this.log('debug', message, context, data);
    }
  }

  info(message: string, context?: string, data?: any): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, error?: Error | any): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    this.log('error', message, context, errorData);
  }
}

export const logger = new Logger();


/**
 * Configuración de seguridad
 * Centraliza todas las configuraciones relacionadas con seguridad
 */

import { SECURITY } from '../utils/constants';

/**
 * Valida que una contraseña cumpla con los requisitos mínimos
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'La contraseña es requerida' };
  }

  if (password.length < SECURITY.MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: `La contraseña debe tener al menos ${SECURITY.MIN_PASSWORD_LENGTH} caracteres`,
    };
  }

  // Validaciones adicionales de seguridad
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      valid: false,
      message: 'La contraseña debe contener mayúsculas, minúsculas y números',
    };
  }

  return { valid: true };
};

/**
 * Sanitiza input de usuario para prevenir XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover tags HTML
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .replace(/data:/gi, ''); // Remover data URIs
};

/**
 * Valida que un ID sea seguro (solo números)
 */
export const validateId = (id: string | number): boolean => {
  if (!id) return false;
  const numId = typeof id === 'number' ? id : Number(id);
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId) && numId < Number.MAX_SAFE_INTEGER;
};

/**
 * Rate limiting simple (para uso en cliente)
 * En producción, esto debería estar en el servidor
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  checkLimit(key: string, maxAttempts: number = SECURITY.MAX_LOGIN_ATTEMPTS): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + SECURITY.SESSION_TIMEOUT });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();


/**
 * Utilidades de validación y sanitización
 * Aplica principios de seguridad y validación de datos
 */

/**
 * Sanitiza un string removiendo caracteres peligrosos
 */
export const sanitizeString = (input: string | null | undefined): string => {
  if (!input) return '';
  return String(input)
    .trim()
    .replace(/[<>]/g, '') // Remover tags HTML
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
};

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitizeString(email));
};

/**
 * Valida un teléfono (formato colombiano)
 */
export const isValidPhone = (phone: string | number): boolean => {
  if (!phone) return false;
  const phoneStr = String(phone).replace(/\D/g, ''); // Solo números
  return phoneStr.length >= 7 && phoneStr.length <= 15;
};

/**
 * Valida un ID numérico
 */
export const isValidId = (id: string | number): boolean => {
  if (!id) return false;
  const numId = typeof id === 'number' ? id : Number(id);
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};

/**
 * Valida una fecha
 */
export const isValidDate = (date: string | Date): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Valida que un string no esté vacío
 */
export const isNotEmpty = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

/**
 * Valida un número positivo
 */
export const isValidPositiveNumber = (value: number | string): boolean => {
  const num = typeof value === 'string' ? Number(value) : value;
  return !isNaN(num) && num >= 0;
};

/**
 * Sanitiza un objeto removiendo propiedades peligrosas
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const sanitized: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value) as T[Extract<keyof T, string>];
      } else if (value !== null && value !== undefined) {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
};

/**
 * Valida que un valor no sea uno de los valores "vacíos" comunes
 */
export const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    return trimmed !== '' && 
           trimmed !== 'n/a' && 
           trimmed !== 'na' && 
           trimmed !== 'null' && 
           trimmed !== 'undefined';
  }
  return true;
};


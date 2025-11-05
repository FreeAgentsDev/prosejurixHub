/**
 * API Routes para CTRANTECEDENTES
 * Endpoints: POST (crear) y GET (listar)
 */

import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../../lib/supabaseAdmin.js';
import { ControlProcesoAntecedente } from '../../types/supabase.js';

const router = Router();

/**
 * Validar campos requeridos y tipos del payload
 */
const validatePayload = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validaciones básicas de tipos
  if (data.cedula !== undefined && typeof data.cedula !== 'string') {
    errors.push('cedula debe ser un string');
  }
  if (data.cliente_nombre !== undefined && typeof data.cliente_nombre !== 'string') {
    errors.push('cliente_nombre debe ser un string');
  }
  if (data.proceso_id !== undefined && typeof data.proceso_id !== 'string') {
    errors.push('proceso_id debe ser un string');
  }
  if (data.estado !== undefined && typeof data.estado !== 'string') {
    errors.push('estado debe ser un string');
  }
  if (data.codigo_acceso !== undefined && typeof data.codigo_acceso !== 'string') {
    errors.push('codigo_acceso debe ser un string');
  }

  // Validar campos numéricos
  const numericFields = ['cliente_id', 'valor_honorarios', 'valor_peritaje', 'valor_prestamos', 'gastos_adicionales'];
  for (const field of numericFields) {
    if (data[field] !== undefined && !Number.isFinite(Number(data[field]))) {
      errors.push(`${field} debe ser un número válido`);
    }
  }

  // Validar fechas (formato ISO)
  const dateFields = ['fecha', 'fecha_ingreso', 'fecha_radicacion'];
  for (const field of dateFields) {
    if (data[field] !== undefined && typeof data[field] === 'string') {
      const date = new Date(data[field]);
      if (isNaN(date.getTime())) {
        errors.push(`${field} debe ser una fecha válida en formato ISO`);
      }
    }
  }

  // Validar longitud de strings
  const stringFields: { field: string; maxLength: number }[] = [
    { field: 'cedula', maxLength: 50 },
    { field: 'codigo_acceso', maxLength: 100 },
    { field: 'celular', maxLength: 20 },
    { field: 'telefono', maxLength: 20 },
  ];

  for (const { field, maxLength } of stringFields) {
    if (data[field] !== undefined && typeof data[field] === 'string' && data[field].length > maxLength) {
      errors.push(`${field} no puede exceder ${maxLength} caracteres`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * POST /api/ctrantec
 * Crear un nuevo registro
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Validar que el body no esté vacío
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El body de la petición no puede estar vacío',
      });
    }

    // Validar payload
    const validation = validatePayload(body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Errores de validación',
        errors: validation.errors,
      });
    }

    // Preparar datos para insertar (limpiar campos undefined y trim strings)
    const dataToInsert: Partial<ControlProcesoAntecedente> = {};
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          dataToInsert[key as keyof ControlProcesoAntecedente] = value.trim() as any;
        } else {
          dataToInsert[key as keyof ControlProcesoAntecedente] = value;
        }
      }
    });

    // Insertar en la base de datos
    const { data, error } = await supabaseAdmin
      .from('CTRANTECEDENTES')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('❌ Error al crear registro:', error);
      
      // Manejar errores específicos
      if (error.code === '23505') {
        // Violación de constraint único
        return res.status(409).json({
          error: 'Conflict',
          message: 'Ya existe un registro con estos valores únicos',
          details: error.message,
        });
      }
      
      if (error.code === '23503') {
        // Violación de foreign key
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Referencia inválida a otra tabla',
          details: error.message,
        });
      }

      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error al crear el registro en la base de datos',
      });
    }

    console.log('✅ Registro creado exitosamente:', data?.id);
    return res.status(201).json({
      message: 'Registro creado exitosamente',
      data,
    });
  } catch (err) {
    console.error('❌ Error inesperado en POST /api/ctrantec:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error inesperado',
    });
  }
});

/**
 * GET /api/ctrantec
 * Listar registros (opcional, con paginación)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100); // Máximo 100 registros
    const offset = (page - 1) * limit;

    // Construir query
    let query = supabaseAdmin
      .from('CTRANTECEDENTES')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros si existen
    if (req.query.cliente_id) {
      query = query.eq('cliente_id', req.query.cliente_id);
    }
    if (req.query.estado) {
      query = query.eq('estado', req.query.estado);
    }
    if (req.query.codigo_acceso) {
      query = query.eq('codigo_acceso', req.query.codigo_acceso);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Error al listar registros:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error al obtener los registros',
      });
    }

    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    console.error('❌ Error inesperado en GET /api/ctrantec:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error inesperado',
    });
  }
});

export default router;


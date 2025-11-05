/**
 * API Routes para CTRANTECEDENTES por ID
 * Endpoints: GET (obtener), PUT (actualizar), DELETE (eliminar)
 */

import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../../lib/supabaseAdmin.js';
import { ControlProcesoAntecedente } from '../../types/supabase.js';

const router = Router({ mergeParams: true });

/**
 * Validar ID
 */
const validateId = (id: string): { isValid: boolean; parsedId?: number; error?: string } => {
  const parsedId = Number(id);
  if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
    return {
      isValid: false,
      error: 'El ID debe ser un número entero positivo',
    };
  }
  return { isValid: true, parsedId };
};

/**
 * Validar campos del payload (mismo que en index.ts)
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
 * GET /api/ctrantec/:id
 * Obtener un registro por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar ID
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: idValidation.error,
      });
    }

    // Buscar registro
    const { data, error } = await supabaseAdmin
      .from('CTRANTECEDENTES')
      .select('*')
      .eq('id', idValidation.parsedId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró el registro
        return res.status(404).json({
          error: 'Not Found',
          message: `No se encontró un registro con ID ${id}`,
        });
      }

      console.error('❌ Error al obtener registro:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error al obtener el registro',
      });
    }

    return res.status(200).json({ data });
  } catch (err) {
    console.error('❌ Error inesperado en GET /api/ctrantec/:id:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error inesperado',
    });
  }
});

/**
 * PUT /api/ctrantec/:id
 * Actualizar un registro
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Validar ID
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: idValidation.error,
      });
    }

    // Validar que el body no esté vacío
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El body de la petición no puede estar vacío',
      });
    }

    // No permitir actualizar el ID
    if (body.id !== undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No se puede actualizar el campo id',
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

    // Verificar que el registro existe
    const { data: existingRecord, error: checkError } = await supabaseAdmin
      .from('CTRANTECEDENTES')
      .select('id')
      .eq('id', idValidation.parsedId)
      .single();

    if (checkError || !existingRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No se encontró un registro con ID ${id}`,
      });
    }

    // Preparar datos para actualizar (limpiar campos undefined y trim strings)
    const dataToUpdate: Partial<ControlProcesoAntecedente> = {};
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value !== undefined && value !== null && key !== 'id') {
        if (typeof value === 'string') {
          dataToUpdate[key as keyof ControlProcesoAntecedente] = value.trim() as any;
        } else {
          dataToUpdate[key as keyof ControlProcesoAntecedente] = value;
        }
      }
    });

    // Agregar timestamp de actualización
    dataToUpdate.updated_at = new Date().toISOString();

    // Actualizar en la base de datos
    const { data, error } = await supabaseAdmin
      .from('CTRANTECEDENTES')
      .update(dataToUpdate)
      .eq('id', idValidation.parsedId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al actualizar registro:', error);
      
      // Manejar errores específicos
      if (error.code === '23505') {
        // Violación de constraint único
        return res.status(409).json({
          error: 'Conflict',
          message: 'La actualización viola una restricción única',
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
        message: 'Error al actualizar el registro en la base de datos',
      });
    }

    console.log('✅ Registro actualizado exitosamente:', data?.id);
    return res.status(200).json({
      message: 'Registro actualizado exitosamente',
      data,
    });
  } catch (err) {
    console.error('❌ Error inesperado en PUT /api/ctrantec/:id:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error inesperado',
    });
  }
});

/**
 * DELETE /api/ctrantec/:id
 * Eliminar un registro
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar ID
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: idValidation.error,
      });
    }

    // Verificar que el registro existe antes de eliminar
    const { data: existingRecord, error: checkError } = await supabaseAdmin
      .from('CTRANTECEDENTES')
      .select('id')
      .eq('id', idValidation.parsedId)
      .single();

    if (checkError || !existingRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No se encontró un registro con ID ${id}`,
      });
    }

    // Eliminar registro
    const { data, error } = await supabaseAdmin
      .from('CTRANTECEDENTES')
      .delete()
      .eq('id', idValidation.parsedId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al eliminar registro:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error al eliminar el registro de la base de datos',
      });
    }

    console.log('✅ Registro eliminado exitosamente:', id);
    return res.status(200).json({
      message: 'Registro eliminado exitosamente',
      data,
    });
  } catch (err) {
    console.error('❌ Error inesperado en DELETE /api/ctrantec/:id:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error inesperado',
    });
  }
});

export default router;


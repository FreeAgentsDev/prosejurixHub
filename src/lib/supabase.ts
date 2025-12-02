import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  // Error de configuración - se lanzará excepción
}

// Crear cliente de Supabase
export const supabase = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Función helper para verificar la conexión
export const testConnection = async (): Promise<boolean> => {
  if (!supabase) {
    // Error será manejado por el llamador
    return false;
  }

  try {
    // Intentar una consulta simple para verificar la conexión
    const { error } = await supabase.from('CTRANTECEDENTES').select('id').limit(1);
    if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      // Error será manejado por el llamador
      return false;
    }
    // Conexión verificada
    return true;
  } catch (err) {
    // Error será manejado por el llamador
    return false;
  }
};

// Función helper para obtener el nombre correcto de la tabla
export const getTableName = (): string => {
  // Retornar el nombre actual de la tabla
  return 'CTRANTECEDENTES';
};


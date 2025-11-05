import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Variables de entorno de Supabase no configuradas.');
  console.error('Por favor, crea un archivo .env en la raíz del proyecto con:');
  console.error('VITE_SUPABASE_URL=tu_url_de_supabase');
  console.error('VITE_SUPABASE_ANON_KEY=tu_clave_anon');
  console.error('Consulta SETUP_SUPABASE.md para más información.');
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
    console.error('❌ Cliente de Supabase no inicializado. Verifica tu archivo .env');
    return false;
  }

  try {
    // Intentar una consulta simple para verificar la conexión
    const { error } = await supabase.from('CTRANTECEDENTES').select('id').limit(1);
    if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      console.error('❌ Error de conexión a Supabase:', error.message);
      return false;
    }
    console.log('✓ Conexión a Supabase verificada correctamente');
    return true;
  } catch (err) {
    console.error('❌ Error al verificar conexión:', err);
    return false;
  }
};

// Función helper para obtener el nombre correcto de la tabla
export const getTableName = (): string => {
  // Retornar el nombre actual de la tabla
  return 'CTRANTECEDENTES';
};


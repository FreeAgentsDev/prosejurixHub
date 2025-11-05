/**
 * Cliente de Supabase con Service Role Key
 * ⚠️ SOLO USAR EN EL SERVIDOR (server-only)
 * NUNCA exponer este cliente en el código del cliente (frontend)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ ERROR: Variables de entorno de Supabase Admin no configuradas.');
  console.error('Por favor, crea un archivo .env.local en la raíz del proyecto con:');
  console.error('SUPABASE_URL=tu_url_de_supabase');
  console.error('SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key');
  throw new Error('Supabase Admin: Variables de entorno no configuradas');
}

// Crear cliente de Supabase con service_role (bypass de RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Función helper para verificar la conexión del admin
export const testAdminConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabaseAdmin.from('CTRANTECEDENTES').select('id').limit(1);
    if (error) {
      console.error('❌ Error de conexión a Supabase Admin:', error.message);
      return false;
    }
    console.log('✓ Conexión a Supabase Admin verificada correctamente');
    return true;
  } catch (err) {
    console.error('❌ Error al verificar conexión Admin:', err);
    return false;
  }
};


# Configuración de Variables de Entorno

## 📋 Variables de Entorno Requeridas

Para que el servidor API funcione correctamente, necesitas configurar las siguientes variables de entorno.

### 1. Crear archivo `.env.local`

En la raíz del proyecto, crea un archivo llamado `.env.local` (este archivo NO se sube a Git).

### 2. Contenido del archivo `.env.local`

```env
# Supabase Configuration
# URL de tu proyecto Supabase
SUPABASE_URL=https://your-project-ref.supabase.co

# Service Role Key (NUNCA exponer en el cliente)
# Esta clave tiene permisos administrativos completos
# ⚠️ Obtén esta clave desde: Supabase Dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1yZWYiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQxOTY1MjAwLCJleHAiOjE5NTc1NDEyMDB9.your_service_role_key_here

# Puerto del servidor API (opcional, default: 3001)
PORT=3001
```

### 3. Cómo obtener las credenciales

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (en la sección "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

### 4. ⚠️ Seguridad Importante

- **NUNCA** subas el archivo `.env.local` a Git (ya está en `.gitignore`)
- **NUNCA** uses la `service_role key` en el código del cliente (frontend)
- **SOLO** usa la `service_role key` en el servidor backend
- La `service_role key` tiene permisos administrativos completos y puede bypassear RLS

### 5. Verificar la configuración

Después de crear el archivo `.env.local`, reinicia el servidor:

```bash
npm run dev:server
```

El servidor debería iniciar sin errores. Si ves un error sobre variables de entorno no configuradas, verifica que:

1. El archivo `.env.local` existe en la raíz del proyecto
2. Las variables están escritas correctamente (sin espacios extra)
3. No hay comillas alrededor de los valores (a menos que sean parte del valor)

### 6. Ejemplo de valores reales

```env
SUPABASE_URL=https://laguwzscrdoqndzzdlpj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZ3V3enNjcmRvcW5kenpkbHBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg2NTQ5OCwiZXhwIjoyMDc3NDQxNDk4fQ.actual_service_role_key_here
PORT=3001
```

**Nota:** Los valores de ejemplo arriba son placeholders. Reemplázalos con tus credenciales reales.


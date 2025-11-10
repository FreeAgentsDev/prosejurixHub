# Configuración de Variables de Entorno

## 📋 Variables de Entorno Requeridas

La aplicación se conecta directamente a Supabase desde el frontend, por lo que solo necesitas exponer la URL del proyecto y la clave pública (`anon key`).

### 1. Crear archivo `.env`

En la raíz del proyecto (misma carpeta donde está `package.json`), crea un archivo llamado `.env`.

### 2. Contenido del archivo `.env`

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon
```

### 3. Cómo obtener las credenciales

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 4. ⚠️ Seguridad Importante

- **NUNCA** expongas la `service_role key` en el frontend. Solo usa la **anon key** pública.
- El archivo `.env` está en `.gitignore`; verifica que siga así si cambias el nombre.
- Si cambias las credenciales, reinicia el servidor de desarrollo (`npm run dev`).

### 5. Verificar la configuración

Después de crear o actualizar el archivo `.env`, reinicia el servidor de desarrollo:

```bash
npm run dev
```

Si ves errores en la consola del navegador como `❌ Cliente de Supabase no inicializado`, revisa que:

1. El archivo `.env` existe y está en la raíz del proyecto.
2. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` tienen valores válidos.
3. No hay espacios en blanco extra o comillas envolviendo los valores.

### 6. Ejemplo de valores reales

```env
VITE_SUPABASE_URL=https://laguwzscrdoqndzzdlpj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZ3V3enNjcmRvcW5kenpkbHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjU0OTgsImV4cCI6MjA3NzQ0MTQ5OH0.ne-8UYArE_g5iOpiVCF0LdpGLoz5oD3Edi9lpVaRVu0
```

> **Nota:** Los valores anteriores son de ejemplo. Reemplázalos por las credenciales reales de tu proyecto.


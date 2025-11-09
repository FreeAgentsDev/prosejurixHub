# Configuración de Supabase

## ✅ Estado de la Configuración

El archivo `.env` ha sido creado automáticamente con tus credenciales de Supabase. La aplicación ahora está lista para conectarse a tu base de datos.

## Pasos para conectar con Supabase

1. **Archivo .env** ✅
   
   El archivo `.env` ya ha sido creado en la raíz del proyecto con las siguientes credenciales:

   ```
   VITE_SUPABASE_URL=https://laguwzscrdoqndzzdlpj.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZ3V3enNjcmRvcW5kenpkbHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjU0OTgsImV4cCI6MjA3NzQ0MTQ5OH0.ne-8UYArE_g5iOpiVCF0LdpGLoz5oD3Edi9lpVaRVu0
   ```

   **Nota importante:** En Vite, las variables de entorno deben usar el prefijo `VITE_` para ser accesibles en el cliente.
   
   Si necesitas cambiar las credenciales, edita el archivo `.env` y reinicia el servidor de desarrollo.

2. **Verificar nombre de la tabla**

   La aplicación busca la tabla `CTRANTECEDENTES`. Si el nombre de tu tabla en Supabase es diferente:
   
   - Abre `src/hooks/useProcesses.ts`
   - Busca todas las referencias a `'CTRANTECEDENTES'`
   - Reemplázalas con el nombre exacto de tu tabla

   La aplicación intenta automáticamente diferentes variaciones del nombre (mayúsculas, minúsculas, con guiones bajos, etc.) para encontrar la tabla correcta.

3. **Verificar estructura de columnas**

   La aplicación espera las siguientes columnas (pueden variar según tu estructura):

   - `id` (número)
   - `cliente_id` (número)
   - `cliente_nombre` (texto)
   - `cedula` (texto)
   - `estado` (texto: 'activo', 'finalizado', 'en_espera')
   - `estado_publico` (texto)
   - `tipo` (texto)
   - `fecha` (fecha)
   - `fecha_ingreso` (fecha)
   - `demandado` (texto)
   - `observaciones` (texto)
   - `observaciones_internas` (texto)
   - `observaciones_cliente` (texto)
   - `juzgado` (texto)
   - `placa_vehiculo` (texto)
   - `valor_honorarios` (número)
   - `valor_peritaje` (número)
   - `valor_prestamos` (número)
   - `gastos_adicionales` (número)
   - `fecha_radicacion` (fecha)

4. **Reiniciar el servidor de desarrollo**

   Después de crear el archivo `.env`, reinicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. **Verificar conexión**

   La aplicación ahora incluye validaciones automáticas que:
   - Verifican que el archivo `.env` esté configurado
   - Muestran mensajes de error claros en la consola si hay problemas
   - Intentan detectar automáticamente el nombre correcto de la tabla
   
   Para verificar la conexión:
   1. Abre la consola del navegador (F12)
   2. Busca mensajes que empiecen con ✓ (éxito) o ❌ (error)
   3. Si hay errores:
      - Verifica que las credenciales en `.env` sean correctas
      - Verifica que el nombre de la tabla sea exacto
      - Verifica los permisos de la tabla en Supabase (RLS - Row Level Security)
   
   **Mensajes importantes en consola:**
   - `✓ Conexión a Supabase verificada correctamente` - Todo está bien
   - `✓ Nombre de tabla correcto encontrado: "..."` - La tabla fue encontrada
   - `✓ Datos obtenidos de Supabase` - Los datos se cargaron exitosamente
   - `❌ ERROR: Variables de entorno de Supabase no configuradas` - Revisa tu archivo .env

## Ordenamiento de datos

Los datos se ordenan automáticamente por:
1. Nombre del cliente (ascendente)
2. Fecha de ingreso (descendente)

Esto significa que los procesos se agrupan por cliente y dentro de cada cliente, los más recientes aparecen primero.


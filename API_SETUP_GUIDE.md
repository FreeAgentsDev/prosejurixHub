# 🔧 Guía de Configuración de la API - Checklist Rápido

## ✅ Checklist de Verificación

### 1. Verificar que el servidor esté arrancado

**Comando para iniciar el servidor:**
```bash
# Desarrollo (con hot-reload)
npm run dev:server

# Producción
npm run server
```

**Verifica la salida en la terminal:**
```
🚀 Servidor API corriendo en http://localhost:3001
📝 Health check: http://localhost:3001/health
```

Si no ves este mensaje, el servidor no está corriendo.

### 2. Confirmar puerto correcto en frontend

El frontend usa por defecto `http://localhost:3001`. Si necesitas cambiar el puerto:

**Opción A: Variable de entorno (.env)**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3001
```

**Opción B: URL relativa (recomendado para desarrollo)**
Si el servidor está en el mismo origen:
```env
VITE_API_URL=/
```

**Verificar configuración actual:**
En la consola del navegador (F12), puedes ejecutar:
```javascript
import { getApiConfig } from './services/api';
console.log(getApiConfig());
```

### 3. Verificar que el servidor responde

**Desde la terminal:**
```bash
# Verificar health check
curl http://localhost:3001/health

# Debería responder:
# {"status":"ok","timestamp":"2024-..."}
```

**Desde el navegador:**
Abre `http://localhost:3001/health` en tu navegador. Deberías ver un JSON con `status: "ok"`.

### 4. Verificar variables de entorno del servidor

El servidor necesita estas variables en `.env.local` (raíz del proyecto):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
PORT=3001
```

**Verificar que el servidor puede conectarse a Supabase:**
Cuando inicias el servidor, no deberías ver errores sobre Supabase. Si los hay, verifica:
- Que el archivo `.env.local` existe
- Que las variables están correctamente escritas (sin espacios)
- Que las credenciales de Supabase son correctas

### 5. Verificar CORS (si frontend y backend en diferentes orígenes)

El servidor ya tiene CORS configurado con `app.use(cors())`, que permite todos los orígenes en desarrollo.

Si necesitas restringir CORS en producción, modifica `server/index.ts`:
```typescript
app.use(cors({
  origin: 'https://tu-dominio.com',
  credentials: true
}));
```

### 6. Probar endpoints manualmente

**Listar registros:**
```bash
curl http://localhost:3001/api/ctrantec
```

**Obtener un registro por ID:**
```bash
curl http://localhost:3001/api/ctrantec/1
# o
curl http://localhost:3001/api/ctrantec/PROC-123456
```

### 7. Verificar errores en la consola del navegador

Si ves errores como:
- `ERR_CONNECTION_REFUSED` → El servidor no está corriendo
- `CORS error` → Problema de configuración CORS
- `404 Not Found` → La ruta no existe en el servidor
- `500 Internal Server Error` → Error en el servidor (revisa logs del servidor)

### 8. Comandos útiles para debugging

**Ver logs del servidor:**
Cuando el servidor está corriendo, verás logs como:
```
[2024-01-01T12:00:00.000Z] GET /api/ctrantec
[2024-01-01T12:00:01.000Z] GET /api/ctrantec/1
```

**Verificar configuración desde el código:**
```javascript
import { getApiConfig, checkApiHealth } from './services/api';

// Ver configuración
console.log(getApiConfig());

// Verificar salud del servidor
checkApiHealth().then(result => {
  console.log(result);
});
```

## 🚨 Solución de Problemas Comunes

### Error: `ERR_CONNECTION_REFUSED`
**Solución:**
1. Verifica que el servidor esté corriendo: `npm run dev:server`
2. Verifica que el puerto no esté en uso por otro proceso
3. Verifica que la URL en `api.ts` sea correcta

### Error: `CORS policy`
**Solución:**
1. El servidor ya tiene CORS habilitado
2. Si persiste, verifica que el servidor esté corriendo
3. En producción, asegúrate de configurar CORS correctamente

### Error: `404 Not Found`
**Solución:**
1. Verifica que la ruta en el frontend coincida con la del servidor
2. Verifica que el servidor tenga las rutas configuradas
3. Revisa los logs del servidor para ver qué rutas se están recibiendo

### Error: `500 Internal Server Error`
**Solución:**
1. Revisa los logs del servidor en la terminal
2. Verifica que las variables de entorno estén configuradas
3. Verifica que Supabase esté accesible
4. Revisa que los datos enviados sean válidos

## 📝 Notas Importantes

1. **El servidor debe estar corriendo antes de usar el frontend** que dependa de la API
2. **Para desarrollo local**, puedes usar URL relativa (`VITE_API_URL=/`) si el servidor está en el mismo origen
3. **Para producción**, configura `VITE_API_URL` con la URL completa de tu API
4. **El cliente del cliente (proceso cliente) no necesita la API del servidor** - usa Supabase directamente

## 🔍 Verificación Rápida

Ejecuta este comando para verificar todo:
```bash
# 1. Verificar que el servidor responde
curl http://localhost:3001/health

# 2. Verificar que puedes listar registros
curl http://localhost:3001/api/ctrantec

# 3. Si ambos funcionan, el servidor está configurado correctamente
```

Si todos los comandos funcionan, el servidor está configurado correctamente y el frontend debería poder conectarse sin problemas.


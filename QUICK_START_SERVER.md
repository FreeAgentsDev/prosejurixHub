# 🚀 Inicio Rápido - Servidor API

## ✅ Verificación Rápida

**1. Verificar que el servidor esté corriendo:**
```bash
npm run check:server
```

Este comando verifica:
- Si el puerto está disponible
- Si el servidor responde al health check
- Si el endpoint de API está funcionando

## 📋 Opciones para Levantar el Servidor

### Opción 1: Servidor Real (Recomendado)

**Desarrollo (con hot-reload):**
```bash
npm run dev:server
```

**Producción:**
```bash
npm run server
```

**Verificar que está corriendo:**
Deberías ver en la terminal:
```
🚀 Servidor API corriendo en http://localhost:3001
📝 Health check: http://localhost:3001/health
```

### Opción 2: Proxy Server (Si el backend real está en otro puerto)

Si tu backend real está en otro puerto (por ejemplo, 3000), usa el proxy:

**macOS/Linux:**
```bash
TARGET=http://localhost:3000 PORT=3001 npm run proxy
```

**Windows PowerShell:**
```powershell
$env:TARGET='http://localhost:3000'; $env:PORT=3001; npm run proxy
```

**Windows CMD:**
```cmd
set TARGET=http://localhost:3000 && set PORT=3001 && npm run proxy
```

El proxy reenviará todas las peticiones de `localhost:3001` a `localhost:3000`.

### Opción 3: Mock Server (Para pruebas sin backend)

Si no tienes el backend configurado o quieres probar sin conexión a Supabase:

```bash
npm run mock
```

El mock server:
- Responde en `http://localhost:3001`
- Tiene datos de prueba predefinidos
- Implementa todos los endpoints CRUD
- No requiere conexión a Supabase

## 🔍 Verificación Manual

**1. Verificar que el puerto está escuchando:**

**macOS/Linux:**
```bash
lsof -i :3001
# o
netstat -an | grep 3001
```

**Windows:**
```cmd
netstat -ano | findstr 3001
```

**2. Probar health check:**
```bash
curl http://localhost:3001/health
```

Debería responder:
```json
{"status":"ok","timestamp":"2024-..."}
```

**3. Probar endpoint de API:**
```bash
curl http://localhost:3001/api/ctrantec
```

**4. Probar endpoint específico:**
```bash
curl http://localhost:3001/api/ctrantec/PROC-184ioy6eg
```

## 🛠️ Solución de Problemas

### Error: "Puerto 3001 en uso"

**Solución 1: Cambiar el puerto**
```bash
PORT=3002 npm run dev:server
```

**Solución 2: Ver qué proceso usa el puerto**

**macOS/Linux:**
```bash
lsof -i :3001
# Luego matar el proceso si es necesario
kill -9 <PID>
```

**Windows:**
```cmd
netstat -ano | findstr 3001
# Luego matar el proceso si es necesario
taskkill /PID <PID> /F
```

### Error: "ERR_CONNECTION_REFUSED"

1. Verifica que el servidor esté corriendo: `npm run check:server`
2. Verifica que el puerto sea correcto en el frontend
3. Verifica que no haya firewall bloqueando el puerto

### Error: "CORS policy"

El servidor ya tiene CORS habilitado. Si persiste:
1. Verifica que el servidor esté corriendo
2. En producción, configura CORS específicamente en `server/index.ts`

## 📝 Comandos Útiles

```bash
# Verificar servidor
npm run check:server

# Servidor real (desarrollo)
npm run dev:server

# Servidor real (producción)
npm run server

# Proxy server
npm run proxy

# Mock server
npm run mock
```

## 🔄 Flujo de Trabajo Recomendado

1. **Primero, verifica el servidor:**
   ```bash
   npm run check:server
   ```

2. **Si el servidor no está corriendo, inícialo:**
   ```bash
   npm run dev:server
   ```

3. **Si el servidor real no está disponible, usa el mock:**
   ```bash
   npm run mock
   ```

4. **Si el backend está en otro puerto, usa el proxy:**
   ```bash
   npm run proxy
   ```

5. **Inicia el frontend:**
   ```bash
   npm run dev
   ```

## 📚 Archivos Creados

- `proxy-server.js` - Proxy que reenvía peticiones a otro servidor
- `server-mock.js` - Servidor mock con datos de prueba
- `check-server.js` - Script de verificación del servidor
- `QUICK_START_SERVER.md` - Esta guía

## 💡 Notas Importantes

1. **El mock server es solo para desarrollo** - No usa datos reales
2. **El proxy server es temporal** - Úsalo solo si necesitas reenviar a otro puerto
3. **El servidor real requiere variables de entorno** - Verifica `.env.local`
4. **El cliente del cliente no necesita el servidor API** - Usa Supabase directamente


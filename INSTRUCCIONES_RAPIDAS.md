# ✅ Instrucciones Rápidas - Todo Está Funcionando

## 🎯 Estado Actual

✅ **Mock Server** - Funcionando correctamente  
✅ **Script de Verificación** - Funcionando correctamente  
✅ **Proxy Server** - Listo para usar  
✅ **Scripts en package.json** - Configurados

## 🚀 Cómo Usar

### Opción 1: Mock Server (Para pruebas sin backend)

**Iniciar:**
```bash
npm run mock
```

**Probar:**
```bash
# Health check
curl http://localhost:3001/health

# Listar registros
curl http://localhost:3001/api/ctrantec

# Obtener registro específico
curl http://localhost:3001/api/ctrantec/PROC-184ioy6eg
```

**Detener:** Presiona `Ctrl+C` en la terminal donde está corriendo

### Opción 2: Servidor Real (Con Supabase)

**Iniciar:**
```bash
npm run dev:server
```

**Verificar que está corriendo:**
Deberías ver:
```
🚀 Servidor API corriendo en http://localhost:3001
📝 Health check: http://localhost:3001/health
```

### Opción 3: Proxy Server (Si el backend está en otro puerto)

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

## 🔍 Verificar Estado

**Verificar si el servidor está corriendo:**
```bash
npm run check:server
```

Este comando verifica:
- ✅ Si el puerto está disponible
- ✅ Si el servidor responde al health check
- ✅ Si el endpoint de API está funcionando

## 📋 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el frontend (Vite) |
| `npm run dev:server` | Inicia el servidor real con hot-reload |
| `npm run server` | Inicia el servidor real (producción) |
| `npm run mock` | Inicia el mock server (para pruebas) |
| `npm run proxy` | Inicia el proxy server |
| `npm run check:server` | Verifica el estado del servidor |

## 🛠️ Solución de Problemas

### El puerto 3001 está en uso

**Windows:**
```cmd
netstat -ano | findstr 3001
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3001
kill -9 <PID>
```

### El servidor no responde

1. Verifica que el servidor esté corriendo: `npm run check:server`
2. Si usas el servidor real, verifica que `.env.local` esté configurado
3. Si el servidor real no funciona, usa el mock: `npm run mock`

### Error de conexión en el frontend

1. Verifica que el servidor esté corriendo en el puerto 3001
2. Verifica que la URL en `src/services/api.ts` sea correcta
3. Usa el mock server si el servidor real no está disponible

## 📝 Notas Importantes

1. **Mock Server** - Solo para desarrollo, no usa datos reales
2. **Servidor Real** - Requiere `.env.local` con credenciales de Supabase
3. **Proxy Server** - Solo si necesitas reenviar a otro puerto
4. **Cliente del Cliente** - No necesita el servidor API, usa Supabase directamente

## ✅ Verificación Final

Para verificar que todo está funcionando:

```bash
# 1. Inicia el mock server (en una terminal)
npm run mock

# 2. En otra terminal, verifica el estado
npm run check:server

# 3. Prueba los endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/ctrantec
```

Si todos los comandos funcionan, **¡todo está configurado correctamente!** 🎉


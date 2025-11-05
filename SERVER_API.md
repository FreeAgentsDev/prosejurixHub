# API Server - Documentación

Este servidor Express proporciona endpoints REST para operaciones CRUD en la tabla `CTRANTECEDENTES` usando Supabase con service_role key.

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto (este archivo NO se sube a Git):

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your_service_role_key
```

**⚠️ IMPORTANTE:** 
- Nunca subas el archivo `.env.local` a Git
- La `SUPABASE_SERVICE_ROLE_KEY` tiene permisos administrativos completos
- Solo debe usarse en el servidor, nunca en el cliente

### 3. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev:server

# Producción
npm run server
```

El servidor estará disponible en `http://localhost:3001` (o el puerto especificado en `PORT`).

## 📋 Endpoints Disponibles

### Health Check
```
GET /health
```

### Crear Registro
```
POST /api/ctrantec
Content-Type: application/json

Body:
{
  "cedula": "1234567890",
  "cliente_nombre": "Juan Pérez",
  "proceso_id": "PROC-001",
  "estado": "activo",
  "codigo_acceso": "ABC123",
  ...
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Registro creado exitosamente",
  "data": { ... }
}
```

### Listar Registros
```
GET /api/ctrantec?page=1&limit=50&estado=activo&cliente_id=1
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 50, max: 100)
- `estado` (opcional): Filtrar por estado
- `cliente_id` (opcional): Filtrar por cliente_id
- `codigo_acceso` (opcional): Filtrar por código de acceso

**Respuesta exitosa (200):**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### Obtener Registro por ID
```
GET /api/ctrantec/:id
```

**Respuesta exitosa (200):**
```json
{
  "data": { ... }
}
```

**Respuesta error (404):**
```json
{
  "error": "Not Found",
  "message": "No se encontró un registro con ID 123"
}
```

### Actualizar Registro
```
PUT /api/ctrantec/:id
Content-Type: application/json

Body:
{
  "estado": "completado",
  "observaciones": "Proceso finalizado",
  ...
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Registro actualizado exitosamente",
  "data": { ... }
}
```

### Eliminar Registro
```
DELETE /api/ctrantec/:id
```

**Respuesta exitosa (200):**
```json
{
  "message": "Registro eliminado exitosamente",
  "data": { ... }
}
```

## 🔒 Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Registro creado exitosamente
- `400 Bad Request`: Error de validación o parámetros inválidos
- `404 Not Found`: Registro no encontrado
- `409 Conflict`: Violación de constraint único
- `500 Internal Server Error`: Error interno del servidor

## ✅ Validaciones

### Campos Validados

- **Strings**: `cedula`, `cliente_nombre`, `proceso_id`, `estado`, `codigo_acceso`, `celular`, `telefono`
  - Longitud máxima validada
  - Trim automático
  
- **Números**: `cliente_id`, `valor_honorarios`, `valor_peritaje`, `valor_prestamos`, `gastos_adicionales`
  - Validación de tipo numérico
  
- **Fechas**: `fecha`, `fecha_ingreso`, `fecha_radicacion`
  - Formato ISO válido

### Validaciones de ID

- Debe ser un número entero positivo
- Validación antes de cada operación GET/PUT/DELETE

## 🧪 Pruebas con Postman/Insomnia

### Ejemplo: Crear registro

```bash
curl -X POST http://localhost:3001/api/ctrantec \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "1234567890",
    "cliente_nombre": "Juan Pérez",
    "proceso_id": "PROC-001",
    "estado": "activo",
    "codigo_acceso": "ABC123"
  }'
```

### Ejemplo: Actualizar registro

```bash
curl -X PUT http://localhost:3001/api/ctrantec/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "completado",
    "observaciones": "Proceso finalizado"
  }'
```

### Ejemplo: Eliminar registro

```bash
curl -X DELETE http://localhost:3001/api/ctrantec/1
```

## 🔐 Seguridad

1. **Service Role Key**: Solo se usa en el servidor, nunca en el cliente
2. **Validaciones**: Todos los inputs son validados antes de procesarse
3. **Logs**: Errores se registran en consola del servidor (no se exponen detalles al cliente)
4. **Variables de entorno**: `.env.local` está en `.gitignore`

## 📝 Ejemplo de uso desde el Frontend

```typescript
// Crear registro
const createRecord = async (data: ControlProcesoAntecedente) => {
  const res = await fetch('http://localhost:3001/api/ctrantec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear registro');
  }
  
  return res.json();
};

// Actualizar registro
const updateRecord = async (id: number, data: Partial<ControlProcesoAntecedente>) => {
  const res = await fetch(`http://localhost:3001/api/ctrantec/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar registro');
  }
  
  return res.json();
};

// Eliminar registro
const deleteRecord = async (id: number) => {
  const res = await fetch(`http://localhost:3001/api/ctrantec/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar registro');
  }
  
  return res.json();
};
```

## 🚨 Troubleshooting

### Error: "Variables de entorno de Supabase Admin no configuradas"
- Verifica que existe el archivo `.env.local` en la raíz del proyecto
- Verifica que las variables `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` están configuradas

### Error: "Error de conexión a Supabase Admin"
- Verifica que las credenciales en `.env.local` son correctas
- Verifica que la tabla `CTRANTECEDENTES` existe en tu proyecto de Supabase

### Error: "Port already in use"
- Cambia el puerto en la variable de entorno `PORT` o en `server/index.ts`


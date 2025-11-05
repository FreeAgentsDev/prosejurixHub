# Servicio API

Este servicio maneja todas las comunicaciones con el servidor API backend.

## Configuración

Asegúrate de tener configurada la variable de entorno `VITE_API_URL` en tu archivo `.env`:

```env
VITE_API_URL=http://localhost:3001
```

Si no se configura, por defecto usará `http://localhost:3001`.

## Uso

```typescript
import * as api from '../services/api';

// Crear un registro
const newRecord = await api.createRecord({
  cliente_nombre: 'Juan Pérez',
  estado: 'activo',
  // ... otros campos
});

// Actualizar un registro
await api.updateRecord(1, {
  estado: 'completado',
});

// Eliminar un registro
await api.deleteRecord(1);

// Obtener un registro
const record = await api.getRecordById(1);

// Obtener todos los registros (con paginación)
const records = await api.getRecords({
  page: 1,
  limit: 50,
  estado: 'activo'
});
```

## Funciones Disponibles

- `getRecords(params?)` - Obtener lista de registros con paginación
- `getRecordById(id)` - Obtener un registro por ID
- `createRecord(data)` - Crear un nuevo registro
- `updateRecord(id, data)` - Actualizar un registro existente
- `deleteRecord(id)` - Eliminar un registro
- `checkApiHealth()` - Verificar que la API esté funcionando



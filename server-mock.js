/**
 * Mock API Server - Responde con datos de prueba para desarrollo
 * 
 * Uso:
 *   node server-mock.js
 * 
 * O con puerto personalizado:
 *   PORT=3001 node server-mock.js
 */

import http from 'http';

const PORT = process.env.PORT || 3001;

// Datos de prueba
const mockData = {
  'PROC-184ioy6eg': {
    id: 1,
    proceso_id: 'PROC-184ioy6eg',
    cliente_nombre: 'Cliente de Prueba',
    cedula: '1234567890',
    estado: 'activo',
    estado_publico: 'En Evaluación',
    tipo: 'civil',
    fecha: '2024-01-15',
    fecha_ingreso: '2024-01-10',
    observaciones: 'Este es un registro de prueba generado por el mock server',
    demandado: 'Demandado de Prueba',
    codigo_acceso: 'TEST123'
  }
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

  // Health check
  if (path === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      server: 'mock'
    }));
    return;
  }

  // GET /api/ctrantec/:id
  if (req.method === 'GET' && path.startsWith('/api/ctrantec/')) {
    const id = path.split('/').pop();
    
    if (mockData[id]) {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        data: mockData[id],
        message: 'Datos de prueba (mock server)'
      }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ 
        error: 'Not Found',
        message: `No se encontró un registro con ID: ${id}`,
        availableIds: Object.keys(mockData)
      }));
    }
    return;
  }

  // GET /api/ctrantec (listar todos)
  if (req.method === 'GET' && path === '/api/ctrantec') {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    const allData = Object.values(mockData);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = allData.slice(start, end);

    res.writeHead(200);
    res.end(JSON.stringify({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: allData.length,
        totalPages: Math.ceil(allData.length / limit)
      },
      message: 'Datos de prueba (mock server)'
    }));
    return;
  }

  // POST /api/ctrantec
  if (req.method === 'POST' && path === '/api/ctrantec') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body);
      const newId = `PROC-${Date.now()}`;
      const newRecord = { id: Date.now(), proceso_id: newId, ...data };
      mockData[newId] = newRecord;
      
      res.writeHead(201);
      res.end(JSON.stringify({ 
        message: 'Registro creado exitosamente (mock)',
        data: newRecord
      }));
    });
    return;
  }

  // PUT /api/ctrantec/:id
  if (req.method === 'PUT' && path.startsWith('/api/ctrantec/')) {
    const id = path.split('/').pop();
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (mockData[id]) {
        mockData[id] = { ...mockData[id], ...JSON.parse(body) };
        res.writeHead(200);
        res.end(JSON.stringify({ 
          message: 'Registro actualizado exitosamente (mock)',
          data: mockData[id]
        }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found', message: `No se encontró un registro con ID: ${id}` }));
      }
    });
    return;
  }

  // DELETE /api/ctrantec/:id
  if (req.method === 'DELETE' && path.startsWith('/api/ctrantec/')) {
    const id = path.split('/').pop();
    if (mockData[id]) {
      delete mockData[id];
      res.writeHead(200);
      res.end(JSON.stringify({ 
        message: 'Registro eliminado exitosamente (mock)'
      }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found', message: `No se encontró un registro con ID: ${id}` }));
    }
    return;
  }

  // Ruta no encontrada
  res.writeHead(404);
  res.end(JSON.stringify({ 
    error: 'Not Found',
    message: `Ruta no encontrada: ${path}`,
    availableRoutes: [
      'GET /health',
      'GET /api/ctrantec',
      'GET /api/ctrantec/:id',
      'POST /api/ctrantec',
      'PUT /api/ctrantec/:id',
      'DELETE /api/ctrantec/:id'
    ]
  }));
});

server.listen(PORT, () => {
  console.log(`✅ Mock API Server escuchando en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET    /health`);
  console.log(`   GET    /api/ctrantec`);
  console.log(`   GET    /api/ctrantec/:id`);
  console.log(`   POST   /api/ctrantec`);
  console.log(`   PUT    /api/ctrantec/:id`);
  console.log(`   DELETE /api/ctrantec/:id`);
  console.log(`\n💡 Este es un servidor de prueba. Para detener, presiona Ctrl+C`);
  console.log(`\n📝 Datos de prueba disponibles: ${Object.keys(mockData).join(', ')}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso.`);
    console.error(`💡 Solución: Cambia el puerto con PORT=3002 node server-mock.js`);
  } else {
    console.error('❌ Error en servidor mock:', err);
  }
  process.exit(1);
});


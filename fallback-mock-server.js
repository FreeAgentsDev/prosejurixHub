/**
 * Fallback Mock Server - Solo se activa si la API local no existe
 * 
 * Uso (solo en desarrollo):
 *   node fallback-mock-server.js
 * 
 * Este servidor solo debe usarse si:
 * 1. La API en http://localhost:3001/api/ctrantec/:id devuelve 404
 * 2. Estás en entorno de desarrollo
 * 3. Necesitas datos de prueba para desarrollo frontend
 */

import http from 'http';

const PORT = process.env.PORT || 3001;

// Verificar si ya hay un servidor corriendo
const checkExistingServer = async () => {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/health',
        method: 'GET',
        timeout: 2000
      },
      (res) => {
        resolve(true); // Servidor existe
      }
    );
    
    req.on('error', () => {
      resolve(false); // No hay servidor
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
};

// Datos de prueba básicos
const mockData = {
  '1': {
    id: 1,
    proceso_id: 'PROC-184ioy6eg',
    cliente_nombre: 'Cliente de Prueba',
    cedula: '1234567890',
    estado: 'activo',
    estado_publico: 'En Evaluación',
    tipo: 'civil',
    fecha: '2024-01-15',
    fecha_ingreso: '2024-01-10',
    observaciones: 'Este es un registro de prueba generado por el fallback mock server',
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
    res.end(JSON.stringify({ status: 'ok', mock: true, timestamp: new Date().toISOString() }));
    return;
  }

  // GET /api/ctrantec/:id
  const match = path.match(/^\/api\/ctrantec\/(.+)$/);
  if (match && req.method === 'GET') {
    const id = decodeURIComponent(match[1]);
    
    // Buscar en datos mock
    const record = mockData[id] || mockData['1']; // Fallback al primer registro
    
    if (record) {
      res.writeHead(200);
      res.end(JSON.stringify({ data: record }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({
        error: 'Not Found',
        message: `No se encontró un registro con ID o proceso_id: ${id}`,
        mock: true
      }));
    }
    return;
  }

  // GET /api/ctrantec (listar)
  if (path === '/api/ctrantec' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      data: Object.values(mockData),
      pagination: {
        page: 1,
        limit: 50,
        total: Object.keys(mockData).length,
        totalPages: 1
      },
      mock: true
    }));
    return;
  }

  // 404 para otras rutas
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Not Found',
    message: `Ruta ${req.method} ${path} no encontrada (mock server)`,
    mock: true
  }));
});

// Verificar si ya hay un servidor antes de iniciar
checkExistingServer().then((hasServer) => {
  if (hasServer) {
    console.log(`⚠️  Ya hay un servidor corriendo en el puerto ${PORT}`);
    console.log(`⚠️  No se iniciará el mock server. Usa el servidor existente.`);
    process.exit(0);
  } else {
    server.listen(PORT, () => {
      console.log(`🔧 Fallback Mock Server iniciado en http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Mock API Routes:`);
      console.log(`   GET    /api/ctrantec/:id - Obtener registro por ID (mock)`);
      console.log(`   GET    /api/ctrantec - Listar registros (mock)`);
      console.log(`⚠️  NOTA: Este es un servidor MOCK. Solo para desarrollo.`);
    });
  }
});


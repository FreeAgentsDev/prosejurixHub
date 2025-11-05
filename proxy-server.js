/**
 * Proxy Server - Reenvía peticiones de localhost:3001 al backend real
 * 
 * Uso:
 *   TARGET=http://localhost:3000 PORT=3001 node proxy-server.js
 * 
 * Windows PowerShell:
 *   $env:TARGET='http://localhost:3000'; $env:PORT=3001; node proxy-server.js
 * 
 * Windows CMD:
 *   set TARGET=http://localhost:3000 && set PORT=3001 && node proxy-server.js
 */

import http from 'http';
import { createProxyServer } from 'http-proxy';

const PORT = process.env.PORT || 3001;
const TARGET = process.env.TARGET || 'http://localhost:3000'; // Cambiar si tu backend está en otro puerto

console.log(`🔀 Iniciando proxy en puerto ${PORT}...`);
console.log(`📡 Reenviando peticiones a: ${TARGET}`);

const proxy = createProxyServer({
  target: TARGET,
  changeOrigin: true,
  ws: true, // Soporte para WebSockets si es necesario
});

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${TARGET}${req.url}`);
  
  proxy.web(req, res, { target: TARGET }, (err) => {
    console.error('❌ Error en proxy:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Bad Gateway', 
      message: `No se pudo conectar al servidor en ${TARGET}. Verifica que el servidor esté corriendo.`,
      details: err.message 
    }));
  });
});

// Manejar errores de WebSocket si es necesario
proxy.on('error', (err, req, res) => {
  console.error('❌ Error en proxy:', err);
  if (res && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Proxy Error',
      message: err.message 
    }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Proxy escuchando en http://localhost:${PORT}`);
  console.log(`📋 Las peticiones a /api/* serán reenviadas a ${TARGET}/api/*`);
  console.log(`\n💡 Para detener el proxy, presiona Ctrl+C`);
});

// Manejo de errores del servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso.`);
    console.error(`💡 Solución: Cambia el puerto con PORT=3002 node proxy-server.js`);
  } else {
    console.error('❌ Error en servidor proxy:', err);
  }
  process.exit(1);
});


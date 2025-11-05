/**
 * Script de verificación del servidor API
 * 
 * Uso:
 *   node check-server.js
 * 
 * O con puerto/URL personalizado:
 *   PORT=3001 URL=http://localhost:3001 node check-server.js
 */

import http from 'http';

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.URL || `http://localhost:${PORT}`;

console.log(`🔍 Verificando servidor en: ${BASE_URL}\n`);

// Verificar health check
function checkHealth() {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/health`;
    console.log(`📡 Verificando: GET ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Health check OK (${res.statusCode})`);
          try {
            const json = JSON.parse(data);
            console.log(`   Respuesta:`, json);
          } catch (e) {
            console.log(`   Respuesta: ${data}`);
          }
          resolve(true);
        } else {
          console.log(`⚠️  Health check respondió con status ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Error de conexión: ${err.message}`);
      console.log(`   Posibles causas:`);
      console.log(`   - El servidor no está corriendo en ${BASE_URL}`);
      console.log(`   - El puerto está bloqueado o en uso por otro proceso`);
      console.log(`   - Problema de red/firewall`);
      reject(err);
    });
  });
}

// Verificar endpoint de API
function checkApiEndpoint() {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/api/ctrantec`;
    console.log(`\n📡 Verificando: GET ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log(`✅ API endpoint respondió (${res.statusCode})`);
          try {
            const json = JSON.parse(data);
            if (json.data) {
              console.log(`   Encontrados ${Array.isArray(json.data) ? json.data.length : 1} registro(s)`);
            } else {
              console.log(`   Respuesta:`, json);
            }
          } catch (e) {
            console.log(`   Respuesta: ${data.substring(0, 100)}...`);
          }
          resolve(true);
        } else {
          console.log(`⚠️  API endpoint respondió con status ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Error de conexión: ${err.message}`);
      reject(err);
    });
  });
}

// Verificar puerto
function checkPort() {
  return new Promise((resolve) => {
    const testServer = http.createServer();
    testServer.listen(PORT, () => {
      testServer.close(() => {
        console.log(`✅ Puerto ${PORT} está disponible`);
        resolve(true);
      });
    });
    
    testServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Puerto ${PORT} está en uso`);
        console.log(`   Esto significa que hay un proceso escuchando en ese puerto`);
        console.log(`   Puede ser el servidor que estás buscando, o otro proceso`);
      } else {
        console.log(`❌ Error al verificar puerto: ${err.message}`);
      }
      resolve(false);
    });
  });
}

// Ejecutar verificaciones
async function runChecks() {
  console.log('='.repeat(50));
  console.log('VERIFICACIÓN DE SERVIDOR API');
  console.log('='.repeat(50));
  console.log(`Puerto: ${PORT}`);
  console.log(`URL: ${BASE_URL}`);
  console.log('='.repeat(50));
  console.log();

  // Verificar puerto
  await checkPort();
  console.log();

  // Verificar health check
  try {
    await checkHealth();
  } catch (err) {
    console.log(`\n❌ El servidor no está disponible en ${BASE_URL}`);
    console.log(`\n💡 Soluciones:`);
    console.log(`   1. Inicia el servidor con: npm run dev:server`);
    console.log(`   2. O usa el mock server: node server-mock.js`);
    console.log(`   3. O usa el proxy server: TARGET=http://localhost:3000 PORT=3001 node proxy-server.js`);
    process.exit(1);
  }

  // Verificar endpoint de API
  try {
    await checkApiEndpoint();
  } catch (err) {
    console.log(`\n⚠️  No se pudo verificar el endpoint de API`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Verificación completada');
  console.log('='.repeat(50));
}

runChecks().catch(err => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});


/**
 * Servidor Express para API Routes
 * Este servidor maneja las operaciones CRUD de CTRANTECEDENTES
 * usando Supabase con service_role key
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno desde .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Importar rutas
import ctrantecRoutes from './api/ctrantec/index.js';
import ctrantecIdRoutes from './api/ctrantec/id.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/ctrantec', ctrantecRoutes);
app.use('/api/ctrantec', ctrantecIdRoutes); // Rutas con parámetro :id

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error interno',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Ruta ${req.method} ${req.path} no encontrada`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API Routes:`);
  console.log(`   POST   /api/ctrantec - Crear registro`);
  console.log(`   GET    /api/ctrantec - Listar registros`);
  console.log(`   GET    /api/ctrantec/:id - Obtener registro por ID`);
  console.log(`   PUT    /api/ctrantec/:id - Actualizar registro`);
  console.log(`   DELETE /api/ctrantec/:id - Eliminar registro`);
});

export default app;


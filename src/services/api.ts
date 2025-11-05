/**
 * Servicio para llamadas a la API del servidor
 * Este servicio maneja todas las operaciones CRUD con los endpoints del servidor
 */

// Configuración de la URL base de la API
// Si VITE_API_URL está definido, lo usa; si no, usa localhost:3001
// Si VITE_API_URL es una cadena vacía o '/', usa URL relativa (mismo origen)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const USE_RELATIVE_URL = !API_BASE_URL || API_BASE_URL === '/' || API_BASE_URL === '';

// Timeout para peticiones (30 segundos)
const REQUEST_TIMEOUT = 30000;

export interface ApiError {
  error: string;
  message: string;
  errors?: string[];
  details?: string;
}

/**
 * Función helper para crear un timeout en fetch
 */
function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: La petición tardó demasiado')), timeout)
    )
  ]);
}

/**
 * Función helper para hacer peticiones a la API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Construir URL: si USE_RELATIVE_URL es true, usar URL relativa
  const baseUrl = USE_RELATIVE_URL ? '' : API_BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    // Intentar hacer la petición con timeout
    const response = await fetchWithTimeout(url, config, REQUEST_TIMEOUT);
    
    // Si la respuesta no tiene contenido (status 204), retornar directamente
    if (response.status === 204) {
      return {} as T;
    }

    // Intentar parsear JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        // Si no se puede parsear JSON, leer como texto
        const text = await response.text();
        throw new Error(`Error al parsear respuesta: ${text}`);
      }
    } else {
      // Si no es JSON, leer como texto
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const error: ApiError = data;
      
      // Distinguir diferentes tipos de errores con mensajes claros incluyendo el ID probado
      if (response.status === 404) {
        const idInUrl = endpoint.match(/\/([^\/]+)$/)?.[1] || 'desconocido';
        throw new Error(error.message || `No se encontró el proceso con ID "${idInUrl}". Verifica el ID o contacta al administrador.`);
      } else if (response.status === 400) {
        const idInUrl = endpoint.match(/\/([^\/]+)$/)?.[1] || 'desconocido';
        throw new Error(error.message || `Error de validación para ID "${idInUrl}": ${error.error || 'Datos inválidos'}`);
      } else if (response.status === 500) {
        throw new Error(error.message || `Error del servidor. Por favor, intente más tarde`);
      } else {
        throw new Error(error.message || error.error || `Error ${response.status}: ${response.statusText}`);
      }
    }

    return data;
  } catch (error) {
    // Manejar diferentes tipos de errores
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Error de conexión (servidor no disponible, CORS, etc.)
      const errorMessage = USE_RELATIVE_URL
        ? 'Error de conexión: El servidor no está disponible. Verifica que el servidor esté corriendo.'
        : `Error de conexión: No se pudo conectar a ${API_BASE_URL}. Verifica que el servidor esté corriendo en ese puerto.`;
      throw new Error(errorMessage);
    }
    
    if (error instanceof Error) {
      // Si es un error de timeout
      if (error.message.includes('Timeout')) {
        throw new Error(`Timeout: El servidor no respondió en ${REQUEST_TIMEOUT / 1000} segundos. Verifica que el servidor esté disponible.`);
      }
      throw error;
    }
    
    throw new Error('Error desconocido al comunicarse con la API');
  }
}

/**
 * Obtener todos los registros (con paginación y filtros opcionales)
 */
export async function getRecords(params?: {
  page?: number;
  limit?: number;
  estado?: string;
  cliente_id?: number;
  codigo_acceso?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.estado) queryParams.append('estado', params.estado);
  if (params?.cliente_id) queryParams.append('cliente_id', params.cliente_id.toString());
  if (params?.codigo_acceso) queryParams.append('codigo_acceso', params.codigo_acceso);

  const queryString = queryParams.toString();
  const endpoint = `/api/ctrantec${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<{ data: any[]; pagination: any }>(endpoint, {
    method: 'GET',
  });
}

/**
 * Obtener un registro por ID
 */
export async function getRecordById(id: number | string) {
  return apiRequest<{ data: any }>(`/api/ctrantec/${id}`, {
    method: 'GET',
  });
}

/**
 * Crear un nuevo registro
 */
export async function createRecord(data: any) {
  return apiRequest<{ message: string; data: any }>('/api/ctrantec', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualizar un registro
 */
export async function updateRecord(id: number | string, data: any) {
  return apiRequest<{ message: string; data: any }>(`/api/ctrantec/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Eliminar un registro
 */
export async function deleteRecord(id: number | string) {
  return apiRequest<{ message: string; data: any }>(`/api/ctrantec/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Health check de la API
 */
export async function checkApiHealth(): Promise<{ available: boolean; message?: string }> {
  try {
    const baseUrl = USE_RELATIVE_URL ? '' : API_BASE_URL;
    const response = await fetchWithTimeout(`${baseUrl}/health`, {}, 5000);
    return { 
      available: response.ok,
      message: response.ok ? 'Servidor disponible' : `Servidor respondió con status ${response.status}`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { 
      available: false,
      message: `Servidor no disponible: ${errorMessage}. Asegúrate de que el servidor esté corriendo con 'npm run dev:server' o 'npm run server'`
    };
  }
}

/**
 * Obtener información de configuración de la API (útil para debugging)
 */
export function getApiConfig() {
  return {
    baseUrl: USE_RELATIVE_URL ? '(URL relativa - mismo origen)' : API_BASE_URL,
    useRelativeUrl: USE_RELATIVE_URL,
    timeout: REQUEST_TIMEOUT,
    envVar: import.meta.env.VITE_API_URL || '(no configurado)'
  };
}



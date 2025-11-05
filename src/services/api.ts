/**
 * Servicio para llamadas a la API del servidor
 * Este servicio maneja todas las operaciones CRUD con los endpoints del servidor
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
  message: string;
  errors?: string[];
  details?: string;
}

/**
 * Función helper para hacer peticiones a la API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = data;
      throw new Error(error.message || error.error || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
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
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}



import { Link, useNavigate } from 'react-router-dom';
import ClientLoginForm from '../../components/cliente/ClientLoginForm';
import { supabase } from '../../lib/supabase';

const ClienteLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (clienteIdInput: string) => {
    try {
      // Validar que supabase esté inicializado
      if (!supabase) {
        console.error('❌ Supabase no está inicializado');
        alert('Error de conexión. Por favor, verifica la configuración e intente más tarde.');
        return;
      }
      // Validar y normalizar ID del cliente (cliente_id en la tabla CTRANTECEDENTES)
      const clienteId = Number(String(clienteIdInput).trim());

      if (!clienteId || Number.isNaN(clienteId)) {
        alert('Por favor ingresa un ID de cliente válido (número).');
        return;
      }

      // Intentar con el nombre de tabla indicado
      const tableName = 'CTRANTECEDENTES';
      
      // Primero, obtener un registro para ver la estructura real de la tabla
      console.log('🔍 Obteniendo estructura de la tabla...');
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error('❌ Error al acceder a la tabla:', sampleError);
        if (sampleError.message?.includes('relation') || sampleError.message?.includes('does not exist')) {
          alert('La tabla CTRANTECEDENTES no existe. Verifica el nombre de la tabla en Supabase.');
        } else if (sampleError.message?.includes('permission') || sampleError.code === 'PGRST301') {
          alert('Error de permisos. Contacta al administrador.');
        } else {
          alert(`Error al conectar con la base de datos: ${sampleError.message || 'Error desconocido'}`);
        }
        return;
      }

      // Si tenemos datos de muestra, identificar el nombre correcto de la columna cliente_id
      let clienteIdColumnName: string | null = null;
      if (sampleData && sampleData.length > 0) {
        const columnas = Object.keys(sampleData[0]);
        console.log('📋 Columnas disponibles en la tabla:', columnas);
        
        // Buscar el nombre de la columna cliente_id (puede estar en diferentes formatos)
        const posiblesNombresClienteId = [
          'cliente_id', 'clienteId', 'CLIENTE_ID', 'Cliente_ID',
          'clienteId', 'CLIENTEID', 'id_cliente', 'ID_CLIENTE'
        ];
        clienteIdColumnName = posiblesNombresClienteId.find(name => 
          columnas.includes(name) || 
          columnas.some(col => col.toLowerCase().replace(/\s+/g, '_') === name.toLowerCase().replace(/\s+/g, '_'))
        ) || columnas.find(col => 
          col.toLowerCase().includes('cliente') && col.toLowerCase().includes('id')
        ) || null;
        
        if (!clienteIdColumnName) {
          // Fallback: muchas tablas usan 'ID' como identificador del cliente
          const idColumn = columnas.find(col => col.toLowerCase() === 'id');
          if (idColumn) {
            clienteIdColumnName = idColumn;
            console.warn(`⚠️ No se encontró columna cliente_id. Usando columna fallback "${idColumn}"`);
          } else {
            // Si no encontramos cliente_id ni ID, mostrar columnas disponibles
            console.warn('⚠️ No se encontró columna cliente_id. Columnas disponibles:', columnas);
            alert(`No se encontró columna cliente_id en la tabla. Columnas disponibles: ${columnas.slice(0, 10).join(', ')}${columnas.length > 10 ? '...' : ''}`);
            return;
          }
        }
        
        console.log(`✅ Columna cliente_id encontrada: "${clienteIdColumnName}"`);
      } else {
        // Si no hay datos, intentar con nombres comunes
        clienteIdColumnName = 'cliente_id';
        console.log('⚠️ Tabla vacía, usando nombre de columna por defecto: "cliente_id"');
      }
      
      // Buscar todos los procesos del cliente por cliente_id (o columna fallback)
      console.log('🔎 Buscando procesos del cliente...', { tableName, clienteIdColumn: clienteIdColumnName, clienteId });
      let { data: procesosCliente, error: queryError } = await supabase
        .from(tableName)
        .select('*')
        .eq(clienteIdColumnName, clienteId);
      // Si la columna es texto y el filtro numérico falla, reintentar como string
      if ((!procesosCliente || procesosCliente.length === 0) && !queryError) {
        const retry = await supabase
          .from(tableName)
          .select('*')
          .eq(clienteIdColumnName, String(clienteId));
        if (!retry.error && retry.data) procesosCliente = retry.data;
      }
      
      if (queryError) {
        console.error('❌ Error en la consulta:', queryError);
        alert(`Error al buscar los procesos del cliente: ${queryError.message || 'Error desconocido'}`);
        return;
      }

      if (!procesosCliente || procesosCliente.length === 0) {
        console.warn(`⚠️ No se encontraron procesos para el cliente con ID ${clienteId}`);
        alert(`No se encontraron procesos para el cliente con ID ${clienteId}. Verifica el ID e intenta nuevamente.`);
        return;
      }

      console.log(`✅ Procesos encontrados para el cliente ${clienteId}: ${procesosCliente.length}`);
      console.log('📊 Procesos encontrados (por cliente_id/ID):', procesosCliente);

      // Obtener información del cliente del primer proceso
      const primerProceso = procesosCliente[0];
      const columnas = Object.keys(primerProceso);
      
      // Identificar el nombre de la columna de cédula/NIT
      const posiblesNombresCedula = [
        'CÉDULA / NIT',
        'CÉDULA_NIT',
        'CÉDULA/NIT',
        'cedula_nit',
        'cedula',
        'Cedula',
        'CÉDULA',
        'CEDULA',
        'nit',
        'NIT',
        'Cédula / NIT',
        'cedula_nit_1'
      ];
      
      const cedulaColumnName = posiblesNombresCedula.find(name => 
        columnas.includes(name) || 
        columnas.some(col => col.toLowerCase().replace(/\s+/g, '_') === name.toLowerCase().replace(/\s+/g, '_'))
      ) || columnas.find(col => 
        col.toLowerCase().includes('cedula') || 
        col.toLowerCase().includes('nit') ||
        col.toLowerCase().includes('cédula')
      ) || null;

      const cedula = cedulaColumnName ? primerProceso[cedulaColumnName] : '';

      // Si tenemos cédula, buscar TODOS los registros con esa misma cédula en todas las columnas equivalentes
      let procesosPorCedula = procesosCliente;
      if (cedula && String(cedula).trim() !== '') {
        try {
          // Detectar todas las columnas que representen cédula/NIT en esta tabla
          const posiblesCedulaCols = Array.from(new Set([
            ...(Array.isArray(columnas) ? columnas : []).filter(col => {
              const n = col.toLowerCase();
              return n.includes('cédula') || n.includes('cedula') || n.includes('nit');
            }),
            'CÉDULA / NIT', 'CÉDULA_NIT', 'CÉDULA/NIT', 'cedula_nit', 'cedula', 'Cedula', 'CÉDULA', 'CEDULA', 'nit', 'NIT'
          ]));

          const consultas = posiblesCedulaCols.map(col =>
            supabase
              .from(tableName)
              .select('*')
              .eq(col, cedula)
          );

          const resultados = await Promise.all(consultas);
          const combinados: any[] = [];
          const seen = new Set<string>();
          const getRowKey = (row: any): string => {
            return String(
              row.proceso_id ?? row.procesoId ?? row.ID ?? row.id ?? `${row[colCedula] ?? ''}-${row.RADICADO ?? row.radicado ?? ''}`
            );
          };

          for (const r of resultados) {
            if (r.data && Array.isArray(r.data)) {
              for (const row of r.data) {
                const key = getRowKey(row);
                if (!seen.has(key)) {
                  seen.add(key);
                  combinados.push(row);
                }
              }
            }
          }

          if (combinados.length > 0) {
            procesosPorCedula = combinados;
          }
          console.log(`🔎 Búsqueda por cédula en ${posiblesCedulaCols.length} columnas → ${procesosPorCedula.length} filas`);
        } catch (e) {
          console.warn('⚠️ Error buscando por cédula, se usan resultados por ID únicamente:', e);
        }
      }

      console.log(`✅ Procesos totales a mostrar: ${procesosPorCedula.length}`);
      console.log('📋 IDs de procesos:', procesosPorCedula.map((p: any) => p.proceso_id || p.procesoId || p.ID || p.id));

      navigate('/portal/proceso', {
        state: { 
          clienteId: clienteId,
          cedula: cedula || '',
          procesos: procesosPorCedula
        }
      });
    } catch (error) {
      console.error('❌ Error inesperado en login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Detalles del error:', errorMessage);
      alert(`Error inesperado: ${errorMessage}. Por favor, contacta al soporte técnico.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/prosejurix-rounded.png"
              alt="Prosejurix Logo"
              className="h-16 sm:h-20 mx-auto drop-shadow"
            />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal del Cliente</h2>
          <p className="text-slate-600 mt-1">Consulta el estado de tus procesos legales</p>
        </div>

        <ClientLoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default ClienteLogin;


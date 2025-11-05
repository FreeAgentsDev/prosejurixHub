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
      // Validar y normalizar ID (basado en el CSV, el campo ID es numérico)
      const procesoId = Number(String(clienteIdInput).trim());

      if (!procesoId || Number.isNaN(procesoId)) {
        alert('Por favor ingresa un ID válido (número).');
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

      // Si tenemos datos de muestra, identificar el nombre correcto de la columna ID
      let idColumnName: string | null = null;
      if (sampleData && sampleData.length > 0) {
        const columnas = Object.keys(sampleData[0]);
        console.log('📋 Columnas disponibles en la tabla:', columnas);
        
        // Buscar el nombre de la columna ID (puede estar en diferentes formatos)
        const posiblesNombresId = ['ID', 'id', 'Id', 'iD', 'Id', 'ID_'];
        idColumnName = posiblesNombresId.find(name => columnas.includes(name)) || 
                       columnas.find(col => col.toLowerCase() === 'id') || null;
        
        if (!idColumnName) {
          // Si no encontramos ID, mostrar las columnas disponibles
          console.warn('⚠️ No se encontró columna ID. Columnas disponibles:', columnas);
          alert(`No se encontró columna ID en la tabla. Columnas disponibles: ${columnas.slice(0, 10).join(', ')}${columnas.length > 10 ? '...' : ''}`);
          return;
        }
        
        console.log(`✅ Columna ID encontrada: "${idColumnName}"`);
      } else {
        // Si no hay datos, intentar con nombres comunes
        idColumnName = 'id';
        console.log('⚠️ Tabla vacía, usando nombre de columna por defecto: "id"');
      }
      
      // Ahora buscar el proceso por ID
      console.log('🔎 Buscando proceso...', { tableName, idColumn: idColumnName, procesoId });
      const { data: procesosCliente, error: queryError } = await supabase
        .from(tableName)
        .select('*')
        .eq(idColumnName, procesoId);
      
      if (queryError) {
        console.error('❌ Error en la consulta:', queryError);
        alert(`Error al buscar el proceso: ${queryError.message || 'Error desconocido'}`);
        return;
      }

      if (!procesosCliente || procesosCliente.length === 0) {
        console.warn(`⚠️ No se encontró un proceso con ID ${procesoId}`);
        alert(`No se encontró un proceso con ID ${procesoId}. Verifica el ID e intenta nuevamente.`);
        return;
      }

      const procesoEncontrado = procesosCliente[0];
      console.log(`✅ Proceso encontrado con ID ${procesoId}:`, procesoEncontrado);
      console.log('📊 Datos del proceso:', {
        id: procesoEncontrado[idColumnName!],
        columnas: Object.keys(procesoEncontrado),
        totalColumnas: Object.keys(procesoEncontrado).length
      });

      // Identificar el nombre de la columna de cédula/NIT
      const columnas = Object.keys(procesoEncontrado);
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

      if (!cedulaColumnName) {
        console.warn('⚠️ No se encontró columna de cédula/NIT. Columnas disponibles:', columnas);
        alert(`No se encontró columna de cédula/NIT. Columnas disponibles: ${columnas.slice(0, 10).join(', ')}${columnas.length > 10 ? '...' : ''}`);
        return;
      }

      // Obtener la cédula del proceso encontrado
      const cedula = procesoEncontrado[cedulaColumnName];
      
      if (!cedula) {
        console.warn('⚠️ El proceso no tiene cédula asignada');
        alert('El proceso encontrado no tiene cédula asignada. No se pueden buscar más procesos.');
        return;
      }

      console.log(`🔍 Cédula encontrada: "${cedula}" en columna "${cedulaColumnName}"`);
      console.log('🔎 Buscando todos los procesos con la misma cédula...');

      // Normalizar la cédula para búsqueda (eliminar puntos, guiones, espacios)
      const normalizarCedula = (ced: string): string => {
        return String(ced)
          .trim()
          .replace(/\./g, '')
          .replace(/-/g, '')
          .replace(/\s+/g, '');
      };

      const cedulaNormalizada = normalizarCedula(cedula);

      // Buscar todos los procesos con la misma cédula
      const { data: todosLosProcesos, error: errorCedula } = await supabase
        .from(tableName)
        .select('*');

      if (errorCedula) {
        console.error('❌ Error al obtener todos los procesos:', errorCedula);
        alert(`Error al buscar procesos por cédula: ${errorCedula.message || 'Error desconocido'}`);
        return;
      }

      // Filtrar procesos que coincidan con la cédula (normalizada)
      const procesosConMismaCedula = (todosLosProcesos || []).filter((proc: any) => {
        const cedulaProc = proc[cedulaColumnName];
        if (!cedulaProc) return false;
        const cedulaProcNormalizada = normalizarCedula(cedulaProc);
        return cedulaProcNormalizada === cedulaNormalizada;
      });

      console.log(`✅ Procesos encontrados con la misma cédula: ${procesosConMismaCedula.length}`);
      console.log('📋 IDs de procesos encontrados:', procesosConMismaCedula.map((p: any) => p[idColumnName!]));

      if (procesosConMismaCedula.length === 0) {
        alert('No se encontraron otros procesos con la misma cédula.');
        return;
      }

      navigate('/portal/proceso', {
        state: { 
          clienteId: procesoId,
          cedula: cedula,
          procesos: procesosConMismaCedula
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-8">
            <img 
              src="/prosejurix-rounded.png" 
              alt="Prosejurix Logo" 
              className="h-20 mx-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Portal del Cliente</h2>
          <p className="text-slate-600">Accede para consultar el estado de tus procesos legales</p>
        </div>

        <ClientLoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default ClienteLogin;


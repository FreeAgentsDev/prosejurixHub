import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import ClientLoginForm from '../../components/cliente/ClientLoginForm';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../../components/common/NotificationProvider';

const ClienteLogin = () => {
  const navigate = useNavigate();
  const { notify } = useNotifications();

  const handleLogin = async (clienteIdInput: string) => {
    try {
      // Validar que supabase esté inicializado
      if (!supabase) {
        console.error('❌ Supabase no está inicializado');
        notify({
          type: 'error',
          title: 'Error de conexión',
          message: 'No pudimos conectar con la base de datos. Verifica la configuración e inténtalo más tarde.'
        });
        return;
      }
      // Validar y normalizar ID del cliente (cliente_id en la tabla CTRANTECEDENTES)
      const clienteId = Number(String(clienteIdInput).trim());

      if (!clienteId || Number.isNaN(clienteId)) {
        notify({
          type: 'warning',
          title: 'ID inválido',
          message: 'Ingresa un número válido para continuar.'
        });
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
          notify({
            type: 'error',
            title: 'Tabla no encontrada',
            message: 'No encontramos la tabla CTRANTECEDENTES. Verifica el nombre en Supabase.'
          });
        } else if (sampleError.message?.includes('permission') || sampleError.code === 'PGRST301') {
          notify({
            type: 'error',
            title: 'Sin permisos',
            message: 'No tienes permisos para consultar la tabla. Contacta al administrador.'
          });
        } else {
          notify({
            type: 'error',
            title: 'Error de Supabase',
            message: `No se pudo consultar la tabla: ${sampleError.message || 'Error desconocido'}.`
          });
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
            notify({
              type: 'error',
              title: 'Columna cliente_id no encontrada',
              message: `No pudimos localizar la columna cliente_id. Columnas detectadas: ${columnas
                .slice(0, 10)
                .join(', ')}${columnas.length > 10 ? '...' : ''}`
            });
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
        notify({
          type: 'error',
          title: 'Consulta fallida',
          message: `No pudimos obtener los procesos: ${queryError.message || 'Error desconocido'}.`
        });
        return;
      }

      if (!procesosCliente || procesosCliente.length === 0) {
        console.warn(`⚠️ No se encontraron procesos para el cliente con ID ${clienteId}`);
        notify({
          type: 'warning',
          title: 'Sin resultados',
          message: `No encontramos procesos para el cliente con ID ${clienteId}. Verifica el número e inténtalo de nuevo.`
        });
        return;
      }

      console.log(`✅ Procesos encontrados para el cliente ${clienteId}: ${procesosCliente.length}`);
      console.log('📊 Procesos encontrados (por cliente_id/ID):', procesosCliente);

      // Obtener información del cliente del primer proceso
      const primerProceso = procesosCliente[0];
      const columnas = Object.keys(primerProceso);
      
      // Identificar el nombre de la columna de cédula/NIT
      const posiblesNombresCedula = [
        'CEDULA',
        'cedula',
        'Cedula',
        'CÉDULA',
        'nit',
        'NIT'
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
              return n.includes('cedula') || n.includes('nit');
            }),
            'CEDULA', 'cedula', 'Cedula', 'CÉDULA', 'nit', 'NIT'
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
            const rawId = row.ID ?? row.id ?? row.Id ?? row.procesoId;
            if (rawId !== undefined && rawId !== null) {
              return String(rawId);
            }
            return `${row[colCedula] ?? ''}-${row.RADICADO ?? row.radicado ?? row.radicado_numero ?? 'N/A'}`;
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
      console.log('📋 IDs de procesos:', procesosPorCedula.map((p: any) => p.ID || p.id || p.Id || p.procesoId));

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
      notify({
        type: 'error',
        title: 'Error inesperado',
        message: `Ocurrió un problema al iniciar sesión: ${errorMessage}.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(79,70,229,0.25),_transparent_45%)]" />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 text-white">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg shadow-slate-900/40 backdrop-blur transition hover:bg-white/20"
                aria-label="Volver a inicio"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-blue-200/70">Portal Digital</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Acceso al Portal del Cliente</h1>
                <p className="mt-3 text-sm text-blue-100/80 max-w-xl">
                  Consulta el estado de tus procesos legales, revisa tus documentos y mantente al tanto de cada novedad desde un espacio seguro diseñado para ti.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100/80 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium">
                <ShieldCheck className="h-4 w-4" /> Acceso seguro y confidencial
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium">
                <Sparkles className="h-4 w-4" /> Panel adaptado a tu caso
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative pb-20">
        <div className="mt-12 sm:mt-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex-1">
              <ClientLoginForm onLogin={handleLogin} />
            </div>

            <aside className="flex w-full max-w-sm flex-col gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
                <h3 className="text-lg font-semibold text-slate-900">¿Qué necesitas?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Introduce el ID de cliente que recibiste de nuestro equipo. Si no lo tienes a mano, contáctanos y te ayudaremos enseguida.
                </p>
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <p className="text-sm font-semibold text-blue-900">Horarios de atención</p>
                  <p className="mt-1 text-xs text-blue-700">Lunes a viernes 8:00 a.m. - 6:00 p.m.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
                <h3 className="text-lg font-semibold text-slate-900">¿Necesitas ayuda?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Nuestro equipo está disponible para resolver cualquier duda sobre tu acceso o tus procesos.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="https://wa.me/573001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600"
                  >
                    Escribir por WhatsApp
                  </a>
                  <a
                    href="tel:+573001234567"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                  >
                    Llamar al despacho
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClienteLogin;


import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClientProcessView from '../../components/cliente/ClientProcessView';

const ClienteProceso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener datos del estado de navegación
  const { clienteId, procesos } = location.state || {};
  
  // Si no hay datos, redirigir al login
  React.useEffect(() => {
    if (!clienteId || !procesos || procesos.length === 0) {
      navigate('/portal');
    }
  }, [clienteId, procesos, navigate]);
  
  if (!clienteId || !procesos || procesos.length === 0) {
    return null;
  }

  // Obtener información del cliente del primer proceso (según estructura del CSV)
  const primerProceso = procesos[0];
  
  // Buscar nombre del cliente con diferentes posibles nombres de columna
  const clienteNombre = primerProceso.NOMBRE || primerProceso.nombre || primerProceso.Nombre || primerProceso.cliente_nombre || 'Cliente';
  
  // Buscar cédula con diferentes posibles nombres de columna
  const clienteCedula = primerProceso['CÉDULA / NIT'] || primerProceso['CÉDULA_NIT'] || primerProceso.cedula || primerProceso.CEDULA || primerProceso.nit || '';

  // Transformar procesos de Supabase para el componente (mapeando campos del CSV)
  const procesosFormateados = procesos.map((proc: any) => {
    // Priorizar proceso_id (ID del proceso) sobre otros campos
    const procId = proc.proceso_id || proc.procesoId || proc['PROCESO_ID'] || 
                   proc.ID || proc.id || proc.Id || 
                   `PROC-${proc.ID || proc.id || 'N/A'}`;
    
    // Buscar estado con diferentes posibles nombres
    const estado = proc.Estado || proc.estado || proc.ESTADO || proc.estado_publico || 'Sin estado';
    
    // Buscar tipo/clase de proceso
    const tipo = proc['CLASE DE PROCESO'] || proc['CLASE_DE_PROCESO'] || proc.clase_proceso || proc.tipo || 'Sin tipo';
    const tipoFormateado = tipo ? String(tipo).charAt(0).toUpperCase() + String(tipo).slice(1).toLowerCase() : 'Sin tipo';
    
    // Buscar fecha (puede ser fecha de accidente o fecha de ingreso)
    const fecha = proc['FECHA DE ACCIDENTE'] || proc['FECHA_DE_ACCIDENTE'] || proc.fecha_accidente || 
                  proc['FECHA DE INGRESO'] || proc.fecha_ingreso || proc.fecha || 
                  new Date().toISOString().split('T')[0];
    
    // Buscar observaciones o información adicional
    const observaciones = proc.observaciones || proc.OBSERVACIONES || 
                         proc.observaciones_cliente || proc.OBSERVACIONES_CLIENTE ||
                         `Proceso radicado: ${proc.RADICADO || proc.radicado || 'N/A'}` ||
                         'Sin observaciones disponibles.';

    return {
      id: String(procId), // ID del proceso (proceso_id)
      procesoId: String(procId), // Guardar también como procesoId para búsquedas
      estado: String(estado),
      observaciones: String(observaciones),
      fechaIngreso: String(fecha),
      tipo: tipoFormateado,
      // Pasar todos los datos originales para el modal de detalles
      datosCompletos: proc
    };
  });

  const handleLogout = () => {
    navigate('/portal');
  };

  return (
    <ClientProcessView
      processes={procesosFormateados}
      clientName={clienteNombre}
      clientCedula={clienteCedula}
      onLogout={handleLogout}
      procesosRaw={procesos}
    />
  );
};

export default ClienteProceso;


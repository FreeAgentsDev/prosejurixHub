// Tipos para la tabla CTRANTECEDENTES de Supabase
export interface ControlProcesoAntecedente {
  id?: number;
  ID?: number | string;
  cliente_id?: number;
  cliente_nombre?: string;
  cedula?: string;
  estado?: string;
  estado_publico?: string;
  tipo?: string;
  fecha?: string;
  fecha_ingreso?: string;
  demandado?: string;
  observaciones?: string;
  observaciones_internas?: string;
  observaciones_cliente?: string;
  juzgado?: string;
  placa_vehiculo?: string;
  celular?: string;
  telefono?: string;
  valor_honorarios?: number;
  valor_peritaje?: number;
  valor_prestamos?: number;
  gastos_adicionales?: number;
  fecha_radicacion?: string;
  created_at?: string;
  updated_at?: string;
}


// Mock data para procesos, clientes y administradores

export interface MockProceso {
  id: string;
  cedula: string;
  estado: 'activo' | 'finalizado' | 'en_espera';
  estadoPublico: string;
  tipo: 'civil' | 'penal' | 'laboral' | 'comercial';
  fecha: string;
  fechaIngreso: string;
  clienteNombre: string;
  clienteId: number;
  demandado: string;
  observaciones?: string;
  observacionesInternas?: string;
  observacionesCliente?: string;
  juzgado?: string;
  placaVehiculo?: string;
  valorHonorarios?: number;
  valorPeritaje?: number;
  valorPrestamos?: number;
  gastosAdicionales?: number;
  fechaRadicacion?: string;
  celular?: string;
  celularSecundario?: string;
  telefono?: string;
  correoElectronico?: string;
  direccion?: string;
  ciudad?: string;
  radicado?: string;
  claseProceso?: string;
  responsabilidad?: string;
  fechaAccidente?: string;
  caducidad?: string;
  lugarAccidente?: string;
  ciudad1?: string;
  fechaQuerella?: string;
  fiscalia?: string;
  ciudad2?: string;
  aseguradora?: string;
  actuacion?: string;
  fechaReclamacion?: string;
  conciliacion?: string;
  fechaPresentacionDemanda?: string;
  rama?: string;
  radicado1?: string;
  ciudad3?: string;
  estadoProceso?: string;
  prestamos?: string;
  fechaRenuncia?: string;
}

export interface MockCliente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaRegistro: string;
}

export const mockClientes: MockCliente[] = [
  {
    id: 1,
    nombre: 'María González Pérez',
    cedula: '12345678',
    telefono: '300 123 4567',
    email: 'maria.gonzalez@email.com',
    direccion: 'Calle 50 #25-30, Manizales',
    fechaRegistro: '2024-01-15'
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez López',
    cedula: '87654321',
    telefono: '301 987 6543',
    email: 'carlos.rodriguez@email.com',
    direccion: 'Carrera 15 #40-20, Manizales',
    fechaRegistro: '2024-01-10'
  },
  {
    id: 3,
    nombre: 'Ana Martínez Silva',
    cedula: '11223344',
    telefono: '302 555 1234',
    email: 'ana.martinez@email.com',
    direccion: 'Avenida 12 #45-67, Manizales',
    fechaRegistro: '2024-01-20'
  }
];

export const mockProcesos: MockProceso[] = [
  {
    id: '1',
    cedula: '12345678',
    estado: 'activo',
    estadoPublico: 'En investigación',
    tipo: 'civil',
    fecha: '2025-01-01',
    fechaIngreso: '2024-01-15',
    clienteNombre: 'María González Pérez',
    clienteId: 1,
    demandado: 'Seguros Bolívar S.A.',
    observaciones: 'Estamos recopilando las pruebas necesarias para su caso. El peritaje del vehículo está programado para la próxima semana.',
    observacionesInternas: 'Pendiente peritaje del vehículo. Contactar perito la próxima semana.',
    observacionesCliente: 'Estamos recopilando las pruebas necesarias para su caso. El peritaje del vehículo está programado para la próxima semana.',
    juzgado: 'Juzgado Civil del Circuito de Manizales',
    placaVehiculo: 'ABC123',
    valorHonorarios: 5000000,
    valorPeritaje: 800000,
    valorPrestamos: 0,
    gastosAdicionales: 200000,
    fechaRadicacion: ''
  },
  {
    id: '2',
    cedula: '12345678',
    estado: 'activo',
    estadoPublico: 'En negociación',
    tipo: 'civil',
    fecha: '2025-01-05',
    fechaIngreso: '2023-11-20',
    clienteNombre: 'María González Pérez',
    clienteId: 1,
    demandado: 'SURA S.A.',
    observaciones: 'Hemos presentado la reclamación a la aseguradora. Esperamos respuesta en los próximos 15 días hábiles.',
    observacionesInternas: 'Aseguradora ofreció $15M. Cliente quiere $20M. Programar reunión.',
    observacionesCliente: 'Hemos presentado la reclamación a la aseguradora. Esperamos respuesta en los próximos 15 días hábiles.',
    juzgado: '',
    placaVehiculo: 'XYZ789',
    valorHonorarios: 8000000,
    valorPeritaje: 1200000,
    valorPrestamos: 2000000,
    gastosAdicionales: 500000,
    fechaRadicacion: ''
  },
  {
    id: '3',
    cedula: '87654321',
    estado: 'finalizado',
    estadoPublico: 'Caso Cerrado',
    tipo: 'penal',
    fecha: '2024-12-20',
    fechaIngreso: '2023-08-10',
    clienteNombre: 'Carlos Rodríguez López',
    clienteId: 2,
    demandado: 'Allianz Seguros',
    observaciones: 'Caso resuelto exitosamente. Indemnización otorgada.',
    observacionesInternas: 'Caso cerrado. Pagos completados.',
    observacionesCliente: 'Caso resuelto exitosamente. Indemnización otorgada.',
    juzgado: 'Juzgado Civil del Circuito de Manizales',
    placaVehiculo: 'DEF456',
    valorHonorarios: 6000000,
    valorPeritaje: 1000000,
    valorPrestamos: 0,
    gastosAdicionales: 300000,
    fechaRadicacion: '2024-12-15'
  },
  {
    id: '4',
    cedula: '11223344',
    estado: 'activo',
    estadoPublico: 'En Audiencia',
    tipo: 'laboral',
    fecha: '2025-01-10',
    fechaIngreso: '2024-02-01',
    clienteNombre: 'Ana Martínez Silva',
    clienteId: 3,
    demandado: 'Empresa XYZ S.A.',
    observaciones: 'Proceso en etapa de audiencias. Próxima audiencia programada para la próxima semana.',
    observacionesInternas: 'Audiencia programada. Preparar documentación adicional.',
    observacionesCliente: 'Proceso en etapa de audiencias. Próxima audiencia programada para la próxima semana.',
    juzgado: 'Juzgado Laboral de Manizales',
    placaVehiculo: '',
    valorHonorarios: 4500000,
    valorPeritaje: 500000,
    valorPrestamos: 1000000,
    gastosAdicionales: 250000,
    fechaRadicacion: '2024-03-15'
  },
  {
    id: '5',
    cedula: '87654321',
    estado: 'en_espera',
    estadoPublico: 'Evaluación Inicial',
    tipo: 'comercial',
    fecha: '2025-01-15',
    fechaIngreso: '2025-01-15',
    clienteNombre: 'Carlos Rodríguez López',
    clienteId: 2,
    demandado: 'Empresa ABC Ltda.',
    observaciones: 'Caso en evaluación inicial. Próximos pasos a definir.',
    observacionesInternas: 'Revisar documentación. Esperar respuesta del cliente.',
    observacionesCliente: 'Caso en evaluación inicial. Próximos pasos a definir.',
    juzgado: '',
    placaVehiculo: '',
    valorHonorarios: 0,
    valorPeritaje: 0,
    valorPrestamos: 0,
    gastosAdicionales: 0,
    fechaRadicacion: ''
  }
];

export const estadosInternos = [
  { value: 'inicial', label: 'Evaluación Inicial' },
  { value: 'investigacion', label: 'En Investigación' },
  { value: 'negociacion', label: 'En Negociación' },
  { value: 'demanda', label: 'Demanda Presentada' },
  { value: 'audiencia', label: 'En Audiencia' },
  { value: 'sentencia', label: 'Sentencia' },
  { value: 'ejecucion', label: 'En Ejecución' },
  { value: 'cerrado', label: 'Caso Cerrado' }
];


import React from 'react';
import ClientProcessView from '../cliente/ClientProcessView';

interface ClientPortalPreviewProps {
  clientName: string;
  clientCedula?: string | null;
  clientId?: string | number | null;
  rawProcesos?: any[];
  procesosNormalizados?: any[];
  onClose?: () => void;
}

const getValue = (obj: any, ...keys: string[]): any => {
  if (!obj) return null;
  for (const key of keys) {
    if (key && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return null;
};

const mapRecordToProcess = (record: any, index: number): any => {
  const id =
    getValue(
      record,
      'ID',
      'id',
      'Id',
      'id_proceso',
      'ID_PROCESO',
      'procesoId',
      'Proceso ID',
      'ID Proceso',
      'proceso_id'
    ) ?? record?.id ?? index;

  return {
    id,
    estado:
      getValue(record, 'estado', 'Estado', 'ESTADO', 'estado_publico', 'estadoPublico') ??
      record?.estado ??
      '—',
    observaciones:
      getValue(record, 'observaciones', 'OBSERVACIONES', 'observacion', 'OBSERVACION') ??
      record?.observaciones ??
      '',
    fechaIngreso:
      getValue(
        record,
        'fecha_ingreso',
        'fechaIngreso',
        'Fecha Ingreso',
        'Fecha de Ingreso',
        'created_at',
        'FECHA DE INGRESO',
        'fecha'
      ) ?? record?.fechaIngreso ?? '',
    tipo: getValue(record, 'tipo', 'Tipo', 'TIPO', 'clase_proceso') ?? record?.tipo ?? '',
    datosCompletos: record
  };
};

const ClientPortalPreview: React.FC<ClientPortalPreviewProps> = ({
  clientName,
  clientCedula,
  clientId,
  rawProcesos,
  procesosNormalizados,
  onClose
}) => {
  const procesosFallback = React.useMemo(() => {
    if (procesosNormalizados && procesosNormalizados.length > 0) {
      return procesosNormalizados.map((item, index) => mapRecordToProcess(item, index));
    }

    if (rawProcesos && rawProcesos.length > 0) {
      return rawProcesos.map((item, index) => mapRecordToProcess(item, index));
    }

    return [];
  }, [procesosNormalizados, rawProcesos]);

  return (
    <div className="h-[80vh] max-h-[80vh] overflow-hidden rounded-[28px]">
      <ClientProcessView
        processes={procesosFallback}
        clientName={clientName}
        clientCedula={clientCedula ?? ''}
        onLogout={onClose ?? (() => {})}
        procesosRaw={rawProcesos}
        hideHeaderActions
        hideHeader
        compactLayout
      />
    </div>
  );
};

export default ClientPortalPreview;



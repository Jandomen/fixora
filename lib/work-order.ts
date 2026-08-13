export const WORK_ORDER_STATUSES = [
  "recibida",
  "en_diagnostico",
  "en_reparacion",
  "pendiente_pago",
  "entregada",
] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  recibida: "Recibida",
  en_diagnostico: "En diagnóstico",
  en_reparacion: "En reparación",
  pendiente_pago: "Pendiente de pago",
  entregada: "Entregada",
};

export const STATUS_VARIANTS: Record<
  WorkOrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  recibida: "secondary",
  en_diagnostico: "outline",
  en_reparacion: "secondary",
  pendiente_pago: "destructive",
  entregada: "default",
};

export function isWorkOrderStatus(value: string): value is WorkOrderStatus {
  return (WORK_ORDER_STATUSES as readonly string[]).includes(value);
}

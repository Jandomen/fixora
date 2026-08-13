export const DEVICE_TYPES = [
  "celular",
  "laptop",
  "desktop",
  "tablet",
  "impresora",
  "otro",
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  celular: "Celular",
  laptop: "Laptop",
  desktop: "Escritorio",
  tablet: "Tablet",
  impresora: "Impresora",
  otro: "Otro",
};

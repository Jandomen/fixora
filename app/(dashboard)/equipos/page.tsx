import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeviceFilters } from "@/components/devices/device-filters";
import { DEVICE_TYPE_LABELS } from "@/lib/device";
import { connectDB } from "@/lib/mongodb";
import { Device } from "@/models/Device";
import type { DeviceType } from "@/lib/device";

import "@/models/Customer";

export const dynamic = "force-dynamic";

export const metadata = { title: "Equipos" };

type PopulatedDevice = {
  _id: string;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  customer: { _id: string; name: string; phone: string } | null;
};

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  await connectDB();

  const { q, type } = await searchParams;
  const query = q?.trim();

  const filter: Record<string, unknown> = {};
  if (query) {
    filter.$or = [
      { brand: { $regex: query, $options: "i" } },
      { model: { $regex: query, $options: "i" } },
      { serialNumber: { $regex: query, $options: "i" } },
    ];
  }
  if (type) {
    filter.type = type;
  }

  const devices = await Device.find(filter)
    .sort({ brand: 1, model: 1 })
    .populate("customer", "name phone")
    .lean<PopulatedDevice[]>();

  const rows = devices.map((device) => ({
    _id: String(device._id),
    type: device.type,
    brand: device.brand,
    model: device.model,
    serialNumber: device.serialNumber ?? null,
    customerName: device.customer?.name ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Equipos</h1>
          <p className="text-sm text-muted-foreground">
            Celulares y computadoras registrados por cliente.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/equipos/nuevo" />}>
          <Plus />
          Nuevo equipo
        </Button>
      </div>

      <DeviceFilters q={query ?? ""} type={type ?? ""} />

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">No se encontraron equipos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query || type
                ? "Prueba con otros filtros."
                : "Registra el primero desde Nuevo equipo."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {rows.map((device) => (
              <Card key={device._id}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span>
                      {device.brand} {device.model}
                    </span>
                    <Badge variant="secondary">
                      {DEVICE_TYPE_LABELS[device.type]}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {device.customerName ?? "Sin cliente"}
                  </CardDescription>
                </CardHeader>
                {device.serialNumber && (
                  <CardContent className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">S/N:</span>{" "}
                    {device.serialNumber}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Listado</CardTitle>
              <CardDescription>{rows.length} equipos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>S/N</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((device) => (
                    <TableRow key={device._id}>
                      <TableCell className="font-medium">
                        {device.brand} {device.model}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {DEVICE_TYPE_LABELS[device.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>{device.customerName ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {device.serialNumber ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

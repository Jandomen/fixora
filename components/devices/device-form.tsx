"use client";

import { useActionState } from "react";
import {
  createDevice,
  type CreateDeviceState,
} from "@/actions/device.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEVICE_TYPE_LABELS, DEVICE_TYPES } from "@/lib/device";
import type { SerializedCustomer } from "@/lib/serializers";

export function DeviceForm({
  customers,
}: {
  customers: SerializedCustomer[];
}) {
  const [state, formAction, isPending] = useActionState<
    CreateDeviceState,
    FormData
  >(createDevice, {});

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium">Aún no hay clientes registrados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra primero un cliente para poder asignarle equipos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del equipo</CardTitle>
          <CardDescription>
            Registra un celular o computadora que pertenece a un cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Cliente *</Label>
            <Select name="customer">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name} — {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Tipo de equipo *</Label>
            <Select name="type" defaultValue="celular">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {DEVICE_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand">Marca *</Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Ej. Samsung"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              name="model"
              placeholder="Ej. Galaxy A54"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="serialNumber">Número de serie (IMEI/S/N)</Label>
            <Input
              id="serialNumber"
              name="serialNumber"
              placeholder="Ej. 35 8290 6123 4567 8"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Condición física, accesorios recibidos, contraseña, etc."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Crear equipo"}
        </Button>
      </div>
    </form>
  );
}

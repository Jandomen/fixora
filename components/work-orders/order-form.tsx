"use client";

import { useActionState, useState } from "react";
import {
  createWorkOrder,
  type CreateWorkOrderState,
} from "@/actions/work-order.actions";
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
import { DEVICE_TYPE_LABELS } from "@/lib/device";
import type { SerializedCustomer, SerializedDevice } from "@/lib/serializers";

type OrderFormProps = {
  customers: SerializedCustomer[];
  devices: SerializedDevice[];
};

export function OrderForm({ customers, devices }: OrderFormProps) {
  const [state, formAction, isPending] = useActionState<
    CreateWorkOrderState,
    FormData
  >(createWorkOrder, {});

  const [customerId, setCustomerId] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const availableDevices = customerId
    ? devices.filter((device) => device.customerId === customerId)
    : [];

  if (customers.length === 0 || devices.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium">Aún no hay datos para crear una orden</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Primero registra al menos un cliente y un equipo en la base de datos
            (puedes usar el script <code>npm run seed</code>).
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
          <CardTitle>Información de la orden</CardTitle>
          <CardDescription>
            Selecciona el cliente, su equipo y describe el problema reportado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Cliente *</Label>
            <Select
              name="customer"
              value={customerId}
              onValueChange={(value) => {
                setCustomerId(value ?? "");
                setDeviceId("");
              }}
            >
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
            <Label>Equipo *</Label>
            <Select
              name="device"
              value={deviceId}
              onValueChange={(value) => setDeviceId(value ?? "")}
              disabled={!customerId}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    customerId
                      ? "Selecciona un equipo"
                      : "Selecciona primero un cliente"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.map((device) => (
                  <SelectItem key={device._id} value={device._id}>
                    {device.brand} {device.model} (
                    {DEVICE_TYPE_LABELS[device.type]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="reportedIssue">Problema reportado *</Label>
            <Textarea
              id="reportedIssue"
              name="reportedIssue"
              rows={4}
              placeholder="Describe el problema que presenta el equipo"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="estimatedCost">Costo estimado (opcional)</Label>
            <Input
              id="estimatedCost"
              name="estimatedCost"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ej. 1500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Crear orden"}
        </Button>
      </div>
    </form>
  );
}

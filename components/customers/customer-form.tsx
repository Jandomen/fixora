"use client";

import { useActionState } from "react";
import {
  createCustomer,
  type CreateCustomerState,
} from "@/actions/customer.actions";
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
import { Textarea } from "@/components/ui/textarea";

export function CustomerForm() {
  const [state, formAction, isPending] = useActionState<
    CreateCustomerState,
    FormData
  >(createCustomer, {});

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
          <CardTitle>Información del cliente</CardTitle>
          <CardDescription>
            Datos de contacto de la persona que lleva el equipo al taller.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej. Ana Torres"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Ej. 555-1234"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Ej. ana@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" placeholder="Calle, colonia, ciudad" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Referencias, forma de contacto preferida, etc."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
}

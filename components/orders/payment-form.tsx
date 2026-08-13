"use client";

import { useActionState } from "react";
import {
  createPayment,
  type CreatePaymentState,
} from "@/actions/payment.actions";
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
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/lib/payment";

export function PaymentForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState<
    CreatePaymentState,
    FormData
  >(createPayment, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
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
          <CardTitle>Registrar pago</CardTitle>
          <CardDescription>
            Anota un pago o abono para esta orden.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Monto *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={0.01}
              step="0.01"
              placeholder="Ej. 600"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Método</Label>
            <Select name="method" defaultValue="efectivo">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Nota</Label>
            <Input
              id="note"
              name="note"
              placeholder="Ej. Abono inicial"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Registrar pago"}
        </Button>
      </div>
    </form>
  );
}

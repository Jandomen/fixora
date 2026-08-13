"use client";

import { useActionState } from "react";
import {
  updateWorkOrder,
  type UpdateWorkOrderState,
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
import { STATUS_LABELS, WORK_ORDER_STATUSES } from "@/lib/work-order";
import type { WorkOrderStatus } from "@/lib/work-order";

export function OrderStatusForm({
  orderId,
  status,
  diagnosis,
  estimatedCost,
}: {
  orderId: string;
  status: WorkOrderStatus;
  diagnosis: string | null;
  estimatedCost: number | null;
}) {
  const [state, formAction, isPending] = useActionState<
    UpdateWorkOrderState,
    FormData
  >(updateWorkOrder, {});

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
          <CardTitle>Estado y diagnóstico</CardTitle>
          <CardDescription>
            Actualiza la etapa de la reparación y agrega notas técnicas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Estado *</Label>
            <Select name="status" defaultValue={status}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORK_ORDER_STATUSES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {STATUS_LABELS[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="estimatedCost">Costo de la reparación</Label>
            <Input
              id="estimatedCost"
              name="estimatedCost"
              type="number"
              min={0}
              step="0.01"
              defaultValue={estimatedCost ?? ""}
              placeholder="Ej. 1200"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              rows={4}
              defaultValue={diagnosis ?? ""}
              placeholder="Describe lo que encontraste al revisar el equipo"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

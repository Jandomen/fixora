import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Trash2 } from "lucide-react";
import { deletePayment } from "@/actions/payment.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatusForm } from "@/components/orders/order-status-form";
import { PaymentForm } from "@/components/orders/payment-form";
import { DEVICE_TYPE_LABELS } from "@/lib/device";
import { connectDB } from "@/lib/mongodb";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment";
import {
  serializePayment,
  serializeWorkOrder,
  type PopulatedWorkOrder,
} from "@/lib/serializers";
import { STATUS_LABELS, STATUS_VARIANTS } from "@/lib/work-order";
import { Payment } from "@/models/Payment";
import { WorkOrder } from "@/models/WorkOrder";

import "@/models/Customer";
import "@/models/Device";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detalle de orden" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(value: number | null) {
  return value !== null ? `$${value.toLocaleString("es-MX")}` : "—";
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();

  const { id } = await params;

  const order = await WorkOrder.findById(id)
    .populate("customer", "name phone email")
    .populate("device", "brand model serialNumber type")
    .lean<PopulatedWorkOrder>();

  if (!order) notFound();

  const item = serializeWorkOrder(order);

  const payments = (
    await Payment.find({ order: id }).sort({ createdAt: -1 }).lean()
  ).map(serializePayment);

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance =
    item.estimatedCost !== null ? item.estimatedCost - totalPaid : null;

  const device = order.device as unknown as
    | { _id: string; brand: string; model: string; serialNumber?: string; type?: string }
    | null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/ordenes"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a órdenes
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-semibold">
              {item.number}
            </h1>
            <Badge variant={STATUS_VARIANTS[item.status]}>
              {STATUS_LABELS[item.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Creada el {formatDate(item.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cliente y equipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">{item.customer?.name ?? "—"}</p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="size-3.5" />
                {item.customer?.phone ?? "—"}
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm font-medium">
                {device ? `${device.brand} ${device.model}` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {device?.type ? DEVICE_TYPE_LABELS[device.type as keyof typeof DEVICE_TYPE_LABELS] : ""}
                {device?.serialNumber ? ` · S/N ${device.serialNumber}` : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la reparación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Problema reportado</p>
              <p className="text-muted-foreground">{item.reportedIssue}</p>
            </div>
            <div className="border-t pt-3">
              <p className="font-medium">Diagnóstico</p>
              <p className="text-muted-foreground">
                {item.diagnosis ?? "Aún sin diagnóstico."}
              </p>
            </div>
            <div className="border-t pt-3">
              <p className="font-medium">Costo estimado</p>
              <p className="text-lg font-semibold tabular-nums">
                {formatPrice(item.estimatedCost)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <OrderStatusForm
        orderId={item._id}
        status={item.status}
        diagnosis={item.diagnosis}
        estimatedCost={item.estimatedCost}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pagos</CardTitle>
            <CardDescription>
              Historial de cobros de esta orden.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Total cobrado</p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatPrice(totalPaid)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">
                  {balance === null
                    ? "Saldo pendiente"
                    : balance > 0
                      ? "Saldo pendiente"
                      : "Pagado"}
                </p>
                <p
                  className={`text-lg font-semibold tabular-nums ${
                    balance !== null && balance > 0
                      ? "text-destructive"
                      : ""
                  }`}
                >
                  {balance === null
                    ? "—"
                    : balance > 0
                      ? formatPrice(balance)
                      : "✓"}
                </p>
              </div>
            </div>

            {payments.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">
                Aún no hay pagos registrados.
              </p>
            ) : (
              <ul className="space-y-2">
                {payments.map((payment) => (
                  <li
                    key={payment._id}
                    className="flex items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium tabular-nums">
                        ${payment.amount.toLocaleString("es-MX")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {PAYMENT_METHOD_LABELS[payment.method]}
                        {payment.note ? ` · ${payment.note}` : ""} ·{" "}
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <form action={deletePayment}>
                      <input type="hidden" name="paymentId" value={payment._id} />
                      <input type="hidden" name="orderId" value={item._id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar pago"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <PaymentForm orderId={item._id} />
      </div>
    </div>
  );
}

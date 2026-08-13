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
import { OrderFilters } from "@/components/orders/order-filters";
import { connectDB } from "@/lib/mongodb";
import { WorkOrder } from "@/models/WorkOrder";
import {
  isWorkOrderStatus,
  STATUS_LABELS,
  STATUS_VARIANTS,
} from "@/lib/work-order";
import {
  serializeWorkOrder,
  type PopulatedWorkOrder,
  type SerializedWorkOrder,
} from "@/lib/serializers";

import "@/models/Customer";
import "@/models/Device";

export const dynamic = "force-dynamic";

export const metadata = { title: "Órdenes" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(value: number | null) {
  return value !== null ? `$${value.toLocaleString("es-MX")}` : "—";
}

function matchesQuery(order: SerializedWorkOrder, query: string) {
  const haystack = [
    order.number,
    order.customer?.name,
    order.device?.brand,
    order.device?.model,
    order.reportedIssue,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function OrderCard({ order }: { order: SerializedWorkOrder }) {
  return (
    <Link href={`/ordenes/${order._id}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-2">
            <span>{order.number}</span>
            <Badge variant={STATUS_VARIANTS[order.status]}>
              {STATUS_LABELS[order.status]}
            </Badge>
          </CardTitle>
          <CardDescription>
            {order.customer?.name ?? "—"} ·{" "}
            {order.device ? `${order.device.brand} ${order.device.model}` : "—"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{order.reportedIssue}</p>
          <div className="flex items-center justify-between border-t pt-2 text-sm">
            <span className="text-muted-foreground">Costo estimado</span>
            <span className="font-medium">{formatPrice(order.estimatedCost)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await connectDB();

  const { q, status } = await searchParams;
  const query = q?.trim() ?? "";
  const rawStatus = status ?? "";
  const statusFilter = isWorkOrderStatus(rawStatus) ? rawStatus : "";

  const baseFilter = statusFilter ? { status: statusFilter } : {};

  const orders = await WorkOrder.find(baseFilter)
    .sort({ createdAt: -1 })
    .populate("customer", "name phone")
    .populate("device", "brand model")
    .lean<PopulatedWorkOrder[]>();

  const items = orders
    .map(serializeWorkOrder)
    .filter((order) => (query ? matchesQuery(order, query) : true));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Órdenes de reparación</h1>
          <p className="text-sm text-muted-foreground">
            Todas las órdenes registradas en el taller.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/ordenes/nueva" />}>
          <Plus />
          Nueva orden
        </Button>
      </div>

      <OrderFilters q={query} status={statusFilter} />

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">No se encontraron órdenes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query || statusFilter
                ? "Prueba con otros filtros."
                : "Crea la primera desde Nueva orden."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {items.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Listado</CardTitle>
              <CardDescription>{items.length} órdenes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Problema reportado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Costo est.</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/ordenes/${order._id}`}
                          className="hover:underline"
                        >
                          {order.number}
                        </Link>
                      </TableCell>
                      <TableCell>{order.customer?.name ?? "—"}</TableCell>
                      <TableCell>
                        {order.device
                          ? `${order.device.brand} ${order.device.model}`
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-64 truncate">
                        {order.reportedIssue}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[order.status]}>
                          {STATUS_LABELS[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(order.estimatedCost)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.createdAt)}
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

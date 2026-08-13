import Link from "next/link";
import { ClipboardList, CircleDollarSign, Package, Users, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { connectDB } from "@/lib/mongodb";
import { STATUS_LABELS, STATUS_VARIANTS } from "@/lib/work-order";
import { Customer } from "@/models/Customer";
import { Device } from "@/models/Device";
import { Payment } from "@/models/Payment";
import { Product } from "@/models/Product";
import { WorkOrder, WORK_ORDER_STATUSES } from "@/models/WorkOrder";
import {
  serializeProduct,
  serializeWorkOrder,
  type PopulatedWorkOrder,
} from "@/lib/serializers";

export const dynamic = "force-dynamic";

export const metadata = { title: "Inicio" };

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: typeof ClipboardList;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="truncate text-sm text-muted-foreground">
            {label}
            {hint ? ` · ${hint}` : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  await connectDB();

  const [
    totalOrders,
    activeOrders,
    totalCustomers,
    totalDevices,
    totalProducts,
    lowStockProducts,
    recentOrders,
    statusCounts,
    totalPaid,
  ] = await Promise.all([
    WorkOrder.countDocuments(),
    WorkOrder.countDocuments({ status: { $ne: "entregada" } }),
    Customer.countDocuments(),
    Device.countDocuments(),
    Product.countDocuments(),
    Product.find({ $expr: { $lte: ["$stock", "$minStock"] } })
      .sort({ stock: 1 })
      .limit(5)
      .lean(),
    WorkOrder.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name phone")
      .populate("device", "brand model")
      .lean<PopulatedWorkOrder[]>(),
    WorkOrder.aggregate<{ _id: (typeof WORK_ORDER_STATUSES)[number]; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Payment.aggregate<{ total: number }>([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const statusCountMap = new Map(
    statusCounts.map(({ _id, count }) => [_id, count])
  );

  const totalIncome = totalPaid[0]?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Inicio</h1>
        <p className="text-sm text-muted-foreground">
          Resumen del taller de un vistazo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          label="Órdenes"
          value={totalOrders}
          hint="totales"
          icon={ClipboardList}
        />
        <StatCard
          label="Activas"
          value={activeOrders}
          hint="en proceso"
          icon={Wrench}
        />
        <StatCard
          label="Clientes"
          value={totalCustomers}
          hint={`${totalDevices} equipos`}
          icon={Users}
        />
        <StatCard
          label="Productos"
          value={totalProducts}
          hint={`${lowStockProducts.length} con stock bajo`}
          icon={Package}
        />
        <StatCard
          label="Ingresos"
          value={`$${totalIncome.toLocaleString("es-MX")}`}
          hint="cobrado"
          icon={CircleDollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Órdenes por estado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {WORK_ORDER_STATUSES.map((status) => (
            <Badge
              key={status}
              variant={STATUS_VARIANTS[status]}
              className="gap-1.5 py-1 pr-2.5"
            >
              {STATUS_LABELS[status]}
              <span className="font-semibold tabular-nums">
                {statusCountMap.get(status) ?? 0}
              </span>
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas órdenes</CardTitle>
            <CardDescription>
              <Link href="/ordenes" className="text-foreground underline">
                Ver todas
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Aún no hay órdenes.
              </p>
            ) : (
              recentOrders.map(serializeWorkOrder).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {order.number} · {order.customer?.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.device
                        ? `${order.device.brand} ${order.device.model}`
                        : "—"}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANTS[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock bajo</CardTitle>
            <CardDescription>
              <Link href="/inventario" className="text-foreground underline">
                Ver inventario
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Todo el inventario está bien.
              </p>
            ) : (
              lowStockProducts.map(serializeProduct).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>
                  <Badge
                    variant={product.stock <= 0 ? "destructive" : "outline"}
                  >
                    {product.stock <= 0 ? "Agotado" : `${product.stock} uds`}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

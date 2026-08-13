import Link from "next/link";
import { Plus } from "lucide-react";
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
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Device } from "@/models/Device";
import { WorkOrder } from "@/models/WorkOrder";
import { serializeCustomer, type SerializedCustomer } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export const metadata = { title: "Clientes" };

type CustomerRow = SerializedCustomer & {
  devices: number;
  orders: number;
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connectDB();

  const { q } = await searchParams;
  const query = q?.trim();

  const filter = query
    ? {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  const customers = (await Customer.find(filter).sort({ name: 1 }).lean()).map(
    serializeCustomer
  );

  const [deviceCounts, orderCounts] = await Promise.all([
    Device.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$customer", count: { $sum: 1 } } },
    ]),
    WorkOrder.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$customer", count: { $sum: 1 } } },
    ]),
  ]);

  const deviceMap = new Map(deviceCounts.map((d) => [String(d._id), d.count]));
  const orderMap = new Map(orderCounts.map((o) => [String(o._id), o.count]));

  const rows: CustomerRow[] = customers.map((customer) => ({
    ...customer,
    devices: deviceMap.get(customer._id) ?? 0,
    orders: orderMap.get(customer._id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Personas que llevan sus equipos al taller.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/clientes/nuevo" />}>
          <Plus />
          Nuevo cliente
        </Button>
      </div>

      <form
        className="flex max-w-sm items-center gap-2"
        action="/clientes"
      >
        <input
          name="q"
          defaultValue={query ?? ""}
          placeholder="Buscar por nombre o teléfono..."
          className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit">Buscar</Button>
      </form>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">No se encontraron clientes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Prueba con otra búsqueda."
                : `Registra el primero desde ${" "}`}
              {!query && (
                <Link
                  href="/clientes/nuevo"
                  className="text-foreground underline"
                >
                  Nuevo cliente
                </Link>
              )}
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {rows.map((customer) => (
              <Card key={customer._id}>
                <CardHeader>
                  <CardTitle>{customer.name}</CardTitle>
                  <CardDescription>
                    {customer.phone}
                    {customer.email ? ` · ${customer.email}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {customer.devices}
                    </span>{" "}
                    equipos
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {customer.orders}
                    </span>{" "}
                    órdenes
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Listado</CardTitle>
              <CardDescription>{rows.length} clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Equipos</TableHead>
                    <TableHead>Órdenes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {customer.email ?? "—"}
                      </TableCell>
                      <TableCell>{customer.devices}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
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

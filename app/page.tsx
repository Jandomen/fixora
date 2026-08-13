import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  DollarSign,
  Package,
  Smartphone,
  Users,
  Wrench,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: ClipboardList,
    title: "Órdenes de reparación",
    description:
      "Registra cada trabajo, avanza su estado y guarda el diagnóstico de principio a fin.",
  },
  {
    icon: Smartphone,
    title: "Celulares y computadoras",
    description:
      "Lleva el control de equipos de todo tipo: marca, modelo y número de serie.",
  },
  {
    icon: Users,
    title: "Clientes",
    description:
      "Mantén el historial de tus clientes y los equipos que traen al taller.",
  },
  {
    icon: DollarSign,
    title: "Pagos y cobros",
    description:
      "Registra pagos y abonos, y consulta el saldo pendiente de cada orden.",
  },
  {
    icon: Package,
    title: "Inventario",
    description:
      "Controla stock de componentes y accesorios con alertas de stock bajo.",
  },
  {
    icon: Wrench,
    title: "Todo en un panel",
    description:
      "Resumen del taller con ingresos, órdenes por estado y más, de un vistazo.",
  },
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="size-4" />
          </div>
          <span className="font-heading text-lg font-semibold">Fixora</span>
        </div>
        {session ? (
          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
            size="sm"
          >
            Ir al panel
            <ArrowRight />
          </Button>
        ) : (
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            variant="outline"
            size="sm"
          >
            Iniciar sesión
          </Button>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4">
        <section className="flex flex-col items-center py-16 text-center sm:py-24">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Smartphone className="size-8" />
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Tu taller de reparación, organizado de una vez
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Fixora gestiona las reparaciones de <strong>celulares</strong> y{" "}
            <strong>computadoras</strong>: órdenes, clientes, equipos, pagos e
            inventario en un solo lugar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {session ? (
              <Button
                nativeButton={false}
                render={<Link href="/dashboard" />}
                size="lg"
              >
                Abrir el panel
                <ArrowRight />
              </Button>
            ) : (
              <>
                <Button
                  nativeButton={false}
                  render={<Link href="/login" />}
                  size="lg"
                >
                  Entrar al sistema
                  <ArrowRight />
                </Button>
                
              </>
            )}
          </div>
        </section>

        <section className="grid w-full gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-base">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <feature.icon className="size-4" />
                  </span>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Fixora · Gestión para taller de reparación de celulares y computadoras
      </footer>
    </div>
  );
}

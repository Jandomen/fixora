<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fixora — Contexto del proyecto

Sistema de gestión para taller de reparación de celulares y computadoras. App
web con Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui (estilo
`base-nova` sobre Base UI), Mongoose 9 + MongoDB Atlas, y auth con JWT (`jose`)
+ `bcryptjs`. Interfaz en español.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run start` — producción
- `npm run lint` — ESLint
- `npm run seed` — insertea datos de demo (usa `tsx --env-file=.env scripts/seed.ts`)

## Configuración

- Solo existe `.env` (no hay `.env.example`). Variables requeridas:
  `MONGODB_URI` (MongoDB Atlas, base `taller_pc`) y `AUTH_SECRET`.
- Usuario demo: `admin@fixora.mx` / `admin123`.

## Arquitectura y convenciones

- **DB en Server Components:** toda consulta pasa por `lib/mongodb.ts`
  (`connectDB` cacheado). Modelos en `models/` con `InferSchemaType`; cada
  modelo registra su esquema (p. ej. `models/WorkOrder.ts`).
- **No importar mongoose en clientes.** Las constantes, tipos y etiquetas de
  negocio viven en `lib/` (`lib/device.ts`, `lib/product.ts`,
  `lib/work-order.ts`, `lib/payment.ts`) y los modelos las re-exportan. Los
  componentes `"use client"` SIEMPRE importan desde `lib/`, nunca desde
  `models/`. Los estados de orden están en `lib/work-order.ts`.
- **Serialización:** antes de pasar documentos a la UI se usan los helpers de
  `lib/serializers.ts` (`serializeCustomer`, `serializeDevice`,
  `serializeProduct`, `serializeWorkOrder`, `serializePayment`). La ruta
  `app/(dashboard)/equipos/page.tsx` mapea a mano porque `populate().lean()`
  convierte `customer` en objeto.
- **Server Actions** en `actions/` con patrón `useActionState`: validar,
  `await connectDB()`, guardar, `revalidatePath` y `redirect` cuando aplica.
  Cada página de creación usa un form con su propio estado de error.
- **Base UI:** un `Button` con `render={<Link href="..." />}` requiere
  `nativeButton={false}`.
- **Registro de modelos para populate:** si una página hace
  `.populate("customer")` o `.populate("device")`, hay que registrar el modelo
  con un import lateral (`import "@/models/Customer"`) aunque no se use como
  valor.
- **Auth:** guard en `app/(dashboard)/layout.tsx` con `getSession()`; rutas sin
  sesión redirigen a `/login`. Cookies `fixora_session` (httpOnly).
- **Responsive:** listas en móvil como cards y en desktop como tablas
  (`space-y-3 md:hidden` / `hidden md:block`). Las páginas de listado usan
  `export const dynamic = "force-dynamic"`.
- **Filtros de listado:** componentes cliente (`components/orders/order-filters.tsx`,
  `components/inventory/inventory-filters.tsx`, `components/devices/device-filters.tsx`)
  que navegan con `router.push` usando query params leídos en el server page
  (`searchParams`).

## Módulos

- `/dashboard` — estadísticas, órdenes por estado, ingresos (suma de `Payment`), stock bajo.
- `/ordenes`, `/ordenes/nueva`, `/ordenes/[id]` — CRUD de órdenes, detalle con
  estados (recibida → en_diagnostico → en_reparacion → pendiente_pago →
  entregada), diagnóstico, costo y pagos.
- `/clientes`, `/clientes/nuevo` — clientes.
- `/equipos`, `/equipos/nuevo` — equipos por cliente.
- `/inventario`, `/inventario/nuevo` — productos.
- `/login` — acceso con sesión.

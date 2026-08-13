# 🔧 Fixora

> Sistema de gestión para tu taller de reparación de **celulares** 📱 y **computadoras** 💻

Fixora te ayuda a organizar clientes, equipos, órdenes de reparación, pagos e
inventario en un solo lugar. Diseño moderno, totalmente **responsive** y con
modo **claro/oscuro** 🌗.

---

## ✨ Funcionalidades

| Módulo | Qué puedes hacer |
| --- | --- |
| 📋 **Órdenes** | Registrar reparaciones, avanzar el estado (recibida → diagnóstico → reparación → pago → entregada), agregar diagnóstico y costo. |
| 👥 **Clientes** | Registrar y buscar clientes, con equipos y órdenes asociadas. |
| 💾 **Equipos** | Celulares y computadoras por cliente, con tipo, marca, modelo, IMEI/serie y notas. |
| 💳 **Pagos** | Cobrar pagos y abonos (efectivo, tarjeta, transferencia), ver saldo pendiente e historial. |
| 📦 **Inventario** | Productos con stock, stock mínimo y alertas de stock bajo, filtro por categoría. |
| 🔍 **Búsqueda** | Filtros por texto y estado en órdenes, inventario, clientes y equipos. |
| 📊 **Dashboard** | Resumen del taller: órdenes por estado, ingresos cobrados y stock bajo. |
| 🌗 **Tema** | Modo claro y oscuro con selector en toda la app. |

## 🛠️ Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + React 19
- **Estilos:** Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)
- **Base de datos:** MongoDB + Mongoose 9
- **Autenticación:** JWT (`jose`) con cookies + contraseñas cifradas (`bcryptjs`)
- **Extras:** `next-themes`, `lucide-react`

## 🚀 Puesta en marcha

### 1. Requisitos

- **Node.js 20+**
- Una base de datos **MongoDB** (p. ej. [MongoDB Atlas](https://www.mongodb.com/atlas), que es la configurada en este proyecto)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto (no está en Git por seguridad):

```env
# Conexión a tu base MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/taller_pc

# Clave secreta para firmar sesiones (genera una así)
AUTH_SECRET=node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> ✍️ Pega el resultado del comando `AUTH_SECRET` en la variable, no el comando.

### 4. Cargar datos de demostración (opcional)

```bash
npm run seed
```

Esto inserta: 1 usuario, 5 clientes, 7 equipos, 5 productos, 7 órdenes y 2 pagos.

### 5. Arrancar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 👈

## 🔐 Acceso de prueba

| Campo | Valor |
| --- | --- |
| ✉️ Correo | `admin@fixora.mx` |
| 🔑 Contraseña | `admin123` |

## 📜 Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run seed` | Inserta datos de demostración |

## 🗂️ Estructura del proyecto

```
app/            # Rutas y páginas (App Router)
  (dashboard)/  # Módulos protegidos (ordenes, clientes, equipos, inventario, dashboard)
actions/        # Server Actions (crear orden, pagos, clientes, etc.)
components/     # UI y componentes de negocio
  ui/           # Componentes shadcn/ui
lib/            # Constantes, serializers, conexión a MongoDB, auth
models/         # Modelos Mongoose (Customer, Device, WorkOrder, Product, User, Payment)
scripts/        # Scripts de utilidad (seed)
```

## 🔒 Seguridad

- Las variables de entorno están excluidas del control de versiones (`.env` en `.gitignore`).
- Las contraseñas se guardan cifradas con `bcryptjs`.
- Las sesiones usan JWT firmado con `AUTH_SECRET` y cookies `httpOnly`.

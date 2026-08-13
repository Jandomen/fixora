import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Device } from "@/models/Device";
import { Payment } from "@/models/Payment";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { WorkOrder } from "@/models/WorkOrder";

async function seed() {
  await connectDB();

  await Promise.all([
    Customer.deleteMany(),
    Device.deleteMany(),
    Product.deleteMany(),
    User.deleteMany(),
    WorkOrder.deleteMany(),
    Payment.deleteMany(),
  ]);

  await User.create({
    name: "Admin Fixora",
    email: "admin@fixora.mx",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  });

  const [juan, maria, pedro, ana, carlos] = await Customer.create([
    { name: "Juan Pérez", phone: "555-1234", email: "juan@example.com" },
    { name: "María López", phone: "555-5678", email: "maria@example.com" },
    { name: "Pedro García", phone: "555-9012" },
    { name: "Ana Torres", phone: "555-1111", email: "ana@example.com" },
    { name: "Carlos Ruiz", phone: "555-2222" },
  ]);

  const [laptopJuan, desktopMaria, laptopMaria, laptopPedro, celularJuan, celularAna, desktopCarlos] =
    await Device.create([      {
        customer: juan._id,
        type: "laptop",
        brand: "HP",
        model: "Pavilion 15",
        serialNumber: "HP-001",
      },
      {
        customer: maria._id,
        type: "desktop",
        brand: "Dell",
        model: "OptiPlex 7010",
        serialNumber: "DELL-002",
      },
      {
        customer: maria._id,
        type: "laptop",
        brand: "Lenovo",
        model: "ThinkPad T480",
        serialNumber: "LEN-003",
      },
      {
        customer: pedro._id,
        type: "laptop",
        brand: "Asus",
        model: "VivoBook 15",
        serialNumber: "ASUS-004",
      },
      {
        customer: juan._id,
        type: "celular",
        brand: "Samsung",
        model: "Galaxy A54",
        serialNumber: "SAM-005",
      },
      {
        customer: ana._id,
        type: "celular",
        brand: "Apple",
        model: "iPhone 13",
        serialNumber: "APL-006",
      },
      {
        customer: carlos._id,
        type: "desktop",
        brand: "HP",
        model: "Pavilion TP01",
        serialNumber: "HP-007",
      },
    ]);

  await Product.create([
    {
      name: "Memoria RAM 8GB DDR4",
      sku: "RAM-8GB-DDR4",
      brand: "Kingston",
      category: "componente",
      stock: 12,
      minStock: 5,
      costPrice: 350,
      salePrice: 650,
    },
    {
      name: "SSD 240GB SATA",
      sku: "SSD-240-SATA",
      brand: "Crucial",
      category: "componente",
      stock: 3,
      minStock: 5,
      costPrice: 380,
      salePrice: 720,
    },
    {
      name: "Ventilador 120mm",
      sku: "FAN-120MM",
      brand: "Cooler Master",
      category: "componente",
      stock: 20,
      minStock: 10,
      costPrice: 80,
      salePrice: 180,
    },
    {
      name: "Pasta térmica (tubo)",
      sku: "PASTA-TERMICA",
      brand: "Arctic",
      category: "consumible",
      stock: 0,
      minStock: 4,
      costPrice: 90,
      salePrice: 200,
    },
    {
      name: "Mouse USB inalámbrico",
      sku: "MOUSE-WL-USB",
      brand: "Logitech",
      category: "accesorio",
      stock: 8,
      minStock: 3,
      costPrice: 120,
      salePrice: 280,
    },
  ]);

  const orders = await WorkOrder.create([
    {
      number: "WO-0001",
      customer: juan._id,
      device: laptopJuan._id,
      status: "en_reparacion",
      reportedIssue: "No enciende y hace un pitido al conectarla.",
      diagnosis: "Se encontró una falla en el módulo de memoria RAM.",
      estimatedCost: 1200,
    },
    {
      number: "WO-0002",
      customer: maria._id,
      device: desktopMaria._id,
      status: "en_diagnostico",
      reportedIssue: "Se apaga sola después de unos minutos de uso.",
      diagnosis: "Posible sobrecalentamiento: se probará con nueva pasta térmica.",
    },
    {
      number: "WO-0003",
      customer: maria._id,
      device: laptopMaria._id,
      status: "entregada",
      reportedIssue: "Pantalla no muestra imagen, solo enciende el led.",
      diagnosis: "Cable de video interno desconectado. Se reacomodó y quedó funcionando.",
      estimatedCost: 800,
    },
    {
      number: "WO-0004",
      customer: pedro._id,
      device: laptopPedro._id,
      status: "pendiente_pago",
      reportedIssue: "Reinstalación de Windows y limpieza de ventiladores.",
      diagnosis: "Reinstalación completada y limpieza interna realizada.",
      estimatedCost: 600,
    },
    {
      number: "WO-0005",
      customer: juan._id,
      device: celularJuan._id,
      status: "en_reparacion",
      reportedIssue: "Se cae la señal y la batería se agota muy rápido.",
      diagnosis: "Se recomienda cambio de batería.",
      estimatedCost: 500,
    },
    {
      number: "WO-0006",
      customer: ana._id,
      device: celularAna._id,
      status: "recibida",
      reportedIssue: "Se mojó y ya no enciende.",
      estimatedCost: 900,
    },
    {
      number: "WO-0007",
      customer: carlos._id,
      device: desktopCarlos._id,
      status: "en_diagnostico",
      reportedIssue: "Hace mucho ruido y se reinicia solo.",
      estimatedCost: 400,
    },
  ]);

  await Payment.create([
    {
      order: orders[2]._id,
      amount: 800,
      method: "efectivo",
      note: "Pago total",
    },
    {
      order: orders[3]._id,
      amount: 300,
      method: "transferencia",
      note: "Abono inicial",
    },
  ]);

  console.log(
    "Seed completado: 1 usuario, 5 clientes, 7 equipos, 5 productos, 7 órdenes y 2 pagos."
  );
  console.log("Login: admin@fixora.mx / admin123");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error al ejecutar el seed:", error);
  process.exit(1);
});

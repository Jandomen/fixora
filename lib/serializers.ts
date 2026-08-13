import type { Customer } from "@/models/Customer";
import type { Device } from "@/models/Device";
import type { DeviceType } from "@/lib/device";
import type { PaymentMethod } from "@/lib/payment";
import type { Payment } from "@/models/Payment";
import type { Product, ProductCategory } from "@/models/Product";
import type { WorkOrder, WorkOrderStatus } from "@/models/WorkOrder";

export type SerializedCustomer = {
  _id: string;
  name: string;
  phone: string;
  email: string | null;
};

export type SerializedDevice = {
  _id: string;
  customerId: string;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber: string | null;
};

export type SerializedWorkOrder = {
  _id: string;
  number: string;
  status: WorkOrderStatus;
  reportedIssue: string;
  diagnosis: string | null;
  estimatedCost: number | null;
  createdAt: string;
  customer: SerializedCustomer | null;
  device: { _id: string; brand: string; model: string } | null;
};

export type SerializedPayment = {
  _id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  note: string | null;
  createdAt: string;
};

export function serializeCustomer(customer: Customer): SerializedCustomer {
  return {
    _id: customer._id.toString(),
    name: customer.name,
    phone: customer.phone,
    email: customer.email ?? null,
  };
}

export function serializeDevice(device: Device): SerializedDevice {
  return {
    _id: device._id.toString(),
    customerId: device.customer.toString(),
    type: device.type,
    brand: device.brand,
    model: device.model,
    serialNumber: device.serialNumber ?? null,
  };
}

export function serializePayment(payment: Payment): SerializedPayment {
  return {
    _id: payment._id.toString(),
    orderId: payment.order.toString(),
    amount: payment.amount,
    method: payment.method,
    note: payment.note ?? null,
    createdAt: payment.createdAt.toISOString(),
  };
}

export type SerializedProduct = {
  _id: string;
  name: string;
  sku: string;
  brand: string | null;
  category: ProductCategory;
  stock: number;
  minStock: number;
  costPrice: number | null;
  salePrice: number | null;
  description: string | null;
};

export function serializeProduct(product: Product): SerializedProduct {
  return {
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    brand: product.brand ?? null,
    category: product.category,
    stock: product.stock,
    minStock: product.minStock,
    costPrice: product.costPrice ?? null,
    salePrice: product.salePrice ?? null,
    description: product.description ?? null,
  };
}

export type PopulatedWorkOrder = Omit<WorkOrder, "customer" | "device"> & {
  customer: Pick<Customer, "_id" | "name" | "phone"> | null;
  device: Pick<Device, "_id" | "brand" | "model"> | null;
};

export function serializeWorkOrder(order: PopulatedWorkOrder): SerializedWorkOrder {
  return {
    _id: order._id.toString(),
    number: order.number,
    status: order.status,
    reportedIssue: order.reportedIssue,
    diagnosis: order.diagnosis ?? null,
    estimatedCost: order.estimatedCost ?? null,
    createdAt: order.createdAt.toISOString(),
    customer: order.customer
      ? {
          _id: order.customer._id.toString(),
          name: order.customer.name,
          phone: order.customer.phone,
          email: null,
        }
      : null,
    device: order.device
      ? {
          _id: order.device._id.toString(),
          brand: order.device.brand,
          model: order.device.model,
        }
      : null,
  };
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products, shops } from '@/data/mockData';

export type OrderItem = {
  productId: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  color: string;
  shopName: string;
};

export type OrderStatus = 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address?: {
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
  };
  estimatedDelivery: string;
  cancellationReason?: string;
};

type OrderInput = Omit<Order, 'id' | 'orderNumber' | 'placedAt' | 'status' | 'estimatedDelivery'>;

type OrderContextType = {
  orders: Order[];
  addOrder: (orderInput: OrderInput) => string;
  getOrderById: (id: string) => Order | undefined;
  lastOrderId: string | null;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper to generate a realistic mock order from our mock data
const generateSeedOrder = (
  id: string,
  daysAgo: number,
  status: OrderStatus,
  itemSpecs: { productId: number; variant: string; quantity: number }[],
  deliveryMethod: 'delivery' | 'pickup' = 'delivery',
  cancellationReason?: string
): Order => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const orderItems: OrderItem[] = itemSpecs.map((spec) => {
    const product = products.find((p) => p.id === spec.productId)!;
    const shop = shops.find((s) => s.id === product.shopId)!;
    return {
      productId: product.id,
      name: product.name,
      variant: spec.variant,
      price: product.price,
      quantity: spec.quantity,
      color: product.color,
      shopName: shop.name,
    };
  });

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 1500 : 0;
  
  const estimatedDate = new Date(date);
  estimatedDate.setDate(estimatedDate.getDate() + 2);
  const estimatedDeliveryText = `${estimatedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, 10am - 4pm`;

  return {
    id,
    orderNumber: `MM-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
    placedAt: date.toISOString(),
    status,
    deliveryMethod,
    paymentMethod: 'paystack',
    items: orderItems,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    address: deliveryMethod === 'delivery' ? {
      firstName: 'Chinedu',
      lastName: 'Okafor',
      phone: '08012345678',
      street: '15 Freedom Way',
      city: 'Lekki / Ajah'
    } : undefined,
    estimatedDelivery: estimatedDeliveryText,
    cancellationReason,
  };
};

const initialSeedOrders: Order[] = [
  generateSeedOrder('order-3', 0.4, 'out_for_delivery', [
    { productId: 5, variant: '256GB', quantity: 1 },
    { productId: 8, variant: 'Black', quantity: 1 }
  ]),
  generateSeedOrder('order-2', 2, 'cancelled', [
    { productId: 3, variant: 'Black', quantity: 1 }
  ], 'delivery', 'Vendor ran out of stock'),
  generateSeedOrder('order-1', 6, 'delivered', [
    { productId: 1, variant: '65-inch', quantity: 1 },
    { productId: 2, variant: 'Disc Edition', quantity: 1 }
  ], 'pickup'),
];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('market_mirror_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse orders from localStorage", e);
    }
    return initialSeedOrders;
  });

  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('market_mirror_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderInput: OrderInput) => {
    const id = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderNumber = `MM-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const estimatedDelivery = `${tomorrow.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, 10am - 4pm`;

    const newOrder: Order = {
      ...orderInput,
      id,
      orderNumber,
      placedAt: new Date().toISOString(),
      status: 'confirmed',
      estimatedDelivery,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrderId(id);
    return id;
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  // Sort orders newest first
  const sortedOrders = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  return (
    <OrderContext.Provider value={{ orders: sortedOrders, addOrder, getOrderById, lastOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

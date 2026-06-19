import apiClient from './client';

export interface Address {
  id: number;
  address: string;
  is_default: boolean;
}

export interface PaymentMethod {
  slug: string;
  name: string;
  description: string;
}

export interface CheckoutRequest {
  address_id: number;
  payment_method: string;
  items: { product_id: number; quantity: number }[];
}

export interface CheckoutResponse {
  order_id: number;
  message: string;
}

export async function getAddresses(): Promise<Address[]> {
  const response = await apiClient.get('/addresses');
  return response.data;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const response = await apiClient.get('/payment-methods');
  return response.data;
}

export async function createOrder(data: CheckoutRequest): Promise<CheckoutResponse> {
  const response = await apiClient.post('/orders', data);
  return response.data;
}

export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface OrderHistory {
  id: number;
  created_at: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  address: string;
  status: string;
}

export async function getOrderHistory(): Promise<OrderHistory[]> {
  const response = await apiClient.get('/orders/history');
  return response.data;
}

export async function createAddress(address: string, isDefault: boolean = false): Promise<Address> {
  const response = await apiClient.post('/addresses', { address, is_default: isDefault });
  return response.data;
}

export async function updateAddress(id: number, data: { address?: string; is_default?: boolean }): Promise<Address> {
  const response = await apiClient.put(`/addresses/${id}`, data);
  return response.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await apiClient.delete(`/addresses/${id}`);
}
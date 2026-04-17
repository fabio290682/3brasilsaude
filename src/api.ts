import { CustomerProfileData, OpportunityData, OrderData } from './types';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || 'Erro ao enviar dados');
  }

  return response.json();
}

export async function submitCustomer(data: Partial<CustomerProfileData>) {
  return post<{ success: boolean }>('/customers', data);
}

export async function submitOpportunity(data: Partial<OpportunityData>) {
  return post<{ success: boolean }>('/opportunities', data);
}

export async function submitOrder(data: Partial<OrderData>) {
  return post<{ success: boolean }>('/orders', data);
}

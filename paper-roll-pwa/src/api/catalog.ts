import apiClient from "./client";

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    unit: string;
    stock: number;
    description: string;
}

export interface Category {
    slug: string;
    name: string;
    icon: string;
}

export async function getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    return response.data;
}

export async function getProducts(category?: string): Promise<Product[]> {
    const params = category ? { category } : {};
    const response = await apiClient.get('/products', { params });
    return response.data;
}
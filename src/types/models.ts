// Tipos de datos para el marketplace

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[]; // URLs de imágenes en S3
  seller: User;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'sold' | 'inactive';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[]; // URLs de imágenes en S3
  provider: User;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  createdAt: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: File[]; // Para upload
  sellerId: string;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: File[]; // Para upload
  providerId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

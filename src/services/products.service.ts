import { apiClient } from './api-client';
import { s3Service } from './s3.service';
import type { Product, CreateProductInput, ApiResponse, ListResponse } from '../types/models';

/**
 * Servicio para gestionar productos
 */
export const productsService = {
  /**
   * Obtener todos los productos con paginación
   */
  async getAll(page: number = 1, pageSize: number = 20, filters?: any): Promise<ListResponse<Product>> {
    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    return apiClient.get<ListResponse<Product>>(`/products?${query.toString()}`);
  },

  /**
   * Obtener un producto por ID
   */
  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Crear un nuevo producto
   */
  async create(input: CreateProductInput): Promise<Product> {
    // 1. Subir imágenes a S3
    const imageUrls = await Promise.all(
      input.images.map((file) => s3Service.uploadImage(file))
    );

    // 2. Crear producto en DynamoDB vía Lambda
    const productData = {
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      location: input.location,
      images: imageUrls,
      sellerId: input.sellerId,
    };

    const response = await apiClient.post<ApiResponse<Product>>('/products', productData);
    
    if (!response.success) {
      throw new Error(response.error || 'Error creating product');
    }

    return response.data!;
  },

  /**
   * Actualizar un producto
   */
  async update(id: string, data: Partial<CreateProductInput>): Promise<Product> {
    // Si hay nuevas imágenes, subirlas
    let imageUrls: string[] = [];
    if (data.images && data.images.length > 0) {
      imageUrls = await Promise.all(
        data.images.map((file) => s3Service.uploadImage(file))
      );
    }

    const updateData = {
      ...data,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, updateData);
    
    if (!response.success) {
      throw new Error(response.error || 'Error updating product');
    }

    return response.data!;
  },

  /**
   * Eliminar un producto
   */
  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Error deleting product');
    }
  },

  /**
   * Buscar productos
   */
  async search(query: string, filters?: any): Promise<ListResponse<Product>> {
    return this.getAll(1, 20, { q: query, ...filters });
  },

  /**
   * Obtener productos por vendedor
   */
  async getBySellerId(sellerId: string, page: number = 1): Promise<ListResponse<Product>> {
    return this.getAll(page, 20, { sellerId });
  },
};

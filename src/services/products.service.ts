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
  async create(input: CreateProductInput): Promise<{ product: Product; imageUploadError?: string }> {
    // 1. Intentar subir imágenes, pero continuar aunque fallen
    let imageUrls: string[] = [];
    let imageUploadError: string | undefined;

    if (input.images && input.images.length > 0) {
      const s3Results = await Promise.allSettled(
        input.images.map((file) => s3Service.uploadImage(file))
      );

      for (let i = 0; i < s3Results.length; i++) {
        const result = s3Results[i];
        if (result.status === 'fulfilled') {
          imageUrls.push(result.value);
        } else {
          // Registrar error y no incluir data-URLs grandes en el payload
          console.warn(`[ProductsService] S3 falló para imagen ${i + 1}:`, result.reason?.message);
          if (!imageUploadError) imageUploadError = result.reason?.message;
          // Opción: podríamos reintentar aquí o marcar la imagen como pendiente.
        }
      }
    }

    // 2. Crear producto en DynamoDB vía Lambda (con o sin imágenes)
    const primaryImageUrl = imageUrls[0] || '';

    const productData = {
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      location: input.location,
      imageUrl: primaryImageUrl,
      images: imageUrls,
      sellerId: input.sellerId,
    };

    console.log('[ProductsService] Creando producto con datos:', { ...productData, images: imageUrls.length });

    const response = await apiClient.post<ApiResponse<Product>>('/products', productData);

    if (!response.success) {
      throw new Error(response.error || 'Error creating product');
    }

    return { product: response.data!, imageUploadError };
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

    const primaryImageUrl = imageUrls[0] || '';

    const updateData = {
      ...data,
      ...(primaryImageUrl ? { imageUrl: primaryImageUrl } : {}),
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

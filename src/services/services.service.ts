import { apiClient } from './api-client';
import { s3Service } from './s3.service';
import type { Service, CreateServiceInput, ApiResponse, ListResponse } from '../types/models';

/**
 * Servicio para gestionar servicios (freelance, etc)
 */
export const servicesService = {
  /**
   * Obtener todos los servicios con paginación
   */
  async getAll(page: number = 1, pageSize: number = 20, filters?: any): Promise<ListResponse<Service>> {
    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    return apiClient.get<ListResponse<Service>>(`/services?${query.toString()}`);
  },

  /**
   * Obtener un servicio por ID
   */
  async getById(id: string): Promise<Service> {
    return apiClient.get<Service>(`/services/${id}`);
  },

  /**
   * Crear un nuevo servicio
   */
  async create(input: CreateServiceInput): Promise<Service> {
    // 1. Subir imágenes a S3
    const imageUrls = await Promise.all(
      input.images.map((file) => s3Service.uploadImage(file))
    );

    // 2. Crear servicio en DynamoDB vía Lambda
    const serviceData = {
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      location: input.location,
      images: imageUrls,
      providerId: input.providerId,
    };

    const response = await apiClient.post<ApiResponse<Service>>('/services', serviceData);
    
    if (!response.success) {
      throw new Error(response.error || 'Error creating service');
    }

    return response.data!;
  },

  /**
   * Actualizar un servicio
   */
  async update(id: string, data: Partial<CreateServiceInput>): Promise<Service> {
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

    const response = await apiClient.put<ApiResponse<Service>>(`/services/${id}`, updateData);
    
    if (!response.success) {
      throw new Error(response.error || 'Error updating service');
    }

    return response.data!;
  },

  /**
   * Eliminar un servicio
   */
  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/services/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Error deleting service');
    }
  },

  /**
   * Buscar servicios
   */
  async search(query: string, filters?: any): Promise<ListResponse<Service>> {
    return this.getAll(1, 20, { q: query, ...filters });
  },

  /**
   * Obtener servicios por proveedor
   */
  async getByProviderId(providerId: string, page: number = 1): Promise<ListResponse<Service>> {
    return this.getAll(page, 20, { providerId });
  },
};

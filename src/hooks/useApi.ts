/**
 * Hooks reutilizables para la aplicación
 */

import { useState, useEffect, useCallback } from 'react';
import { productsService } from '@/services/products.service';
import { servicesService } from '@/services/services.service';
import type { Product, Service, ListResponse } from '@/types/models';

/**
 * Hook para cargar productos con paginación
 */
export function useProducts(page: number = 1, pageSize: number = 20, filters?: any) {
  const [data, setData] = useState<ListResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsService.getAll(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error cargando productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, filters]);

  return { data, loading, error };
}

/**
 * Hook para cargar servicios con paginación
 */
export function useServices(page: number = 1, pageSize: number = 20, filters?: any) {
  const [data, setData] = useState<ListResponse<Service> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await servicesService.getAll(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error cargando servicios');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, pageSize, filters]);

  return { data, loading, error };
}

/**
 * Hook para cargar un producto individual
 */
export function useProduct(id: string) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsService.getById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error cargando producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook para cargar un servicio individual
 */
export function useService(id: string) {
  const [data, setData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await servicesService.getById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error cargando servicio');
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook para buscar productos
 */
export function useProductSearch(query: string, filters?: any) {
  const [data, setData] = useState<ListResponse<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsService.search(query, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error buscando productos');
        console.error('Error searching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar llamadas frecuentes
    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [query, filters]);

  return { data, loading, error };
}

/**
 * Hook para buscar servicios
 */
export function useServiceSearch(query: string, filters?: any) {
  const [data, setData] = useState<ListResponse<Service> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const searchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await servicesService.search(query, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error buscando servicios');
        console.error('Error searching services:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce
    const timer = setTimeout(searchServices, 300);
    return () => clearTimeout(timer);
  }, [query, filters]);

  return { data, loading, error };
}

import { AWS_CONFIG, buildApiUrl } from './aws-config';
import type { ApiResponse, ListResponse } from '../types/models';

/**
 * Cliente HTTP genérico para comunicarse con API Gateway
 */
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    const hasBody = options.body !== undefined && options.body !== null;
    const mergedHeaders: Record<string, string> = {
      ...(hasBody ? { 'Content-Type': 'text/plain;charset=UTF-8' } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          ...mergedHeaders,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Request Failed: ${endpoint}`, {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

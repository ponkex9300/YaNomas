/**
 * AWS Lambda Functions para YaNomas Marketplace
 * 
 * Estructura esperada en AWS Lambda:
 * - Function: products-get-all
 * - Function: products-get-by-id
 * - Function: products-create
 * - Function: products-update
 * - Function: products-delete
 * - Function: services-get-all
 * - Function: services-get-by-id
 * - Function: services-create
 * - Function: services-update
 * - Function: services-delete
 * - Function: upload-image
 * - Function: delete-image
 */

// ====== LAYER: Shared Utils ======
// Este código va en una Lambda Layer compartida

export interface DynamoDBProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  sellerId: string;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'sold' | 'inactive';
}

export interface DynamoDBService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  providerId: string;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const createSuccessResponse = <T>(data: T, statusCode = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
    success: true,
    data,
  }),
});

export const createErrorResponse = (error: string, statusCode = 400) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
    success: false,
    error,
  }),
});

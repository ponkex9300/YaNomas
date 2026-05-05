/**
 * Lambda: Crear un nuevo producto
 * Endpoint: POST /products
 */

import { dynamoDocumentClient, PutCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse, generateId, getCurrentTimestamp } from './shared-utils';
import type { DynamoDBProduct } from './shared-utils';

const TABLE_NAME = 'YaNomas-Products';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');

    // Validar campos requeridos
    const requiredFields = ['title', 'description', 'price', 'category', 'location', 'sellerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`${field} is required`, 400);
      }
    }

    const product: DynamoDBProduct = {
      id: generateId(),
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      location: body.location,
      images: body.images || [],
      sellerId: body.sellerId,
      rating: 0,
      reviews: 0,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      status: 'active',
    };

    await dynamoDocumentClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: product,
      })
    );

    return createSuccessResponse(product, 201);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return createErrorResponse(error.message || 'Error creating product', 500);
  }
};

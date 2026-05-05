/**
 * Lambda: Crear un nuevo servicio
 * Endpoint: POST /services
 */

import { dynamoDocumentClient, PutCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse, generateId, getCurrentTimestamp } from './shared-utils';
import type { DynamoDBService } from './shared-utils';

const TABLE_NAME = 'YaNomas-Services';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');

    const requiredFields = ['title', 'description', 'price', 'category', 'location', 'providerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`${field} is required`, 400);
      }
    }

    const service: DynamoDBService = {
      id: generateId(),
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      location: body.location,
      images: body.images || [],
      providerId: body.providerId,
      rating: 0,
      reviews: 0,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      status: 'active',
    };

    await dynamoDocumentClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: service,
      })
    );

    return createSuccessResponse(service, 201);
  } catch (error: any) {
    console.error('Error creating service:', error);
    return createErrorResponse(error.message || 'Error creating service', 500);
  }
};

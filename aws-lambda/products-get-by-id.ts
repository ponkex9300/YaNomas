/**
 * Lambda: Obtener un producto por ID
 * Endpoint: GET /products/{id}
 */

import { dynamoDocumentClient, GetCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const TABLE_NAME = 'YaNomas-Products';

export const handler = async (event: any) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return createErrorResponse('Product ID is required', 400);
    }

    const result = await dynamoDocumentClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!result.Item) {
      return createErrorResponse('Product not found', 404);
    }

    return createSuccessResponse(result.Item);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return createErrorResponse(error.message || 'Error fetching product', 500);
  }
};

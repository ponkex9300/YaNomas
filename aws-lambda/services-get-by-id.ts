/**
 * Lambda: Obtener un servicio por ID
 * Endpoint: GET /services/{id}
 */

import { dynamoDocumentClient, GetCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const TABLE_NAME = 'YaNomas-Services';

export const handler = async (event: any) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return createErrorResponse('Service ID is required', 400);
    }

    const result = await dynamoDocumentClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!result.Item) {
      return createErrorResponse('Service not found', 404);
    }

    return createSuccessResponse(result.Item);
  } catch (error: any) {
    console.error('Error fetching service:', error);
    return createErrorResponse(error.message || 'Error fetching service', 500);
  }
};

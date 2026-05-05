/**
 * Lambda: Eliminar un servicio
 * Endpoint: DELETE /services/{id}
 */

import { dynamoDocumentClient, DeleteCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const TABLE_NAME = 'YaNomas-Services';

export const handler = async (event: any) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return createErrorResponse('Service ID is required', 400);
    }

    await dynamoDocumentClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    return createSuccessResponse({ id, deleted: true });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return createErrorResponse(error.message || 'Error deleting service', 500);
  }
};

/**
 * Lambda: Eliminar un producto
 * Endpoint: DELETE /products/{id}
 */

import { dynamoDocumentClient, DeleteCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const TABLE_NAME = 'YaNomas-Products';

export const handler = async (event: any) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return createErrorResponse('Product ID is required', 400);
    }

    await dynamoDocumentClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    return createSuccessResponse({ id, deleted: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return createErrorResponse(error.message || 'Error deleting product', 500);
  }
};

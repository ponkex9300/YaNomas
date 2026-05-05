/**
 * Lambda: Actualizar un servicio
 * Endpoint: PUT /services/{id}
 */

import { dynamoDocumentClient, GetCommand, UpdateCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse, getCurrentTimestamp } from './shared-utils';

const TABLE_NAME = 'YaNomas-Services';

export const handler = async (event: any) => {
  try {
    const { id } = event.pathParameters || {};
    const body = JSON.parse(event.body || '{}');

    if (!id) {
      return createErrorResponse('Service ID is required', 400);
    }

    const existing = await dynamoDocumentClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!existing.Item) {
      return createErrorResponse('Service not found', 404);
    }

    const updateData: any = {
      ...body,
      updatedAt: getCurrentTimestamp(),
    };

    const updateExpression = Object.keys(updateData)
      .map((key) => `${key} = :${key}`)
      .join(', ');

    const expressionAttributeValues: any = {};
    Object.keys(updateData).forEach((key) => {
      expressionAttributeValues[`:${key}`] = updateData[key];
    });

    const result = await dynamoDocumentClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return createSuccessResponse(result.Attributes);
  } catch (error: any) {
    console.error('Error updating service:', error);
    return createErrorResponse(error.message || 'Error updating service', 500);
  }
};

/**
 * Lambda: Obtener todos los servicios
 * Endpoint: GET /services?page=1&pageSize=20&category=...
 */

import { dynamoDocumentClient, ScanCommand } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const TABLE_NAME = 'YaNomas-Services';

interface QueryParams {
  page?: string;
  pageSize?: string;
  category?: string;
  location?: string;
  q?: string;
  providerId?: string;
}

export const handler = async (event: any) => {
  try {
    const queryParams: QueryParams = event.queryStringParameters || {};
    const page = parseInt(queryParams.page || '1');
    const pageSize = parseInt(queryParams.pageSize || '20');
    const skip = (page - 1) * pageSize;

    const params: any = {
      TableName: TABLE_NAME,
    };

    let filterExpression = '';
    const expressionAttributeValues: Record<string, string> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (queryParams.category) {
      filterExpression = filterExpression ? `${filterExpression} AND #cat = :category` : '#cat = :category';
      expressionAttributeNames['#cat'] = 'category';
      expressionAttributeValues[':category'] = queryParams.category;
    }

    if (queryParams.location) {
      filterExpression = filterExpression ? `${filterExpression} AND #loc = :location` : '#loc = :location';
      expressionAttributeNames['#loc'] = 'location';
      expressionAttributeValues[':location'] = queryParams.location;
    }

    if (queryParams.providerId) {
      filterExpression = filterExpression ? `${filterExpression} AND providerId = :providerId` : 'providerId = :providerId';
      expressionAttributeValues[':providerId'] = queryParams.providerId;
    }

    if (queryParams.q) {
      filterExpression = filterExpression ? `${filterExpression} AND (contains(#title, :q) OR contains(#desc, :q))` : '(contains(#title, :q) OR contains(#desc, :q))';
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeNames['#desc'] = 'description';
      expressionAttributeValues[':q'] = queryParams.q;
    }

    if (filterExpression) {
      params.FilterExpression = filterExpression;
    }

    if (Object.keys(expressionAttributeValues).length > 0) {
      params.ExpressionAttributeValues = expressionAttributeValues;
    }

    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    const result = await dynamoDocumentClient.send(new ScanCommand(params));

    const items = result.Items || [];
    const total = items.length;
    const paginatedItems = items.slice(skip, skip + pageSize);

    return createSuccessResponse({
      items: paginatedItems,
      total,
      page,
      pageSize,
      hasMore: skip + pageSize < total,
    });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return createErrorResponse(error.message || 'Error fetching services', 500);
  }
};

import { randomUUID } from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { PublishCommand } from '@aws-sdk/client-sns';
import { dynamoDocumentClient, snsClient } from './aws-clients';
import { createSuccessResponse, createErrorResponse, createOptionsResponse } from './shared-utils';

const TABLE_NAME = 'YaNomas-Products';

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return createOptionsResponse();
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { title, description, price, category, location, sellerId, images, imageUrl } = body;

    if (!title || price === undefined || !category || !sellerId) {
      return createErrorResponse('Faltan campos requeridos: title, price, category, sellerId', 400);
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const product = {
      id,
      title,
      description: description || '',
      price: Number(price),
      category,
      location: location || '',
      sellerId,
      images: images || [],
      imageUrl: imageUrl || images?.[0] || '',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDocumentClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: product,
    }));

    const topicArn = process.env.SNS_TOPIC_ARN;
    if (topicArn) {
      await snsClient.send(new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify({
          eventType: 'PRODUCT_CREATED',
          productId: id,
          sellerId,
          title,
          price: Number(price),
          category,
          timestamp: now,
        }),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: 'PRODUCT_CREATED',
          },
        },
      }));
    }

    return createSuccessResponse(product, 201);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return createErrorResponse(error.message || 'Error al crear producto', 500);
  }
};

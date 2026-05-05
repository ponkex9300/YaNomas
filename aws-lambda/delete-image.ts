/**
 * Lambda: Eliminar imágenes de S3
 * Endpoint: POST /delete-image
 */

import { DeleteObjectCommand, s3Client } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const BUCKET_NAME = process.env.S3_BUCKET || 'yanomas-marketplace-images';

export const handler = async (event: any) => {
  try {
    const { key } = JSON.parse(event.body || '{}');

    if (!key) {
      return createErrorResponse('Key is required', 400);
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));

    return createSuccessResponse({ key, deleted: true });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return createErrorResponse(error.message || 'Error deleting image', 500);
  }
};

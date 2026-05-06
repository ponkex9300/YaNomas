/**
 * Lambda: Subir imágenes a S3
 * Endpoint: POST /upload-image
 * 
 * Esta función recibe un archivo multipart y lo sube a S3
 * Retorna la URL pública de la imagen
 */

import { PutObjectCommand, s3Client } from './aws-clients';
import { createSuccessResponse, createErrorResponse } from './shared-utils';

const BUCKET_NAME = process.env.S3_BUCKET || 'yanomas-marketplace-images';
const REGION = process.env.AWS_REGION || 'us-east-1';

export const handler = async (event: any) => {
  try {
    // Nota: Para multipart form-data, necesitarás usar una capa de middleware
    // o procesar el evento directamente. Aquí asumimos que viene en base64.

    const { file, filename } = JSON.parse(event.body || '{}');

    if (!file || !filename) {
      return createErrorResponse('File and filename are required', 400);
    }

    // Decodificar base64
    const buffer = Buffer.from(file, 'base64');

    // Determinar mime type
    const mimeType = filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.gif')
        ? 'image/gif'
        : filename.endsWith('.webp')
          ? 'image/webp'
          : 'image/jpeg';

    // Generar nombre único en S3
    const key = `products/${Date.now()}-${filename}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read', // Hacer la imagen pública
    };

    await s3Client.send(new PutObjectCommand(params));

    // Construir URL pública
    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

    return createSuccessResponse({ url, key });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return createErrorResponse(error.message || 'Error uploading image', 500);
  }
};

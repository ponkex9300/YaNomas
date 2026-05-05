import { AWS_CONFIG } from './aws-config';

/**
 * Servicio para subir imágenes a S3 directamente desde el frontend
 * O puede usar un endpoint Lambda que maneje la subida
 */
export const s3Service = {
  /**
   * Subir una imagen a S3
   * Opción 1: Subida directa (requiere credenciales en el frontend - NO RECOMENDADO)
   * Opción 2: Usar un endpoint Lambda que maneje la subida
   */
  async uploadImage(file: File): Promise<string> {
    // Generar nombre único para la imagen
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Usar endpoint Lambda para subida segura
    return s3Service._uploadViaLambda(file, filename);
  },

  /**
   * Usar Lambda como intermediario para subida segura a S3
   */
  async _uploadViaLambda(file: File, filename: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    const response = await fetch(`${AWS_CONFIG.API_GATEWAY_URL}/upload-image`, {
      method: 'POST',
      body: formData,
      // No incluir Content-Type, el navegador lo pone automáticamente
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const { url } = await response.json();
    return url; // URL de la imagen en S3
  },

  /**
   * Eliminar una imagen de S3
   */
  async deleteImage(imageUrl: string): Promise<void> {
    // Extraer la clave de S3 de la URL
    const key = imageUrl.split('/').pop();
    if (!key) {
      throw new Error('Invalid image URL');
    }

    const response = await fetch(`${AWS_CONFIG.API_GATEWAY_URL}/delete-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  },

  /**
   * Generar URL firmada para acceso temporal
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const response = await fetch(`${AWS_CONFIG.API_GATEWAY_URL}/signed-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, expiresIn }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate signed URL');
    }

    const { url } = await response.json();
    return url;
  },
};

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
    const timestamp = Date.now();
    const compressed = await s3Service._compressImage(file);
    const filename = `${timestamp}-${compressed.name.replace(/\s+/g, '_')}`;
    return s3Service._uploadViaLambda(compressed, filename);
  },

  // Convierte un archivo a data URL comprimida (fallback cuando S3 no está disponible).
  // Usa canvas.toDataURL (síncrono) para garantizar un JPEG válido sin importar el formato original.
  toDataUrl(file: File, maxSide = 600, quality = 0.72): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl);
          const ratio = Math.min(maxSide / img.width, maxSide / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * ratio));
          canvas.height = Math.max(1, Math.round(img.height * ratio));
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas no disponible');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudo cargar la imagen para comprimir'));
      };
      img.src = objectUrl;
    });
  },

  async _compressImage(file: File, maxSide = 1024, quality = 0.82): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const ratio = Math.min(maxSide / img.width, maxSide / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file),
          'image/jpeg',
          quality,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    });
  },

  async _uploadViaLambda(file: File, filename: string): Promise<string> {
    let fileBase64: string;
    try {
      fileBase64 = await s3Service._fileToBase64(file);
    } catch {
      throw new Error('No se pudo leer el archivo de imagen');
    }

    let response: Response;
    try {
      // No se envía Content-Type: application/json para evitar el CORS preflight
      // (igual que api-client.ts). La Lambda parsea el body como JSON sin importar el content-type.
      response = await fetch(`${AWS_CONFIG.API_GATEWAY_URL}/upload-image`, {
        method: 'POST',
        body: JSON.stringify({ file: fileBase64, filename }),
      });
    } catch (networkErr: any) {
      throw new Error(
        `No se pudo conectar al servidor de imágenes. Verifica tu conexión o la configuración CORS. (${networkErr?.message ?? networkErr})`,
      );
    }

    if (response.ok) {
      const data = await response.json();
      if (!data?.url && !data?.data?.url) {
        throw new Error('El servidor no devolvió la URL de la imagen');
      }
      return data.url ?? data.data.url;
    }

    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.error || errorBody.message || errorBody.data?.error || response.statusText;
    throw new Error(`Error subiendo imagen (${response.status}): ${message}`);
  },

  async _fileToBase64(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.byteLength; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
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

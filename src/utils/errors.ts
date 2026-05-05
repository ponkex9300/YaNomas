/**
 * Utilidades para manejo de errores
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado';
};

/**
 * Formatear errores para mostrar al usuario
 */
export const formatError = (error: any): { title: string; message: string } => {
  const message = handleApiError(error);

  // Mapear mensajes de error comunes
  const errorMap: Record<string, { title: string; message: string }> = {
    'Product not found': {
      title: 'Producto no encontrado',
      message: 'El producto que buscas no existe',
    },
    'Service not found': {
      title: 'Servicio no encontrado',
      message: 'El servicio que buscas no existe',
    },
    'Failed to upload image': {
      title: 'Error al subir imagen',
      message: 'Intenta con una imagen más pequeña o en otro formato',
    },
    'Network Error': {
      title: 'Error de conexión',
      message: 'Verifica tu conexión a internet',
    },
  };

  const mapped = errorMap[message];
  if (mapped) return mapped;

  return {
    title: 'Error',
    message,
  };
};

/**
 * Toast notification helper
 */
export const showNotification = (
  type: 'success' | 'error' | 'info' | 'warning',
  message: string
) => {
  // Aquí puedes integrar con tu librería de notificaciones favorita
  // (toast, react-toastify, etc)
  console.log(`[${type.toUpperCase()}]`, message);
};

// Configuración centralizada de AWS
export const AWS_CONFIG = {
  // Reemplaza con tu API Gateway endpoint
  API_GATEWAY_URL: import.meta.env.VITE_API_GATEWAY_URL || 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod',
  
  // S3 Bucket para imágenes
  S3_BUCKET: import.meta.env.VITE_S3_BUCKET || 'yanomas-marketplace-images',
  S3_REGION: 'us-east-1',
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Construir URL de endpoint
export const buildApiUrl = (endpoint: string): string => {
  return `${AWS_CONFIG.API_GATEWAY_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

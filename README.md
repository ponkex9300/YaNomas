# YaNomas Marketplace

YaNomas es un marketplace frontend en React + Vite conectado a una arquitectura serverless en AWS.

## Qué se hizo

- Se conectó el frontend con la API real de AWS.
- Se reemplazaron datos estáticos por llamadas a Lambda desde los componentes.
- Se integraron los formularios de venta y oferta de empresa con CRUD real.
- Se conectó la lectura de productos y servicios con el backend desplegado.
- Se ajustó el cliente HTTP para evitar bloqueos de CORS en el navegador.
- Se corrigió la configuración de algunos handlers Lambda para que respondan correctamente.

## Flujo de conexión actual

La aplicación funciona así:

1. El usuario interactúa con el frontend en Vite.
2. Los componentes llaman a `api-client.ts`.
3. `api-client.ts` construye la URL usando `VITE_API_GATEWAY_URL`.
4. La petición llega a API Gateway.
5. API Gateway invoca la Lambda correspondiente.
6. La Lambda lee o escribe en DynamoDB.
7. La respuesta regresa al frontend y actualiza la interfaz.

## Estructura conectada

- `ComprarView` consume `GET /products`.
- `ContratarView` consume `GET /services`.
- `VenderView` crea productos con `POST /products`.
- `OfrecerView` crea servicios con `POST /services`.
- `products.service.ts` y `services.service.ts` encapsulan la lógica de negocio.
- `api-client.ts` centraliza las llamadas HTTP.
- `aws-config.ts` centraliza la URL de API Gateway y la configuración AWS.

## Backend AWS

- API Gateway REST: `https://t892o5txb3.execute-api.us-east-1.amazonaws.com/prod`
- Lambda para productos: `products-get-all`, `products-create`, `products-get-by-id`, `products-update`, `products-delete`
- Lambda para servicios: `services-get-all`, `services-create`, `services-get-by-id`, `services-update`, `services-delete`
- DynamoDB: `YaNomas-Products` y `YaNomas-Services`

## Variables de entorno

Debe existir un archivo `.env.local` con valores como estos:

```env
VITE_API_GATEWAY_URL=https://t892o5txb3.execute-api.us-east-1.amazonaws.com/prod
VITE_S3_BUCKET=yanomas-marketplace-images
VITE_AWS_REGION=us-east-1
```

## Ejecución local

Instalar dependencias:

```bash
pnpm install
# o
npm install
```

Levantar el frontend:

```bash
pnpm dev
# o
npm run dev
```

Abrir la app en desarrollo:

```text
http://localhost:5174
```

## Estado actual

- Lectura de productos funcionando desde el frontend.
- Lectura de servicios funcionando desde el frontend.
- Creación de productos funcionando desde el formulario.
- Creación de servicios funcionando desde el formulario.
- La app ya está conectada con la arquitectura AWS desplegada.

## Nota

Si quieres, el siguiente paso puede ser documentar también el flujo de edición, eliminación y carga de imágenes en S3.


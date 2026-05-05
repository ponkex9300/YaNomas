# Resumen de Integración AWS - YaNomas Marketplace

## Estructura Creada

```
YaNomas/
├── src/
│   ├── services/
│   │   ├── aws-config.ts          ← Configuración centralizada
│   │   ├── api-client.ts          ← Cliente HTTP genérico
│   │   ├── products.service.ts    ← CRUD productos
│   │   ├── services.service.ts    ← CRUD servicios
│   │   ├── s3.service.ts          ← Upload/Delete imágenes
│   │   └── index.ts               ← Exportaciones
│   ├── types/
│   │   └── models.ts              ← Tipos TypeScript
│   ├── hooks/
│   │   └── useApi.ts              ← Hooks para cargar datos
│   └── utils/
│       └── errors.ts              ← Manejo de errores
│
├── aws-lambda/
│   ├── shared-utils.ts            ← Utilidades compartidas
│   ├── products-*.ts              ← CRUD productos (5 funciones)
│   ├── services-*.ts              ← CRUD servicios (5 funciones)
│   └── *-image.ts                 ← Upload/Delete imágenes (2 funciones)
│
├── .env.example                   ← Variables de entorno
├── AWS_SETUP_GUIDE.md             ← Guía AWS (DynamoDB, S3, Lambda, API Gateway)
├── INTEGRATION_GUIDE.md           ← Guía de integración frontend
├── COMPRAR_VIEW_EXAMPLE.tsx       ← Ejemplo: Vista de compra con API
├── VENDER_VIEW_EXAMPLE.tsx        ← Ejemplo: Vista de venta con formulario
├── CHECKLIST.md                   ← Pasos siguientes
└── ARCHITECTURE_SUMMARY.md        ← Este archivo
```

## Arquitectura

### Diagrama de flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                         │
│                                                                   │
│  ComprarView  →  useProducts() hook  →  productsService.getAll() │
│  VenderView   →  productsService.create()  →  apiClient.post()   │
│  Imágenes     →  s3Service.uploadImage()                         │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
                    .env.local
        VITE_API_GATEWAY_URL = https://...
                             ↓
┌────────────────────────────────────────────────────────────────────┐
│              API GATEWAY (REST API)                                │
│  https://abc123.execute-api.us-east-1.amazonaws.com/prod          │
│                                                                    │
│  GET    /products          ↔  Lambda: products-get-all           │
│  POST   /products          ↔  Lambda: products-create            │
│  GET    /products/{id}     ↔  Lambda: products-get-by-id         │
│  PUT    /products/{id}     ↔  Lambda: products-update            │
│  DELETE /products/{id}     ↔  Lambda: products-delete            │
│                                                                    │
│  (Mismo patrón para /services)                                   │
│                                                                    │
│  POST   /upload-image      ↔  Lambda: upload-image              │
│  POST   /delete-image      ↔  Lambda: delete-image              │
└────────┬─────────────────────────────────┬────────────────────────┘
         ↓                                 ↓
    ┌─────────────────┐         ┌──────────────────┐
    │   DynamoDB      │         │       S3         │
    │                 │         │                  │
    │ YaNomas-        │         │ yanomas-         │
    │ Products        │         │ marketplace-     │
    │                 │         │ images           │
    │ YaNomas-        │         │                  │
    │ Services        │         │ (Imágenes)      │
    │                 │         │                  │
    │ (Datos)         │         └──────────────────┘
    └─────────────────┘
```

## Flujos de Datos

### 1. Obtener productos
```
ComprarView → useProducts() → productsService.getAll()
  → apiClient.get('/products?page=1&pageSize=20')
  → API Gateway → Lambda: products-get-all
  → DynamoDB.scan() → Response
```

### 2. Crear producto con imágenes
```
VenderView (formulario) 
  → productsService.create({title, description, images[], ...})
  → Para cada imagen: s3Service.uploadImage(file)
    → apiClient.post('/upload-image')
    → API Gateway → Lambda: upload-image
    → S3.putObject() → URL de imagen
  → apiClient.post('/products', {title, ..., images: [URLs]})
  → API Gateway → Lambda: products-create
  → DynamoDB.put() → Nuevo producto
```

### 3. Buscar productos
```
ComprarView (search input) 
  → useProductSearch(query)
  → productsService.search(query, filters)
  → apiClient.get('/products?q=query&category=...')
  → API Gateway → Lambda: products-get-all
  → DynamoDB.scan(FilterExpression) → Resultados
```

## Dependencias Necesarias

Ya están en `package.json`:
- React 18+
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide Icons

En AWS necesitas:
- AWS DynamoDB (serverless)
- AWS S3 (serverless)
- AWS Lambda (serverless)
- AWS API Gateway (serverless)
- Opcionalmente: AWS Cognito (autenticación)

## Funcionalidades Implementadas

### Frontend Services (TypeScript)
- Cliente HTTP genérico (GET, POST, PUT, PATCH, DELETE)
- CRUD completo de Productos
- CRUD completo de Servicios
- Upload/Delete de imágenes a S3
- Búsqueda y filtrado
- Paginación
- Manejo centralizado de errores
- Tipos TypeScript strict

### React Hooks
- `useProducts` - Cargar productos con paginación
- `useServices` - Cargar servicios con paginación
- `useProduct` - Cargar un producto específico
- `useService` - Cargar un servicio específico
- `useProductSearch` - Buscar productos (con debounce)
- `useServiceSearch` - Buscar servicios (con debounce)

### Lambda Functions (Node.js 18)
- 5 funciones para productos (CRUD + validaciones)
- 5 funciones para servicios (CRUD + validaciones)
- 2 funciones para imágenes (upload/delete)
- Manejo de errores y validaciones
- Respuestas JSON estandarizadas

### DynamoDB
- Tabla YaNomas-Products con índice GSI por sellerId
- Tabla YaNomas-Services con índice GSI por providerId
- Búsqueda, filtrado y paginación

### S3
- Bucket público para imágenes
- CORS configurado
- URLs públicas para imágenes
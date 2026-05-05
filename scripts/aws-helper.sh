#!/bin/bash
# Script auxiliar para tareas comunes en la integración AWS

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 YaNomas Marketplace - AWS Integration Helper${NC}\n"

# Función para imprimir secciones
section() {
    echo -e "\n${GREEN}➜${NC} $1\n"
}

# Función para imprimir errores
error() {
    echo -e "${RED}✗ Error: $1${NC}"
    exit 1
}

# Función para imprimir éxito
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Menú principal
show_menu() {
    echo "Selecciona una opción:"
    echo ""
    echo "1) Verificar dependencias"
    echo "2) Crear archivo .env.local"
    echo "3) Validar variables de entorno"
    echo "4) Crear tablas DynamoDB"
    echo "5) Crear bucket S3"
    echo "6) Listar recursos AWS"
    echo "7) Ver logs Lambda"
    echo "8) Compilar funciones Lambda"
    echo "9) Salir"
    echo ""
}

# Verificar dependencias
check_dependencies() {
    section "Verificando dependencias..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado"
    fi
    success "Node.js: $(node --version)"
    
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado"
    fi
    success "npm: $(npm --version)"
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI no está instalado. Instala con: npm install -g aws-cli"
    fi
    success "AWS CLI: $(aws --version)"
    
    # Verificar que AWS está configurado
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS no está configurado. Ejecuta: aws configure"
    fi
    success "AWS configurado correctamente"
    success "Todas las dependencias están instaladas"
}

# Crear .env.local
create_env() {
    section "Creando archivo .env.local..."
    
    if [ -f .env.local ]; then
        read -p ".env.local ya existe. ¿Sobrescribir? (s/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            return
        fi
    fi
    
    read -p "Ingresa tu API Gateway URL: " api_url
    read -p "Ingresa tu S3 bucket name [yanomas-marketplace-images]: " s3_bucket
    
    s3_bucket=${s3_bucket:-yanomas-marketplace-images}
    
    cat > .env.local << EOF
# AWS Configuration
VITE_API_GATEWAY_URL=$api_url
VITE_S3_BUCKET=$s3_bucket

# Desarrollo
VITE_DEBUG=false
EOF
    
    success ".env.local creado correctamente"
    echo ""
    cat .env.local
}

# Validar variables de entorno
validate_env() {
    section "Validando variables de entorno..."
    
    if [ ! -f .env.local ]; then
        error ".env.local no existe. Corre: bash scripts/aws-helper.sh y selecciona opción 2"
    fi
    
    source .env.local
    
    if [ -z "$VITE_API_GATEWAY_URL" ]; then
        error "VITE_API_GATEWAY_URL no está definida"
    fi
    success "VITE_API_GATEWAY_URL: $VITE_API_GATEWAY_URL"
    
    if [ -z "$VITE_S3_BUCKET" ]; then
        error "VITE_S3_BUCKET no está definida"
    fi
    success "VITE_S3_BUCKET: $VITE_S3_BUCKET"
    
    success "Todas las variables están configuradas"
}

# Crear tablas DynamoDB
create_dynamodb() {
    section "Creando tablas DynamoDB..."
    
    echo "Verificando tabla YaNomas-Products..."
    if aws dynamodb describe-table --table-name YaNomas-Products 2>/dev/null; then
        echo "Tabla YaNomas-Products ya existe"
    else
        echo "Creando tabla YaNomas-Products..."
        aws dynamodb create-table \
            --table-name YaNomas-Products \
            --attribute-definitions \
                AttributeName=id,AttributeType=S \
                AttributeName=sellerId,AttributeType=S \
                AttributeName=createdAt,AttributeType=S \
            --key-schema AttributeName=id,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region us-east-1
        success "Tabla YaNomas-Products creada"
        sleep 5
    fi
    
    echo ""
    echo "Verificando tabla YaNomas-Services..."
    if aws dynamodb describe-table --table-name YaNomas-Services 2>/dev/null; then
        echo "Tabla YaNomas-Services ya existe"
    else
        echo "Creando tabla YaNomas-Services..."
        aws dynamodb create-table \
            --table-name YaNomas-Services \
            --attribute-definitions \
                AttributeName=id,AttributeType=S \
                AttributeName=providerId,AttributeType=S \
                AttributeName=createdAt,AttributeType=S \
            --key-schema AttributeName=id,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region us-east-1
        success "Tabla YaNomas-Services creada"
        sleep 5
    fi
    
    success "Tablas DynamoDB listas"
}

# Crear bucket S3
create_s3() {
    section "Creando bucket S3..."
    
    source .env.local
    
    if aws s3 ls "s3://$VITE_S3_BUCKET" 2>/dev/null; then
        echo "Bucket $VITE_S3_BUCKET ya existe"
    else
        echo "Creando bucket $VITE_S3_BUCKET..."
        aws s3 mb "s3://$VITE_S3_BUCKET" --region us-east-1
        success "Bucket creado"
        
        # Configurar CORS
        echo "Configurando CORS..."
        cat > /tmp/cors.json << 'CORS_EOF'
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["x-amz-version-id"],
      "MaxAgeSeconds": 3000
    }
  ]
}
CORS_EOF
        
        aws s3api put-bucket-cors \
            --bucket "$VITE_S3_BUCKET" \
            --cors-configuration file:///tmp/cors.json
        success "CORS configurado"
        
        # Hacer público
        echo "Haciendo bucket público..."
        aws s3api put-bucket-policy \
            --bucket "$VITE_S3_BUCKET" \
            --policy '{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicRead",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::'"$VITE_S3_BUCKET"'/*"
                    }
                ]
            }'
        success "Bucket público"
    fi
    
    success "S3 listo"
}

# Listar recursos AWS
list_resources() {
    section "Recursos AWS..."
    
    echo "📊 Tablas DynamoDB:"
    aws dynamodb list-tables --region us-east-1 --query 'TableNames' --output text || echo "Ninguna"
    
    echo ""
    echo "🪣 Buckets S3:"
    aws s3 ls --output text | awk '{print $3}' | grep yanomas || echo "Ninguno"
    
    echo ""
    echo "⚡ Funciones Lambda:"
    aws lambda list-functions --region us-east-1 --query 'Functions[?starts_with(FunctionName, `yanomas`)].FunctionName' --output text || echo "Ninguna"
    
    echo ""
    echo "🌐 APIs Gateway:"
    aws apigateway get-rest-apis --region us-east-1 --query 'items[?name==`YaNomas-Marketplace-API`].id' --output text || echo "Ninguno"
}

# Ver logs Lambda
view_logs() {
    section "Últimos logs Lambda..."
    
    read -p "Nombre de la función (ej: yanomas-products-get-all): " function_name
    
    if [ -z "$function_name" ]; then
        error "Nombre de función requerido"
    fi
    
    echo "Últimos 50 logs de: $function_name"
    aws logs tail "/aws/lambda/$function_name" --follow --since 1h || echo "No hay logs"
}

# Compilar funciones Lambda
compile_lambda() {
    section "Compilando funciones Lambda..."
    
    if [ ! -d aws-lambda ]; then
        error "Directorio aws-lambda no encontrado"
    fi
    
    echo "Compilando TypeScript..."
    npx tsc aws-lambda/*.ts --outDir aws-lambda/dist --target ES2020 --module commonjs
    success "Compilación completada"
    
    echo ""
    echo "Archivos compilados en aws-lambda/dist/"
    ls -la aws-lambda/dist/
}

# Menú principal
while true; do
    show_menu
    read -p "Opción: " option
    
    case $option in
        1) check_dependencies ;;
        2) create_env ;;
        3) validate_env ;;
        4) create_dynamodb ;;
        5) create_s3 ;;
        6) list_resources ;;
        7) view_logs ;;
        8) compile_lambda ;;
        9) echo "Adiós"; exit 0 ;;
        *) error "Opción no válida" ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done

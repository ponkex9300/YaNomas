#!/bin/bash
# Configure API Gateway with Lambda integrations

API_ID="t892o5txb3"
REGION="us-east-1"
PROFILE="sanunez"
ROLE_ARN="arn:aws:iam::814421265654:role/lambda-dynamodb-s3-role"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --profile $PROFILE --region $REGION --query 'items[0].id' --output text)

# Create /products resource
PRODUCTS_ID=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part products --profile $PROFILE --region $REGION --query 'id' --output text)

# Create /products/{id} resource
PRODUCTS_ID_PARAM=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $PRODUCTS_ID --path-part '{id}' --profile $PROFILE --region $REGION --query 'id' --output text)

# Create /services resource
SERVICES_ID=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part services --profile $PROFILE --region $REGION --query 'id' --output text)

# Create /services/{id} resource
SERVICES_ID_PARAM=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $SERVICES_ID --path-part '{id}' --profile $PROFILE --region $REGION --query 'id' --output text)

echo "API Gateway Configuration:"
echo "API ID: $API_ID"
echo "Root ID: $ROOT_ID"
echo "/products ID: $PRODUCTS_ID"
echo "/products/{id} ID: $PRODUCTS_ID_PARAM"
echo "/services ID: $SERVICES_ID"
echo "/services/{id} ID: $SERVICES_ID_PARAM"

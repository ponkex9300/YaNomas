# Configure API Gateway with Lambda integrations
$ApiId = "t892o5txb3"
$Region = "us-east-1"
$Profile = "sanunez"

Write-Host "Configuring API Gateway..."

# Get root resource ID
$RootId = aws apigateway get-resources --rest-api-id $ApiId --profile $Profile --region $Region --query 'items[0].id' --output text

# Create /products resource
$ProductsId = aws apigateway create-resource --rest-api-id $ApiId --parent-id $RootId --path-part products --profile $Profile --region $Region --query 'id' --output text
Write-Host "Created /products resource: $ProductsId"

# Create /products/{id} resource
$ProductsIdParam = aws apigateway create-resource --rest-api-id $ApiId --parent-id $ProductsId --path-part '{id}' --profile $Profile --region $Region --query 'id' --output text
Write-Host "Created /products/{id} resource: $ProductsIdParam"

# Create /services resource
$ServicesId = aws apigateway create-resource --rest-api-id $ApiId --parent-id $RootId --path-part services --profile $Profile --region $Region --query 'id' --output text
Write-Host "Created /services resource: $ServicesId"

# Create /services/{id} resource
$ServicesIdParam = aws apigateway create-resource --rest-api-id $ApiId --parent-id $ServicesId --path-part '{id}' --profile $Profile --region $Region --query 'id' --output text
Write-Host "Created /services/{id} resource: $ServicesIdParam"

# Save resource IDs to file for later use
@{
    ApiId = $ApiId
    RootId = $RootId
    ProductsId = $ProductsId
    ProductsIdParam = $ProductsIdParam
    ServicesId = $ServicesId
    ServicesIdParam = $ServicesIdParam
} | ConvertTo-Json | Set-Content "api-gateway-resources.json"

Write-Host "Resource IDs saved to api-gateway-resources.json"

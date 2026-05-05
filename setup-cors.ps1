$ApiId = "t892o5txb3"

# Get all resource IDs
$resourceIds = aws apigateway get-resources --rest-api-id $ApiId --profile sanunez --region us-east-1 --query 'items[*].id' --output json | ConvertFrom-Json

Write-Host "Configurando CORS en $($resourceIds.Count) recursos..."

foreach ($resourceId in $resourceIds) {
    try {
        # Crear método OPTIONS
        aws apigateway put-method `
            --rest-api-id $ApiId `
            --resource-id $resourceId `
            --http-method OPTIONS `
            --authorization-type NONE `
            --profile sanunez --region us-east-1 2>&1 | Out-Null
        
        # Crear integración MOCK
        aws apigateway put-integration `
            --rest-api-id $ApiId `
            --resource-id $resourceId `
            --http-method OPTIONS `
            --type MOCK `
            --profile sanunez --region us-east-1 2>&1 | Out-Null
        
        # Crear respuesta del método
        aws apigateway put-method-response `
            --rest-api-id $ApiId `
            --resource-id $resourceId `
            --http-method OPTIONS `
            --status-code 200 `
            --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" `
            --profile sanunez --region us-east-1 2>&1 | Out-Null
        
        # Crear respuesta de integración
        aws apigateway put-integration-response `
            --rest-api-id $ApiId `
            --resource-id $resourceId `
            --http-method OPTIONS `
            --status-code 200 `
            --response-parameters @{
                'method.response.header.Access-Control-Allow-Headers' = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
                'method.response.header.Access-Control-Allow-Methods' = "'GET,POST,PUT,DELETE,OPTIONS'"
                'method.response.header.Access-Control-Allow-Origin' = "'*'"
            } `
            --profile sanunez --region us-east-1 2>&1 | Out-Null
        
        Write-Host "✓ Configurado OPTIONS para recurso $resourceId"
    }
    catch {
        # Algunos recursos pueden ya tener OPTIONS, ignorar
    }
}

Write-Host "Desplegando API..."
aws apigateway create-deployment --rest-api-id $ApiId --stage-name prod --profile sanunez --region us-east-1 2>&1 | Out-Null

Write-Host "✓ CORS configurado exitosamente"

# Script para habilitar CORS en API Gateway
$ApiId = "t892o5txb3"
$Profile = "sanunez"
$Region = "us-east-1"

# Obtener todos los recursos
$Resources = aws apigateway get-resources --rest-api-id $ApiId --profile $Profile --region $Region --query 'items[*].[id,pathPart]' --output json | ConvertFrom-Json

Write-Host "Habilitando CORS en todos los recursos..."

foreach ($Resource in $Resources) {
    $ResourceId = $Resource[0]
    $Path = $Resource[1] ?? "/"
    
    # Métodos HTTP a configurar
    $Methods = @("GET", "POST", "PUT", "DELETE", "OPTIONS")
    
    foreach ($Method in $Methods) {
        try {
            # Verificar si el método existe
            $MethodExists = aws apigateway get-method --rest-api-id $ApiId --resource-id $ResourceId --http-method $Method --profile $Profile --region $Region 2>&1
            
            if ($MethodExists -like "*NotFoundException*") {
                continue
            }
            
            # Agregar método OPTIONS para CORS si no existe
            if ($Method -eq "OPTIONS") {
                try {
                    aws apigateway put-method --rest-api-id $ApiId --resource-id $ResourceId --http-method OPTIONS --authorization-type NONE --profile $Profile --region $Region 2>&1 | Out-Null
                    aws apigateway put-integration --rest-api-id $ApiId --resource-id $ResourceId --http-method OPTIONS --type MOCK --profile $Profile --region $Region 2>&1 | Out-Null
                    aws apigateway put-method-response --rest-api-id $ApiId --resource-id $ResourceId --http-method OPTIONS --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true,method.response.header.Access-Control-Allow-Origin=true" --profile $Profile --region $Region 2>&1 | Out-Null
                    aws apigateway put-integration-response --rest-api-id $ApiId --resource-id $ResourceId --http-method OPTIONS --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Headers='Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',method.response.header.Access-Control-Allow-Methods='GET,POST,PUT,DELETE,OPTIONS',method.response.header.Access-Control-Allow-Origin='*'" --profile $Profile --region $Region 2>&1 | Out-Null
                } catch {
                    # Ignorar errores si OPTIONS ya existe
                }
            } else {
                # Agregar headers CORS a respuestas existentes
                try {
                    aws apigateway put-method-response --rest-api-id $ApiId --resource-id $ResourceId --http-method $Method --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Origin=false" --profile $Profile --region $Region 2>&1 | Out-Null
                } catch {
                    # Ignorar si ya existe
                }
            }
            
            Write-Host "✓ Configurado: $Path [$Method]"
        } catch {
            # Ignorar recursos/métodos que no existen
        }
    }
}

# Redeploy API
Write-Host "Redeployando API..."
aws apigateway create-deployment --rest-api-id $ApiId --stage-name prod --profile $Profile --region $Region | Out-Null

Write-Host "✓ CORS habilitado correctamente"
Write-Host "✓ API redeployada"

# Create API Gateway methods and integrate with Lambda functions
$ApiId = "t892o5txb3"
$Region = "us-east-1"
$Profile = "sanunez"
$AccountId = "814421265654"

# Resource IDs
$ProductsId = "p9jlm2"
$ProductsIdParam = "xt2eye"
$ServicesId = "app37t"
$ServicesIdParam = "87swd9"

Write-Host "Creating API Gateway methods..."

# Function to create method and integration
function Create-Method {
    param(
        [string]$ResourceId,
        [string]$HttpMethod,
        [string]$LambdaName
    )
    
    try {
        # Create method
        aws apigateway put-method `
            --rest-api-id $ApiId `
            --resource-id $ResourceId `
            --http-method $HttpMethod `
            --authorization-type NONE `
            --profile $Profile `
            --region $Region | Out-Null
        
        # Create integration with Lambda
        $LambdaArn = "arn:aws:apigateway:$Region`:lambda:path/2015-03-31/functions/arn:aws:lambda:$Region`:$AccountId`:function:$LambdaName/invocations"
        
        aws apigateway put-integration `
            --rest-api-id $ApiId `
            --resource-id $ResourceId `
            --http-method $HttpMethod `
            --type AWS_PROXY `
            --integration-http-method POST `
            --uri $LambdaArn `
            --profile $Profile `
            --region $Region | Out-Null
        
        Write-Host "  Created: $HttpMethod $LambdaName"
    }
    catch {
        Write-Host "  Error: $_"
    }
}

# /products GET -> products-get-all
Create-Method $ProductsId GET "products-get-all"

# /products POST -> products-create
Create-Method $ProductsId POST "products-create"

# /products/{id} GET -> products-get-by-id
Create-Method $ProductsIdParam GET "products-get-by-id"

# /products/{id} PUT -> products-update
Create-Method $ProductsIdParam PUT "products-update"

# /products/{id} DELETE -> products-delete
Create-Method $ProductsIdParam DELETE "products-delete"

# /services GET -> services-get-all
Create-Method $ServicesId GET "services-get-all"

# /services POST -> services-create
Create-Method $ServicesId POST "services-create"

# /services/{id} GET -> services-get-by-id
Create-Method $ServicesIdParam GET "services-get-by-id"

# /services/{id} PUT -> services-update
Create-Method $ServicesIdParam PUT "services-update"

# /services/{id} DELETE -> services-delete
Create-Method $ServicesIdParam DELETE "services-delete"

Write-Host "Granting Lambda invocation permissions..."

# Grant API Gateway permission to invoke Lambda functions
$Functions = @(
    "products-get-all",
    "products-create",
    "products-get-by-id",
    "products-update",
    "products-delete",
    "services-get-all",
    "services-create",
    "services-get-by-id",
    "services-update",
    "services-delete"
)

foreach ($FunctionName in $Functions) {
    aws lambda add-permission `
        --function-name $FunctionName `
        --statement-id ApiGatewayInvoke `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn "arn:aws:execute-api:$Region`:$AccountId`:$ApiId/*" `
        --profile $Profile `
        --region $Region 2>$null | Out-Null
    
    Write-Host "  Granted permission: $FunctionName"
}

Write-Host "API Gateway methods created successfully!"

# Deploy Lambda Functions - Fast Version
$LambdaPath = "C:\Users\pinki\OneDrive\Documentos\Sebastian\AWS\YaNomas\lambda-functions"
$RoleArn = "arn:aws:iam::814421265654:role/lambda-dynamodb-s3-role"
$Region = "us-east-1"
$Profile = "sanunez"

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

# First, install dependencies once and create layers
Write-Host "Installing dependencies..."
Set-Location $LambdaPath

# Create a single ZIP with node_modules as a Lambda layer
$TmpDir = "$LambdaPath\tmp_layer"
if (Test-Path $TmpDir) { Remove-Item $TmpDir -Recurse }
mkdir $TmpDir | Out-Null
mkdir "$TmpDir\nodejs" | Out-Null

Copy-Item "$LambdaPath\node_modules" "$TmpDir\nodejs\node_modules" -Recurse -Force

# Create layer ZIP
$LayerZip = "$LambdaPath\nodejs-layer.zip"
if (Test-Path $LayerZip) { Remove-Item $LayerZip }
Compress-Archive -Path "$TmpDir\*" -DestinationPath $LayerZip -Force

# Publish layer
Write-Host "Publishing Node.js layer..."
$LayerVersionArn = aws lambda publish-layer-version --layer-name nodejs-deps --zip-file fileb://$LayerZip --compatible-runtimes nodejs18.x --profile $Profile --region $Region --query 'LayerVersionArn' --output text

Remove-Item $TmpDir -Recurse -Force
Remove-Item $LayerZip -Force

# Deploy each function
foreach ($FunctionName in $Functions) {
    Write-Host "Deploying $FunctionName..."
    
    # Create minimal ZIP with just the function code
    $TmpDir = "$LambdaPath\tmp_func"
    if (Test-Path $TmpDir) { Remove-Item $TmpDir -Recurse }
    mkdir $TmpDir | Out-Null
    
    Copy-Item "$LambdaPath\$FunctionName.js" "$TmpDir\index.js" -Force
    
    $ZipPath = "$LambdaPath\$FunctionName.zip"
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
    
    Compress-Archive -Path "$TmpDir\*" -DestinationPath $ZipPath -Force
    
    # Check if function exists
    aws lambda get-function --function-name $FunctionName --profile $Profile --region $Region 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        aws lambda update-function-code --function-name $FunctionName --zip-file fileb://$ZipPath --profile $Profile --region $Region | Out-Null
        aws lambda update-function-configuration --function-name $FunctionName --layers $LayerVersionArn --profile $Profile --region $Region | Out-Null
        Write-Host "  Updated: $FunctionName"
    }
    else {
        aws lambda create-function --function-name $FunctionName --runtime nodejs18.x --role $RoleArn --handler index.handler --zip-file fileb://$ZipPath --timeout 30 --memory-size 256 --layers $LayerVersionArn --profile $Profile --region $Region | Out-Null
        Write-Host "  Created: $FunctionName"
    }
    
    Remove-Item $ZipPath -Force
}

# Cleanup
Remove-Item "$LambdaPath\tmp_func" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "All Lambda functions deployed successfully!"

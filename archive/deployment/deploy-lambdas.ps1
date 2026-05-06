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

Write-Host "Installing dependencies..."
Set-Location $LambdaPath
npm install --loglevel=error

$TempDir = "$LambdaPath\build"
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory $TempDir | Out-Null

Copy-Item "$LambdaPath\node_modules" "$TempDir\node_modules" -Recurse

foreach ($FunctionName in $Functions) {
    Write-Host "Deploying $FunctionName..."
    
    Copy-Item "$LambdaPath\$FunctionName.js" "$TempDir\index.js" -Force
    
    $ZipPath = "$LambdaPath\$FunctionName.zip"
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
    
    Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force
    
    aws lambda get-function --function-name $FunctionName --profile $Profile --region $Region 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        aws lambda update-function-code --function-name $FunctionName --zip-file fileb://$ZipPath --profile $Profile --region $Region | Out-Null
        Write-Host "  Updated: $FunctionName"
    }
    else {
        aws lambda create-function --function-name $FunctionName --runtime nodejs18.x --role $RoleArn --handler index.handler --zip-file fileb://$ZipPath --timeout 30 --memory-size 256 --profile $Profile --region $Region | Out-Null
        Write-Host "  Created: $FunctionName"
    }
}

Remove-Item $TempDir -Recurse -Force
Get-Item "$LambdaPath\*.zip" -ErrorAction SilentlyContinue | Remove-Item

Write-Host "Done!"

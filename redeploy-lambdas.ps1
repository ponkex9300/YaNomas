$LambdaPath = "C:\Users\pinki\OneDrive\Documentos\Sebastian\AWS\YaNomas\lambda-functions"
$Profile = "sanunez"
$Region = "us-east-1"

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

cd $LambdaPath

Write-Host "Redeploying Lambda functions with correct structure..."

foreach ($FunctionName in $Functions) {
    # Create temporary directory
    $TmpDir = "$LambdaPath\tmp_$FunctionName"
    if (Test-Path $TmpDir) { Remove-Item $TmpDir -Recurse }
    mkdir $TmpDir | Out-Null
    
    # Copy function file as index.js
    Copy-Item "$FunctionName.js" "$TmpDir\index.js" -Force
    
    # Create ZIP
    $ZipPath = "$LambdaPath\$FunctionName.zip"
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
    Compress-Archive -Path "$TmpDir\*" -DestinationPath $ZipPath -Force
    
    # Update Lambda with new ZIP
    aws lambda update-function-code --function-name $FunctionName --zip-file fileb://$ZipPath --profile $Profile --region $Region | Out-Null
    
    # Cleanup
    Remove-Item $TmpDir -Recurse
    Remove-Item $ZipPath
    
    Write-Host "✅ Redeployed: $FunctionName"
}

Write-Host "Done!"

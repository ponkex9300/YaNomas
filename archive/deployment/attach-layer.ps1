$LayerArn = "arn:aws:lambda:us-east-1:814421265654:layer:nodejs-deps:2"
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

Write-Host "Attaching Lambda Layer to all functions..."

foreach ($FunctionName in $Functions) {
    aws lambda update-function-configuration --function-name $FunctionName --layers $LayerArn --profile $Profile --region $Region | Out-Null
    Write-Host "✅ Layer attached to: $FunctionName"
}

Write-Host "Done!"

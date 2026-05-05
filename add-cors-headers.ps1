# Script para agregar CORS headers a todas las funciones Lambda

$LambdaDir = "C:\Users\pinki\OneDrive\Documentos\Sebastian\AWS\YaNomas\lambda-functions"
$corsHeaders = @"
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
"@

$functions = @(
  'products-get-all.js',
  'products-create.js',
  'products-get-by-id.js',
  'products-update.js',
  'products-delete.js',
  'services-get-all.js',
  'services-create.js',
  'services-get-by-id.js',
  'services-update.js',
  'services-delete.js'
)

Write-Host "Actualizando funciones Lambda con headers CORS..."

foreach ($func in $functions) {
  $filePath = Join-Path $LambdaDir $func
  
  if (Test-Path $filePath) {
    $content = Get-Content $filePath -Raw
    
    # Reemplazar headers en respuestas exitosas
    $content = $content -replace `
      "headers: \{\s*'Content-Type': 'application/json'\s*\}", `
      "headers: {
        'Content-Type': 'application/json',$corsHeaders
      }"
    
    # Reemplazar headers en respuestas de error
    $content = $content -replace `
      "statusCode: 500,", `
      "statusCode: 500,
      headers: {
        'Content-Type': 'application/json',$corsHeaders
      },"
    
    # Escribir archivo actualizado
    Set-Content $filePath $content
    Write-Host "✓ Actualizado: $func"
  }
}

Write-Host "Comprimiendo y desplegando funciones..."

# Desplegar cada función
foreach ($func in $functions) {
  $baseName = $func -replace '\.js$', ''
  Push-Location $LambdaDir
  
  Compress-Archive -Path $func -DestinationPath "$baseName.zip" -Force -ErrorAction SilentlyContinue
  
  aws lambda update-function-code `
    --function-name $baseName `
    --zip-file fileb://$baseName.zip `
    --profile sanunez `
    --region us-east-1 | Out-Null
  
  Remove-Item "$baseName.zip" -Force -ErrorAction SilentlyContinue
  Pop-Location
  
  Write-Host "✓ Desplegado: $baseName"
}

Write-Host "✓ Todas las funciones Lambda actualizadas"

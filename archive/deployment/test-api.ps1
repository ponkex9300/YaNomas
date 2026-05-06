# Test API Gateway endpoints
$ApiUrl = "https://t892o5txb3.execute-api.us-east-1.amazonaws.com/prod"

Write-Host "Testing YaNomas Marketplace API..."
Write-Host "API URL: $ApiUrl"
Write-Host ""

# Test 1: Get all products
Write-Host "1. GET /products"
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/products" -Method GET
    Write-Host "   Status: OK ($(($response.data | Measure-Object).Count) products)" -ForegroundColor Green
}
catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get all services
Write-Host "2. GET /services"
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/services" -Method GET
    Write-Host "   Status: OK ($(($response.data | Measure-Object).Count) services)" -ForegroundColor Green
}
catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Create a product
Write-Host "3. POST /products"
try {
    $product = @{
        title = "Test Product"
        description = "A test product for YaNomas"
        price = 99.99
        category = "Electronics"
        sellerId = "seller-123"
        imageUrl = "https://via.placeholder.com/300"
    }
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/products" -Method POST -ContentType "application/json" -Body ($product | ConvertTo-Json)
    Write-Host "   Status: OK - Product created with ID: $($response.data.id)" -ForegroundColor Green
    
    # Save product ID for next test
    $productId = $response.data.id
}
catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get specific product
if ($productId) {
    Write-Host "4. GET /products/{id}"
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/products/$productId" -Method GET
        Write-Host "   Status: OK - Retrieved: $($response.data.title)" -ForegroundColor Green
    }
    catch {
        Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Update product
if ($productId) {
    Write-Host "5. PUT /products/{id}"
    try {
        $update = @{
            price = 149.99
            description = "Updated description"
        }
        
        $response = Invoke-RestMethod -Uri "$ApiUrl/products/$productId" -Method PUT -ContentType "application/json" -Body ($update | ConvertTo-Json)
        Write-Host "   Status: OK - Updated price to: `$$($response.data.price)" -ForegroundColor Green
    }
    catch {
        Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Create a service
Write-Host "6. POST /services"
try {
    $service = @{
        title = "Test Service"
        description = "A test service for YaNomas"
        price = 199.99
        category = "Consulting"
        providerId = "provider-456"
        imageUrl = "https://via.placeholder.com/300"
    }
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/services" -Method POST -ContentType "application/json" -Body ($service | ConvertTo-Json)
    Write-Host "   Status: OK - Service created with ID: $($response.data.id)" -ForegroundColor Green
    
    # Save service ID for next test
    $serviceId = $response.data.id
}
catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Delete product
if ($productId) {
    Write-Host "7. DELETE /products/{id}"
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/products/$productId" -Method DELETE
        Write-Host "   Status: OK - Product deleted" -ForegroundColor Green
    }
    catch {
        Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 8: Delete service
if ($serviceId) {
    Write-Host "8. DELETE /services/{id}"
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/services/$serviceId" -Method DELETE
        Write-Host "   Status: OK - Service deleted" -ForegroundColor Green
    }
    catch {
        Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "API Testing Complete!" -ForegroundColor Yellow

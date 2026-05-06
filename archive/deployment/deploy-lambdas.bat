@echo off
REM Deploy Lambda Functions - Simple CLI Version
setlocal enabledelayedexpansion

set LambdaPath=C:\Users\pinki\OneDrive\Documentos\Sebastian\AWS\YaNomas\lambda-functions
set RoleArn=arn:aws:iam::814421265654:role/lambda-dynamodb-s3-role
set Region=us-east-1
set Profile=sanunez

cd /d %LambdaPath%

REM Check which functions already exist
for %%F in (products-get-all products-create products-get-by-id products-update products-delete services-get-all services-create services-get-by-id services-update services-delete) do (
    aws lambda get-function --function-name %%F --profile %Profile% --region %Region% >nul 2>&1
    if errorlevel 1 (
        echo Creating %%F...
        REM Create simple ZIP with just the function
        powershell -Command "Compress-Archive -Path '%%F.js' -DestinationPath '%%F.zip' -Force"
        aws lambda create-function --function-name %%F --runtime nodejs18.x --role %RoleArn% --handler index.handler --zip-file fileb://%%F.zip --timeout 30 --memory-size 256 --profile %Profile% --region %Region% >nul 2>&1
        echo  Created: %%F
        del %%F.zip
    ) else (
        echo %%F already exists
    )
)

echo Done!

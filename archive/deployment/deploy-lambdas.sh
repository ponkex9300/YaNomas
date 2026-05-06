#!/bin/bash
# Deploy remaining Lambda functions

LambdaPath="/mnt/c/Users/pinki/OneDrive/Documentos/Sebastian/AWS/YaNomas/lambda-functions"
RoleArn="arn:aws:iam::814421265654:role/lambda-dynamodb-s3-role"
Region="us-east-1"
Profile="sanunez"

cd "$LambdaPath"

Functions=(
    "products-update"
    "products-delete"
    "services-get-all"
    "services-create"
    "services-get-by-id"
    "services-update"
    "services-delete"
)

for FunctionName in "${Functions[@]}"
do
    echo "Deploying $FunctionName..."
    
    # Create minimal ZIP with only the function file
    mkdir -p tmp
    cp "$FunctionName.js" "tmp/index.js"
    cd tmp
    zip -q -r "../$FunctionName.zip" .
    cd ..
    rm -rf tmp
    
    # Check if function exists
    if aws lambda get-function --function-name $FunctionName --profile $Profile --region $Region &>/dev/null; then
        aws lambda update-function-code --function-name $FunctionName --zip-file fileb://$FunctionName.zip --profile $Profile --region $Region > /dev/null
        echo "  Updated: $FunctionName"
    else
        aws lambda create-function --function-name $FunctionName --runtime nodejs18.x --role $RoleArn --handler index.handler --zip-file fileb://$FunctionName.zip --timeout 30 --memory-size 256 --profile $Profile --region $Region > /dev/null
        echo "  Created: $FunctionName"
    fi
done

echo "Done!"

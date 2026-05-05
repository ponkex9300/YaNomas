const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'YaNomas-Services';

exports.handler = async (event) => {
  try {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing service ID' })
      };
    }

    const updateExpression = [];
    const expressionAttributeValues = {};
    let attributeCounter = 0;

    for (const [key, value] of Object.entries(body)) {
      if (key !== 'id' && key !== 'createdAt') {
        updateExpression.push(`${key} = :val${attributeCounter}`);
        expressionAttributeValues[`:val${attributeCounter}`] = value;
        attributeCounter++;
      }
    }

    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    updateExpression.push('updatedAt = :updatedAt');

    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET ' + updateExpression.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result.Attributes
      }),
      headers: {
        'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

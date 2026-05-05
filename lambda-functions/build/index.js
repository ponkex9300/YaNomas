const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'YaNomas-Products';

exports.handler = async (event) => {
  try {
    const id = event.pathParameters.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing product ID' })
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'Product not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result.Item
      }),
      headers: {
        'Content-Type': 'application/json'
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

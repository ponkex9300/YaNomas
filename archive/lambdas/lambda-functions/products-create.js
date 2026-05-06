const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'YaNomas-Products';

// Generate unique ID without uuid dependency
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { title, description, price, category, sellerId, imageUrl } = body;

    if (!title || !sellerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing required fields' })
      };
    }

    const id = generateId();
    const createdAt = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Item: {
        id,
        title,
        description: description || '',
        price: parseFloat(price),
        category: category || '',
        sellerId,
        imageUrl: imageUrl || '',
        createdAt,
        updatedAt: createdAt
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        data: params.Item
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

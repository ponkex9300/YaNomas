const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'YaNomas-Services';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
  'Content-Type': 'application/json'
};

// Generate unique ID without uuid dependency
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    const body = JSON.parse(event.body);
    const { title, description, price, category, providerId, imageUrl } = body;

    if (!title || !providerId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
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
        providerId,
        imageUrl: imageUrl || '',
        createdAt,
        updatedAt: createdAt
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: params.Item
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

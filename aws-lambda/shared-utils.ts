const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
};

export function createSuccessResponse(body: any, statusCode = 200) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ success: true, data: body }),
  };
}

export function createErrorResponse(message: string, statusCode = 500) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ success: false, error: message }),
  };
}

export function createOptionsResponse() {
  return {
    statusCode: 204,
    headers: corsHeaders,
    body: '',
  };
}

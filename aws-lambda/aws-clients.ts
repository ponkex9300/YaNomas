import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'us-east-1';

export const s3Client = new S3Client({ region: REGION });
export { PutObjectCommand };

const ddb = new DynamoDBClient({ region: REGION });
export const dynamoDocumentClient = DynamoDBDocumentClient.from(ddb);

// Re-export commonly used commands for convenience
export { ScanCommand } from '@aws-sdk/client-dynamodb';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';

export const dynamoDocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region })
);

export const s3Client = new S3Client({ region });

export {
  DeleteCommand,
  GetCommand,
  PutCommand,
  PutObjectCommand,
  ScanCommand,
  UpdateCommand,
  DeleteObjectCommand,
};
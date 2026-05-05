declare module 'aws-sdk' {
  export namespace DynamoDB {
    class DocumentClient {
      get(params: any): { promise(): Promise<any> };
      scan(params: any): { promise(): Promise<any> };
      put(params: any): { promise(): Promise<any> };
      update(params: any): { promise(): Promise<any> };
      delete(params: any): { promise(): Promise<any> };
    }
  }

  export class DynamoDB {
    DocumentClient: typeof DynamoDB.DocumentClient;
  }

  export class S3 {
    putObject(params: any): { promise(): Promise<any> };
    deleteObject(params: any): { promise(): Promise<any> };
  }
}
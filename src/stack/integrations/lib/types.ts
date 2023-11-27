import { RecordMetadata } from '@pinecone-database/pinecone';

export interface Message {
  role: string;
  content: string;
}

export interface BoilerplateMetadata extends RecordMetadata {
  inputJSON: string;
  outputJSON: string;
  brief: string;
  count: number;
  type: 'boilerplate';
  integration: string;
  skeleton: string;
  skeletonType: 'inline-typed';
  functionString: string;
  methodName: string;
  functionId: string;
  createdAt: string;
}

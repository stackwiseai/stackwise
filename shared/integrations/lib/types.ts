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
  type: string;
  integration: string;
  skeleton: string;
  skeletonType?: 'inline-typed';
  functionString: string;
  methodName: string;
  id: string;
  createdAt: string;
  component?: string;
  // retrievedAt: string[];
  // retrievedFor: string[];
}

export interface DocumentationMetadata extends RecordMetadata {
  id: string; // URL of the documentation
  content: string; // content from the embedding
  count: number; // number of times documentation used
  type: 'documentation';
  integration: string;
  createdAt: string;
  // retrievedAt: string[]; // array of dates
  // retrievedFor: string[]; // array of hashes
}

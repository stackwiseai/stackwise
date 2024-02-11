export interface StackItem {
  type: string;
  description: string;
  variables?: string[];
}

export interface Stack {
  created: number;
  updated: number;
  name: string;
  description: string;
  trigger: {
    type: string;
  };
  stack: StackItem[];
  variables: Record<string, string>;
}

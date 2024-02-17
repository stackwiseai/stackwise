export interface StackItem {
  type: string;
  description: string;
  variables?: string[];
  instructions?: string;
}

export interface Stack {
  created: number;
  updated: number;
  name: string;
  description: string;
  example_input: any;
  trigger: {
    type: string;
  };
  stack: StackItem[];
  variables: Record<string, string>;
}

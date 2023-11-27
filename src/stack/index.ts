class Stack<I, O> {
    private input: I;
    private outExample: O;

    constructor(private requirements: any, private config: { input: I, outExample: O }) {
        this.requirements = requirements;
        this.input = config.input;
        this.outExample = config.outExample;
    }

    async run(): Promise<O> {
        return this.outExample;
    }
}

export default async function stack<I, O>(
    requirements: any,
    config: { input: I, outExample: O },
): Promise<O> {
    const stackwiseInstance = new Stack<I, O>(requirements, config);
    return stackwiseInstance.run();
}
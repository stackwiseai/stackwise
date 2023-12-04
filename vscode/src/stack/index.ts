class Stack<I, O> {
    private input: I;
    private out: O;

    constructor(private requirements: any, private config: { input: I, out: O }) {
        this.requirements = requirements;
        this.input = config.input;
        this.out = config.out;
    }

    async run(): Promise<O> {
        return this.out;
    }
}

export default async function stack<I, O>(
    requirements: any,
    config: { input: I, out: O },
): Promise<O> {
    const stackwiseInstance = new Stack<I, O>(requirements, config);
    return stackwiseInstance.run();
}
import { evaluate } from 'ts-evaluator';
import ts from 'typescript';

export default function evaluateTypeScript(code: string): any {
    // try {
    //     // Use the evaluate function from ts-evaluator
    //     return evaluate({
    //         code,
    //         transpileOptions: {
    //             compilerOptions: {
    //                 // You can set TypeScript compiler options here
    //                 module: ts.ModuleKind.CommonJS,
    //                 target: ts.ScriptTarget.ESNext,
    //             },
    //         },
    //     });
    // } catch (error) {
    //     console.error(`Error evaluating TypeScript code: ${error}`);
    //     return null;
    // }
}

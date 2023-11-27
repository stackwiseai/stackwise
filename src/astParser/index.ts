import * as ts from 'typescript';
import { Project, TypeChecker, SyntaxKind } from 'ts-morph';
import * as fs from 'fs';


export default function astParser(filePath: string){




// export default function astParser(filePath: string): any[] {
//     const typescriptCode = fs.readFileSync(filePath, 'utf8');
//     const project = new Project({
//         compilerOptions: {
//             target: ts.ScriptTarget.ES5,
//             module: ts.ModuleKind.CommonJS
//         }
//     });

//     const sourceFile = project.createSourceFile('tempFile.ts', typescriptCode);
//     let argumentsArray = [];

//     const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
//     callExpressions.forEach(callExpr => {
//         const expression = callExpr.getExpression();
//         if (expression.getText() === 'stack') {
//             callExpr.getArguments().forEach((arg, index) => {
//                 if (index === 1 && arg.getKind() === SyntaxKind.ObjectLiteralExpression) {
//                     const objectLiteral = arg.asKind(SyntaxKind.ObjectLiteralExpression);
//                     if (objectLiteral) {
//                         argumentsArray.push(convertObjectLiteralToObject(objectLiteral));
//                     }
//                 } else {
//                     argumentsArray.push(arg.getLiteralText());
//                 }
//             });
//         }
//     });

//     return argumentsArray;
// }

// function convertObjectLiteralToObject(objectLiteral) {
//     const obj = {};
//     objectLiteral.getProperties().forEach(prop => {
//         if (prop.getKind() === SyntaxKind.PropertyAssignment) {
//             const propertyAssignment = prop.asKind(SyntaxKind.PropertyAssignment);
//             if (propertyAssignment) {
//                 const key = propertyAssignment.getName();
//                 const value = propertyAssignment.getInitializer().getLiteralText();
//                 obj[key] = value;
//             }
//         }
//     });
//     return obj;
}
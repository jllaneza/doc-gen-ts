import * as ts from 'typescript';

import {
  hasDecorator,
  getName,
  getFilesFromFolder,
  deleteSyncRecursive,
  writeFileSyncRecursive } from './utils';

export enum DocType {
  Class = 1,
  Property,
  Method
}

export enum DocDecorator {
  Class = 'Component',
  Property = 'Input',
  Method = 'Output'
}

export interface DocEntry {
  name?: string;
  description?: string;
  type?: string;
  docType?: DocType;
  args?: any[];
}

export const generateDocumentation = (
  folderDir: string,
  options: ts.CompilerOptions
): void => {
  const visit = (node: ts.Node) => {
    let symbol: ts.Symbol;
    switch (node.kind) {
      case ts.SyntaxKind.ClassDeclaration:
        if (!hasDecorator(DocDecorator.Class, node)) return;
        symbol = checker.getSymbolAtLocation((<ts.ClassDeclaration>node).name);
        if (symbol) {
          output.push(serializeSymbol(symbol, node, DocType.Class));
        }
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        let docType: DocType;
        if (hasDecorator(DocDecorator.Property, node)) docType = DocType.Property;
        if (hasDecorator(DocDecorator.Method, node)) docType = DocType.Method;
        if (!docType) return;

        symbol = checker.getSymbolAtLocation((<ts.PropertyDeclaration>node).name);
        if (symbol) {
          output.push(serializeSymbol(symbol, node, docType));
        }
        break;
    }
    ts.forEachChild(node, visit);
  };
  const serializeSymbol = (symbol: ts.Symbol, node: ts.Node, docType: DocType): DocEntry => {
    return {
      name: getName(symbol, node, docType),
      description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      ),
      docType
    };
  };

  let files: string[] = getFilesFromFolder(folderDir);
  let program: ts.Program = ts.createProgram(files, options);
  let checker: ts.TypeChecker = program.getTypeChecker();
  let output: DocEntry[] = [];

  // clean docs folder
  deleteSyncRecursive('docs');

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      const filename: string = sourceFile.fileName.replace('.ts', '.json');
      output = [];
      ts.forEachChild(sourceFile, visit);
      writeFileSyncRecursive(`docs/${filename}`, JSON.stringify(output, undefined, 4));
    }
  }
}
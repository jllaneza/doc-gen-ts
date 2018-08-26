import * as ts from 'typescript';

import { DocDecorator, DocType } from '../doc-gen';

export const hasDecorator = (decoratorName: string, node: ts.Node): boolean => {
  return (getDecoratorIndex(decoratorName, node) !== -1);
}

export const getDecoratorArgs = (decoratorName: string, node: ts.Node): ts.Node[] => {
  const decoratorIndex = getDecoratorIndex(decoratorName, node);
  return <ts.Node[]>(decoratorIndex >= 0
    ? (<ts.CallExpression>node.decorators[decoratorIndex].expression).arguments
    : []);
}

export const getMethodName = (node: ts.PropertyDeclaration): string => {
  const args: ts.Node[] = getDecoratorArgs(DocDecorator.Method, node);
  let name: string = (<ts.Identifier>node.name).text;
  if (args.length && ts.isStringLiteral(args[0])) {
    name = (<ts.StringLiteral>args[0]).text;
  }
  return name;
}

export const getClassSelectorName = (node: ts.ClassDeclaration): string => {
  const args: ts.Node[] = getDecoratorArgs(DocDecorator.Class, node);
  let selector: string;
  if (args.length && ts.isObjectLiteralExpression(args[0])) {
    const properties: ts.NodeArray<any> = (<ts.ObjectLiteralExpression>args[0]).properties;
    const index: number = properties.findIndex(prop => prop.name.text === 'selector');
    if (index !== -1) {
      selector = properties[index].initializer.text;
    }
  }
  return selector;
}

export const getName = (symbol: ts.Symbol, node: ts.Node, docType: DocType): string => {
  let name: string = symbol.getName();
  switch (docType) {
    case DocType.Method:
      name = getMethodName(<ts.PropertyDeclaration>node);
      break;
    case DocType.Class:
      name = getClassSelectorName(<ts.ClassDeclaration>node) || name;
      break;
  }
  return name;
}

export const getDecoratorIndex = (decoratorName: string, node: ts.Node): number => {
  let decoratorIndex: number = -1;
  if (!Array.isArray(node.decorators)) return decoratorIndex;
  decoratorIndex = node.decorators.findIndex(dec =>
   (ts.isCallExpression(dec.expression) && ts.isIdentifier(dec.expression.expression) && dec.expression.expression.text === decoratorName)
  );
  return decoratorIndex;
}
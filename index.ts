const ts = require('typescript');
const { generateDocumentation } = require('./src/doc-gen');

generateDocumentation(process.argv.slice(2)[0], {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS
});
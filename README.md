# doc-gen-ts

A sample project using [Typescript API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) that reads the .ts file(s) to extract information that might be useful for automating the documentation. As of now, it produces plain .json file(s).

## Getting Started

### Installation
```bash
$ npm install
```

### Generate documentation
```bash
$ npm run build
```

## Project structure

```
.
├── components              # Contains the .ts file(s) wherein the information for the documentation will be extracted
├── docs                    # Documentation files generated from running `npm run build`
├── src                     # Source files
├── index.ts                # Entry point
└── README.md
```
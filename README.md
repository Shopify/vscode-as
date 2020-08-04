# VSCode AssemblyScript

VSCode Language Client for AssemblyScript

## Requirements

- AssemblyScript 0.10.0+
- A global installation of the [AsseblyScript Language Server](https://github.com/saulecabrera/asls)

## Usage

To install the AssemblyScript Language Server make sure you follow the [installation instructions](https).

The AssemblyScript compiler supports parametrized source file extensions, this means that as long as
all your source files have the same extension you can instruct the compiler to use it.

This plugin accepts either `as` or `ts` as file extensions.

#### When using .ts

- Make sure to rename all file extensions to `ts`
- Make sure to have an npm script named `asbuild` in your project's `package.json` that performs the compilation process
- In your project's directory root make sure to include the following vscode settings:

  ```json
  # in .vscode/settings.json
  {
    "typescript.validate.enable": false
  }
  ```

  This will disable the typescript language server in your AS project avoiding
  conflicts between the two plugins.

#### When using .as

- Make sure to rename all file extensions to `as`
- Make sure to have an npm script named `asbuild` in your project's `package.json` that performs the compilation process

Note: using an extension different than `ts` might cause weird behaviors when using third party libraries that don't use the
same file extension.


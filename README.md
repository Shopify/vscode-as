# AssemblyScript for VSCode

![Build](https://github.com/saulecabrera/vscode-as/workflows/Build/badge.svg)


VSCode Language Client for AssemblyScript

## Requirements

- AssemblyScript 0.10.0+
- A global installation of the [AssemblyScript Language Server](https://github.com/saulecabrera/asls)

## Usage

To install the AssemblyScript Language Server make sure you follow the [installation instructions](https://github.com/saulecabrera/asls#installation).

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

## Troubleshooting

- Some versions of the this extension will require a minimum language server server version,
  please make sure your language server version is compliant. 

- Versions 0.3.0 to 0.3.2 _do not work_. Please update to a version that's equal or greater to 0.3.3

## Development

If you want to develop the extension using a development version of the language
server, you need to:

1. Symlink the language server binary into this directory `ln -s
   path/to/language/server/bin/asls asls`

2. Run `npm install` and `npm run compile`

3. Make sure to have Erlang 22+ installed, if you're using nix you can do so by
   running `nix-env -iA nixpkgs.erlang`

4. Under the debug section in VSCode click on `Run extension`

5. Once the extension is runing, in VSCode's output console, verify that the
   logs specify that the language server was started from the relative symlink,
   it looks something like:

   ```
   Starting the AssemblyScript Language Server from: /path/to/extension/vscode-as/asls
   ```

If you want to develop the extension using a global installation of the
language server, the steps are almost the same, except that you can skip step
1; and in step 5 instead of verifying that the language server is started from
the relative symlink, ensure that it is started from the global installation
path.

It's important to note that if the extension is in development mode and in the case that both the symlink and the global
installation are present, the symlink will take precedence over the global
installation.

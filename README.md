# NOTE
Please note: This repository is currently unmaintained. If you'd like to add features or fix issues, consider creating a fork. Please be aware that we are not going to be updating issues or pull requests on this repository.

# AssemblyScript for VSCode

![Build](https://github.com/saulecabrera/vscode-as/workflows/Build/badge.svg)


VSCode Language Client for AssemblyScript

## Requirements

- AssemblyScript 0.10.0+


## Usage

- Install the extension from the VSCode Marketplace.
- The extension support Linux, Mac and Windows via WSL.

By default the language server will report diagnostics for files located under
the `assembly/` directory. The configuration can be changed under the extension
settings to include other files.

The default configuration values are:

```json
"asls.include": {
  "description": "AssemblyScript sources to analyze",
  "type": "array",
  "default": [
    "assembly/**/*.ts",
    "assembly/*.ts"
  ]
},
"asls.port": {
  "description": "Port in which the language server will be listening",
  "type": "number",
  "default": 0
},
"asls.debug": {
  "description": "Start the language server in debug mode",
  "type": "boolean",
  "default": false
}

```

## Development

If you want to develop the extension using a development version of the language
server, you need to:

1. Build the langue server binary (`mix release`)
2. Symlink the language server binary into this directory `ln -s
   path/to/language/server/asls/_build/dev/rel/asls/bin/asls asls`

3. Run `npm install` and `npm run compile`

4. Make sure to have Erlang 22+ installed, if you're using nix you can do so by
   running `nix-env -iA nixpkgs.erlang`

5. Under the debug section in VSCode click on `Run extension`

6. Once the extension is runing, in VSCode's output console, verify that the
   logs specify that the language server was started from the relative symlink,
   it looks something like:

   ```
   Starting the AssemblyScript Language Server from: /path/to/extension/vscode-as/asls
   ```
## To release a new version

1. Bump the version in the `package.json`
2. Package the extension by running `yarn && npx vsce package --yarn`
3. Test the packaged extension by running `code --install-extension ./asls-x.x.x.vsix`
4. Publish via `npx vsce publish`
5. Publish to open-vsx via `npx ovsx publish ./asls-x.x.x.vsix -p <token>`



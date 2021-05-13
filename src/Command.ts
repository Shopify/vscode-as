import * as vscode from 'vscode';
import { Maybe } from 'purify-ts/Maybe';

export type Command = string;
const DEV_CMD = 'asls';



/**
 * Returns the language server command from the extension context.
 *
 * If the extension is on development mode, the local symlinked
 * binary path will be returned.
 *
 * If the extension is on production mode, the global binary path
 * will be returned.
 *
 * @param ctx - the extension context
 * @returns the language server command
 */
export const fromContext = (ctx: vscode.ExtensionContext): Maybe<Command> => {
  const fallback = Maybe
    .fromNullable(resolvePlatformBinary(ctx))
    .map(cmd => cmd.toString());

  switch(ctx.extensionMode) {
    case vscode.ExtensionMode.Development:
      return Maybe
        .of(ctx.asAbsolutePath(DEV_CMD))
        .map(cmd => cmd.toString())
    default:
      return fallback;
  }
};

const resolvePlatformBinary = (ctx: vscode.ExtensionContext) => {
  switch(platform()) {
    case 'darwin':
      return ctx.asAbsolutePath('bin/mac/bin/asls');
    case 'linux':
      return ctx.asAbsolutePath('bin/linux_x86_64/bin/asls');
    default:
      return null;
  }
}

function platform () {
  return process.platform
}

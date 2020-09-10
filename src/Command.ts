import * as vscode from 'vscode';
import { Maybe } from 'purify-ts/Maybe';
import * as shell from 'shelljs';

export type Command = string;

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
    .fromNullable(shell.which('asls'))
    .map(cmd => cmd.toString());

  switch(ctx.extensionMode) {
    case vscode.ExtensionMode.Development:
      return Maybe
        .fromNullable(shell.which(ctx.asAbsolutePath('asls')))
        .map(cmd => cmd.toString())
        .alt(fallback);
    default:
      return fallback;
  }
};

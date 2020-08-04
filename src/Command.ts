import * as vscode from 'vscode';

export type Command = string;

/**
 * Returns the language server command from the extension context.
 *
 * @param context - the extension context
 * @returns the language server command
 */
export const fromContext = (context: vscode.ExtensionContext): Command => {
  switch(context.extensionMode) {
    case vscode.ExtensionMode.Development:
      return context.asAbsolutePath('asls');
    default:
      return 'asls';
  }
};

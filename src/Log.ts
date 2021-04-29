import * as vscode from 'vscode';

export type VSCodeLogger = Logger<vscode.OutputChannel>;

export interface Logger<C> {
  error(msg: string): void;
  debug(msg: string): void;
  channel: C;
}

/**
 * Creates a logger from a VSCode output channel
 *
 * @param channel - the vscode output channel
 * @returns Logger
 */
export const fromOutputChannel = (channel: vscode.OutputChannel): Logger<vscode.OutputChannel> => ({
  error: (msg: string) => {
    vscode.window.showErrorMessage(msg);
  },
  debug: (msg: string) => {
    channel.appendLine(msg);
    channel.show(true);
  },
  channel: channel,
});

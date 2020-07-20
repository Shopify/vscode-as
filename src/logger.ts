import * as vscode from 'vscode';

export class Logger {
  channel: vscode.OutputChannel;

  static fromOutputChannel(): Logger {
    return new Logger();
  }

  constructor() {
    this.channel = vscode.window.createOutputChannel(
      'VSCode AssemblyScript'
    );
  }

  error(msg: string) {
    vscode.window.showErrorMessage(msg);
  }

  debug(msg: string) {
    this.channel.appendLine(msg);
    this.channel.show(true);
  }
}

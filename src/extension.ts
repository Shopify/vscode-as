import * as vscode from 'vscode';
import {
  ServerOptions,
  LanguageClientOptions,
  RevealOutputChannelOn,
  LanguageClient
} from 'vscode-languageclient';
import * as process from 'child_process';
import * as net from 'net';

import * as Logger from './Logger';
import * as Command from './Command';

const ID = 'vscode-as';
const NAME = 'AssemblyScript Language Client';
const DEFAULT_PORT = 7658;
const ARGS = ['-p', DEFAULT_PORT.toString()];

const logger = Logger.fromOutputChannel(
  vscode.window.createOutputChannel(NAME)
);

const makeError = (e?: string) => `
  AssemblyScript Language Server not started.
  Make sure that the CLI for the language server
  is correctly installed.

  Installation instructions can be found at: 

  https://github.com/saulecabrera/asls.
  
  The server returned:
  ${e}
`;

export function activate(context: vscode.ExtensionContext) {
  let clientOptions: LanguageClientOptions = {
    documentSelector: [
      { language: "assemblyscript", scheme: "file" },
      { language: "typescript", scheme: "file" },
    ],
    outputChannel: logger.channel,
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    diagnosticCollectionName: ID,
    synchronize: {
      configurationSection: ID,
      fileEvents: [
        vscode.workspace.createFileSystemWatcher("assembly/**/*.as"),
        vscode.workspace.createFileSystemWatcher("assembly/**/*.ts"),
        vscode.workspace.createFileSystemWatcher("package.json"),
      ], 
    },
  };

  let disposable =
    new LanguageClient(ID, NAME, run(Command.fromContext(context), ARGS), clientOptions)
    .start();

  logger.debug('Client started');
  context.subscriptions.push(disposable);
}

const spawn = (command: string, args: string[]): Promise<void> => new Promise((resolve, reject) => {
  const proc = process.spawn(command, args, {
    shell: true,
  });

  proc.stderr.on('data', (data) => {
    reject(makeError((data && data.toString())));
  });

  proc.stdout.on('data', (data) => {
    logger.debug(data.toString());
    resolve();
  });

  proc.on('error', (err) => {
    reject(makeError(err.toString()));
  });

  proc.on('exit', () => proc.kill());
});

const connect = (port: number): Promise<net.Socket> => new Promise((resolve, reject) => {
  const socket: net.Socket = net.createConnection({ port }, () => {
    logger.debug('Connection established.');
    resolve(socket);
  });

  socket.on('error', (err) => {
    reject(makeError(err.message.toString()));
  });
});

const run = (command: string, args: string[]): ServerOptions => () => new Promise((resolve,  _reject)  => {
  spawn(command, args)
    .then(() => connect(DEFAULT_PORT))
    .then((socket) => resolve({
      writer: socket,
      reader: socket,
    }))
    .catch(error => {
      logger.error(error);
    });
});

export function deactivate() {}

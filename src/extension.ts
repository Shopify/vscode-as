import * as vscode from 'vscode';
import { ServerOptions, LanguageClientOptions, RevealOutputChannelOn, LanguageClient } from 'vscode-languageclient';
import * as process from 'child_process';
import * as net from 'net';
import { Logger } from './logger';

const ID = 'vscode-as';
const NAME = 'AssemblyScript Language Client';
const COMMAND = 'asls';
const DEFAULT_PORT = 7658;
const ARGS = ['-p', DEFAULT_PORT.toString()];
const logger = Logger.fromOutputChannel();

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
    ],
    outputChannel: logger.channel,
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    synchronize: {
      configurationSection: ID,
      fileEvents: [
        vscode.workspace.createFileSystemWatcher("assembly/**/*.asc"),
        vscode.workspace.createFileSystemWatcher("package.json"),
      ]
    },
  };

  let disposable =
    new LanguageClient(ID, NAME, run(COMMAND, ARGS), clientOptions)
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

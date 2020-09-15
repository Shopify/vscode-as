import * as vscode from 'vscode';
import {
  ServerOptions,
  LanguageClientOptions,
  RevealOutputChannelOn,
  LanguageClient
} from 'vscode-languageclient';
import * as process from 'child_process';
import * as net from 'net';

import * as Logger from './Log';
import * as Runtime from './Runtime';
import { Either, Right, Left } from 'purify-ts/Either';
import { EitherAsync } from 'purify-ts/EitherAsync';

const ID = 'vscode-as';
const NAME = 'AssemblyScript Language Client';
const TARGET_COMMAND = 'asls';
// Passing 0 will result in dynamic port assigment
const DEFAULT_PORT = 0;
const ARGS = ['-p', DEFAULT_PORT.toString()];

const logger = Logger.fromOutputChannel(
  vscode.window.createOutputChannel(NAME)
);

const makeError = (e?: string) => `
  AssemblyScript Language Server not started.
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
    new LanguageClient(ID, NAME, run(context, ARGS), clientOptions)
    .start();

  logger.debug('Client started');
  context.subscriptions.push(disposable);
}

const spawn = (command: string, args: string[]): Promise<Either<string, number>> => new Promise((resolve, reject) => {
  logger.debug(`Starting the AssemblyScript Language Server from: ${command}`);
  const proc = process.spawn(command, args, {
    shell: true,
  });

  proc.stderr.on('data', (data) => {
    reject(Left(makeError((data && data.toString()))));
  });

  proc.stdout.on('data', (data) => {
    const log = data.toString();
    logger.debug(log);

    const match = log.match(/Server listening @ ([0-9]+)/);
    if (match && match.length > 0) {
      resolve(Right(parseInt(match[1])));
    }
  });

  proc.on('error', (err) => {
    reject(Left(makeError(err.toString())));
  });

  proc.on('exit', () => proc.kill());
});

const connect = (port: number): Promise<Either<string, net.Socket>> => new Promise((resolve, reject) => {
  const socket: net.Socket = net.createConnection({ port }, () => {
    logger.debug('Connection established.');
    resolve(Right(socket));
  });

  socket.on('error', (err) => {
    reject(Left(makeError(err.message.toString())));
  });
});

const run = (context: vscode.ExtensionContext, args: string[]): ServerOptions => () => new Promise((resolve,  _reject) =>
  Runtime.ensure(TARGET_COMMAND, context)
    .chain((cmd) => EitherAsync.fromPromise(() => spawn(cmd, args))) 
    .chain((port) => EitherAsync.fromPromise(() => connect(port)))
    .run().then(either =>
      either
      .ifLeft(reason => {
          logger.error(reason);
        })
      .ifRight(socket => resolve({
          writer: socket,
          reader: socket,
        }))
    ));

export function deactivate() {}

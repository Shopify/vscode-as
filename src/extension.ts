import * as vscode from 'vscode';
import {
  ServerOptions,
  LanguageClientOptions,
  RevealOutputChannelOn,
  LanguageClient
} from 'vscode-languageclient/node';

import * as Logger from './Log';
import * as Runtime from './Runtime';
import * as Config from './Config';
import * as Plugin from './Plugin';
import * as Server from './Server';
import { EitherAsync } from 'purify-ts/EitherAsync';

const config = Config.fromEntry();

const logger = Logger.fromOutputChannel(
  vscode.window.createOutputChannel(config.name)
);

export function activate(context: vscode.ExtensionContext) {
  let clientOptions: LanguageClientOptions = {
    documentSelector: [
      { language: "assemblyscript", scheme: "file" },
      { language: "assemblyscript", scheme: "untitled" },
      { language: "typescript", scheme: "file" },
      { language: "typescript", scheme: "untitled" },
    ],
    outputChannel: logger.channel,
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    diagnosticCollectionName: config.id,
    synchronize: {
      configurationSection: config.id,
      fileEvents: watchers(),
    },
  };

  logger.debug('Client started');
  context.subscriptions.push(
    new LanguageClient(config.id, config.name, run(context, Config.toArgs(config)), clientOptions)
    .start()
  );
}


const run = (context: vscode.ExtensionContext, args: string[]): ServerOptions => () => new Promise((resolve,  _reject) =>
  Runtime.ensure(config.command, context)
    .chain(cmd => Server.start({ command: cmd, logger }, args))
    .chain(sock => EitherAsync(async () => resolve({
      writer: sock,
      reader: sock,
    })))
    .chain(() => Plugin.activate(config))
    .run().then((either) => {
      either
        .ifLeft(e => logger.error(e));
    }));

export function deactivate() {}


export const watchers = () =>
  config.include.map(i => vscode.workspace.createFileSystemWatcher(i));

import * as vscode from 'vscode';
import { Maybe, Nothing } from 'purify-ts/Maybe';
import * as os from 'os';
import * as fs from 'fs';
import * as tar from 'tar';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

export type Command = string;
const DEV_CMD = 'asls';
const BINARIES = {
  darwin: ['x64'],
  linux: ['x64'],
};

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
export const fromContext = (ctx: vscode.ExtensionContext): MaybeAsync<Command> => {
  switch(ctx.extensionMode) {
    case vscode.ExtensionMode.Development:
      return MaybeAsync.liftMaybe(
        Maybe
          .of(ctx.asAbsolutePath(DEV_CMD))
          .map(cmd => cmd.toString())
      );
    default:
      return fallback(ctx);
  }
};

const fallback = (ctx: vscode.ExtensionContext) =>
  MaybeAsync.liftMaybe(verifyPlatform())
    .chain(p => MaybeAsync.fromPromise(() => resolvePlatformBinary(p, ctx)))
    .map(cmd => cmd.toString());

const verifyPlatform = (): Maybe<string> => {
  const p = platform();
  const binaries = BINARIES as any;
  if (binaries[p] && binaries[p].indexOf(os.arch()) !== -1) {
    return Maybe.of(p);
  }
  return Nothing;
};

const resolvePlatformBinary = async (platform: string, ctx: vscode.ExtensionContext): Promise<Maybe<string>> => new Promise((resolve, reject) => {
  const platformName = platform == 'linux' ? 'linux_x86_64' : platform;
  const tarballPath = ctx.asAbsolutePath(`bin/asls-${platformName}.tar.gz`);
  const binaryPath = ctx.asAbsolutePath(`bin/asls/bin/asls`);
  const binaryBase = ctx.asAbsolutePath('bin/');

  if (fs.existsSync(binaryPath)) {
    resolve(Maybe.of(binaryPath));
  } else if (fs.existsSync(tarballPath)) {
    tar.x({
      file: tarballPath,
      C: binaryBase,
    }).then(() => resolve(Maybe.of(binaryPath)));
  } else {
    reject(Nothing);
  }
});

const platform = () => process.platform;


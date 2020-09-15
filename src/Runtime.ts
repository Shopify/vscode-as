import * as vscode from 'vscode';
import * as shell from 'shelljs';
import * as semver from 'semver';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Right, Left } from 'purify-ts/Either';

import * as Command from './Command';

const MINIMUM_SERVER_VERSION = '0.5.0';

const exec = (command: string): Promise<Either<string, string>> => new Promise((resolve, reject) => {
  shell
    .exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(Left(stderr));
      }
      resolve(Right(stdout));
    });
});

const version = (cmd: string) => exec(`${cmd} --version`);

const ensureServer = (cmd: string, context: vscode.ExtensionContext): Either<string, string> =>
  Command
    .fromContext(cmd, context)
    .toEither(`
      AssemblyScript Language Server (asls) not found.
      Please make sure that the CLI for the language server is correctly installed.

      Installation instructions can be found at: https://github.com/saulecabrera/asls
      `);

const ensureServerVersion = (version: string): Either<string, boolean> => {
  const current = semver.clean(version);
  if (current && semver.gte(current, MINIMUM_SERVER_VERSION)) {
    return Right(true);
  }
  return Left(`
    The AssemblyScript Language Server CLI is outdated.
    The currrent version is ${current}.
    The current version of the language client requires v${MINIMUM_SERVER_VERSION}.
    Please update the AssemblyScript Language Server.
    `);
};

/**
 *
 * Ensures that the runtime dependencies of the language client are met.
 * The asls CLI must be installed and discoverable and the asls CLI version
 * must be >= MINIMUM_SERVER_VERSION
 *
 * The right side holds the command to start the server.
 * The left side holds a falure reason.
 *
 * @returns EitherAsync<string, string>
 */
export const ensure = (cmd: string, context: vscode.ExtensionContext): EitherAsync<string, string> =>
  EitherAsync
    .liftEither(ensureServer(cmd, context))
    .chain(cmd => EitherAsync.fromPromise(() => version(cmd)))
    .chain(vsn => EitherAsync.liftEither(ensureServerVersion(vsn)))
    .map(_ => Command.fromContext(cmd, context).unsafeCoerce());

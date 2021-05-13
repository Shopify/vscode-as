import * as vscode from 'vscode';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Right, Left } from 'purify-ts/Either';

import * as Command from './Command';

const ensureServer = (context: vscode.ExtensionContext): Either<string, string> =>
  Command
    .fromContext(context)
    .toEither(`
      The AssemblyScript Language Server not found for platform: ${process.platform}.
      The supported platforms are: MacOS and Linux x86_64
      If you're on Windows try starting the VSCode Extension from VScode
      Windows Subsystem for Linux (WSL)
      `);
/**
 *
 * Ensures that the runtime dependencies of the language client are met.
 *
 * The right side holds the command to start the server.
 * The left side holds a falure reason.
 *
 * @returns EitherAsync<string, string>
 */
export const ensure = (context: vscode.ExtensionContext): EitherAsync<string, string> =>
  EitherAsync
    .liftEither(ensureServer(context));

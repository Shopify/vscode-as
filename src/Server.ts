import * as process from 'child_process';
import * as net from 'net';
import * as Logger from './Log';
import { Either, Right, Left } from 'purify-ts/Either';
import { EitherAsync } from 'purify-ts/EitherAsync';

export interface Server {
  logger: Logger.VSCodeLogger,
  command: string,
}

const spawn = ({ logger, command }: Server, args: string[]): Promise<Either<string, number>> => new Promise((resolve, reject) => {
  logger.debug(`Starting the AssemblyScript Language Server from: ${command}`);
  const proc = process.spawn(command, args, {
    shell: true,
  });

  proc.stderr.on('data', (data) => {
    reject(Left(err((data && data.toString()))));
  });

  proc.stdout.on('data', (data) => {
    const log = data.toString();
    logger.debug(log);

    const match = log.match(/Server listening @ ([0-9]+)/);
    if (match && match.length > 0) {
      resolve(Right(parseInt(match[1])));
    }
  });

  proc.on('error', (error) => {
    reject(Left(err(error.toString())));
  });

  proc.on('exit', () => proc.kill());
});

const connect = ({logger}: Server, port: number): Promise<Either<string, net.Socket>> => new Promise((resolve, reject) => {
  const socket: net.Socket = net.createConnection({ port }, () => {
    logger.debug('Connection established.');
    resolve(Right(socket));
  });

  socket.on('error', (error) => {
    reject(Left(err(error.message.toString())));
  });
});

const err = (msg?: string): string => `
  AssemblyScript Language Server not started.
  The server returned:

  ${msg}
`;

/**
 * Starts the language server by spawning a process and connecting the socket.
 *
 * @returns EitherAsync<string, net.Socket>
 */
export const start = (server: Server, args: string[]): EitherAsync<string, net.Socket> =>
  EitherAsync
    .fromPromise(() => spawn(server, args))
    .chain(port => EitherAsync.fromPromise(() => connect(server, port)))

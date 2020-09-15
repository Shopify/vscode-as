const shelljs = jest.createMockFromModule('shelljs');

type Result = string | null;

const which = (cmd: string): Result => {
  switch(cmd) {
    case './asls':
      return './asls';
    case 'asls':
      return '/usr/bin/asls';
    default:
      return null;
  }
};

const exec = (cmd: string, _options: any, callback: any): void => {
  switch(cmd) {
    case 'asls --version':
      return callback(0, 'v0.5.0', '');
    case 'unmet --version':
      return callback(0, 'v0.4.2', '');
  }
};

const sh = shelljs as any;
sh.which = which;
sh.exec = exec;

module.exports = sh;

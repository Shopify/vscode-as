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

(shelljs as any).which = which;

module.exports = shelljs;

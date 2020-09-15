import { Just, Nothing } from 'purify-ts/Maybe';

export const fromContext = jest.fn().mockImplementation((cmd: string, _ctx: any) => {
  if (cmd === 'asls' || cmd === 'unmet') {
    return Just(cmd);
  }
  return Nothing;
});

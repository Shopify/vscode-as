import { ensure } from './Runtime';

jest.mock('./Command');

describe('Runtime', () => {
  describe('ensure', () => {
    it('returns Left<string> when the server is not found', () => {
      expect.assertions(2);
      return ensure(({} as any)).run().then(either => {
        expect(either.isLeft()).toBe(true);
        expect(either.extract().replace(/ /g, '')).toEqual(`
        The AssemblyScript Language Server not found for platform: ${process.platform}.
        The supported platforms are: MacOS and Linux x86_64
        If you're on Windows try starting the VSCode Extension from VScode
        Windows Subsystem for Linux (WSL)
          `.replace(/ /g, ''));
      });
    });
  });
});

import { ensure } from './Runtime';

jest.mock('./Command');

describe('Runtime', () => {
  describe('ensure', () => {
    it('returns Left<string> when the server is not found', () => {
      expect.assertions(2);
      return ensure('server', ({} as any)).run().then(either => {
        expect(either.isLeft()).toBe(true);
        expect(either.extract().replace(/ /g, '')).toEqual(`
        AssemblyScript Language Server (asls) not found.
        Please make sure that the CLI for the language server is correctly installed.

        Installation instructions can be found at: https://github.com/saulecabrera/asls
          `.replace(/ /g, ''));
      });
    });

    it('returns Left<string> when the server is found but does not meet the MINIMUM_SERVER_VERSION', () => {
      expect.assertions(2);
      return ensure('unmet', ({} as any)).run().then(either => {
        expect(either.isLeft()).toBe(true);
        expect(either.extract().replace(/ /g, '')).toEqual(`
        The AssemblyScript Language Server CLI is outdated.
        The currrent version is 0.4.2.
        The current version of the language client requires v0.5.0.
        Please update the AssemblyScript Language Server.
          `.replace(/ /g, ''));
      });
    });

    it('returns Right<string> with the validated server command when the server is found and the version is met', () => {
      expect.assertions(2);
      return ensure('asls', ({} as any)).run().then(either => {
        expect(either.isRight()).toBe(true);
        expect(either.extract()).toBe('asls');
      });
    });
  });
});

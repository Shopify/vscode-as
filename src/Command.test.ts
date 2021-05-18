import * as Command from './Command';
import { context } from './__mocks__/vscode';

const setPlatform = (platform: string) => Object.defineProperty(process, 'platform', {
  ...Object.getOwnPropertyDescriptor(process, 'platform'),
  value: platform,
});

describe('Command', () => {
  const realPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

  afterEach(() => {
    Object.defineProperty(process, 'platform', realPlatform as any);
  });

  describe('fromContext (development mode)', () => {
    it('defaults to the symlinked local server path', () => {
      const result = Command.fromContext((context as any));
      expect.assertions(2);
      return result.run().then(maybe => {
        expect(maybe.isJust()).toBe(true);
        expect(maybe.unsafeCoerce()).toBe('./asls');
      });
    });
  });

  describe('fromContext (production mode)', () => {
    beforeEach(() => {
      context.extensionMode = 1;
    });

    it('resolves the right binary path for mac', () => {
      setPlatform('darwin');
      const result = Command.fromContext((context as any));
      expect.assertions(2);
      return result.run().then(maybe => {
        expect(maybe.unsafeCoerce()).toBe('./bin/asls/bin/asls');
        expect(maybe.isJust()).toBe(true);
      });
    });


    it('resolves the right binary path for linux', () => {
      setPlatform('linux');
      const result = Command.fromContext((context as any));
      expect.assertions(2);
      return result.run().then(maybe => {
        expect(maybe.isJust()).toBe(true);
        expect(maybe.unsafeCoerce()).toBe('./bin/asls/bin/asls');
      });
    });

    it('returns Nothing if the specified command cannot be resolved', () => {
      setPlatform('foo');
      const result = Command.fromContext((context as any));
      expect.assertions(2);
      return result.run().then(maybe => {
        expect(maybe.isNothing()).toBe(true);
        expect(maybe.extractNullable()).toBeNull();
      });
    });
  });
});


import { ExtensionMode } from 'vscode';
import * as Command from './Command';
import { context, asAbsolutePath } from './__mocks__/vscode';

describe('Command', () => {
  describe('fromContext (development mode)', () => {
    it('defaults to the local server path', () => {
      const result = Command.fromContext('asls', (context as any));
      expect(result.isJust()).toBe(true);
      expect(result.unsafeCoerce()).toBe('./asls');
    });

    it('fallbacks to the global server path', () => {
      asAbsolutePath.mockReturnValue('unknown');
      const result = Command.fromContext('asls', (context as any));
      expect(result.isJust()).toBe(true);
      expect(result.unsafeCoerce()).toBe('/usr/bin/asls');
    });

    it('returns Nothing if the specified command cannot be resolved', () => {
      const result = Command.fromContext('server', (context as any));
      expect(result.isNothing()).toBe(true);
      expect(result.extractNullable()).toBeNull();
    });
  });

  describe('fromContext (production mode)', () => {
    beforeEach(() => {
      context.extensionMode = 1;
    });

    it('defaults to the global server path', () => {
      const result = Command.fromContext('asls', (context as any));
      expect(result.isJust()).toBe(true);
      expect(result.unsafeCoerce()).toBe('/usr/bin/asls');
    });

    it('returns Nothing if the specified command cannot be resolved', () => {
      const result = Command.fromContext('server', (context as any));
      expect(result.isNothing()).toBe(true);
      expect(result.extractNullable()).toBeNull();
    });
  });
});

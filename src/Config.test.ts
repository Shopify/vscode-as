import * as Config from './Config';


describe('toPortArgs', () => {
  test("returns [-p, $PORT] from the given config", () => {
    const config = {
      id: 'asls',
      name: 'AssemblyScript Language Server',
      port: 10,
      include: [''],
      debug: false,
    };
    const result = Config.toArgs(config);
    expect(result).toEqual(['eval', `"AssemblyScriptLS.CLI.start_with_options([port: 10])"`]);
  });

  test("returns [-p, $PORT, -d] from the given config", () => {
    const config = {
      id: 'asls',
      name: 'AssemblyScript Language Server',
      port: 10,
      include: [''],
      debug: true,
    };
    const result = Config.toArgs(config);
    expect(result).toEqual(['eval', `"AssemblyScriptLS.CLI.start_with_options([port: 10, debug: true])"`]);
  });
});

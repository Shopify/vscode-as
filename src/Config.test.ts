import * as Config from './Config';


describe('toPortArgs', () => {
  test("returns [-p, $PORT] from the given config", () => {
    const config = {
      id: 'asls',
      name: 'AssemblyScript Language Server',
      port: 10,
      include: [''],
      command: '',
      debug: false,
    };
    const result = Config.toArgs(config);
    expect(result).toEqual(['-p', '10']);
  });

  test("returns [-p, $PORT, -d] from the given config", () => {
    const config = {
      id: 'asls',
      name: 'AssemblyScript Language Server',
      port: 10,
      include: [''],
      command: '',
      debug: true,
    };
    const result = Config.toArgs(config);
    expect(result).toEqual(['-p', '10', '-d']);
  });
});

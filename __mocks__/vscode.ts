export enum ExtensionMode {
  Production  = 1,
  Development = 2,
  Test        = 3
}

export let extensionMode = ExtensionMode.Development;
export const asAbsolutePath = jest.fn().mockImplementation((cmd: string) => `./${cmd}`);

export const context = {
  extensionMode,
  asAbsolutePath
};



import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import * as vscode from 'vscode';
import * as Config from './Config';

interface TSLanguageFeaturesAPIV0 {
  configurePlugin(
    pluginId: string,
    configuration: any,
  ): void;
}

interface TSLanguageFeatures {
  getAPI(version: 0): TSLanguageFeaturesAPIV0 | undefined;
}

type TSExtension = vscode.Extension<TSLanguageFeatures>;

const ID = "asts";
const TS_LANG_FEATURES = "vscode.typescript-language-features";

const extension = (): Maybe<TSExtension> =>
  Maybe.fromFalsy(
    vscode.extensions.getExtension(TS_LANG_FEATURES)
  );

const configure = async (extension: TSExtension, config: Config.Config): Promise<Maybe<TSLanguageFeaturesAPIV0>> => {
  const features = await extension.activate();
  if (!features) {
    return Nothing;
  }

  const api = features.getAPI(0);
  if (api) {
    api.configurePlugin(ID, {
      'include': config.include,
      rootPath: vscode.workspace.rootPath,
    });
    return Just(api);
  }

  return Nothing;
};

/**
 * Activates the TypeScript Server Plugin named `asts`. This plugin is defined as local package and
 * defined as a local dependency in the extension's package.json.
 * The plugin must also be defined in the contributes section of the extension
 * under the `typescriptServerPlugins`.
 *
 * This plugin is in charge of:
 *  - Disabling TypeScript's diagnostics when analyzing an AssemblyScript file
 *  that matches the include glob.
 *  - Enabling TypeScript diagnostics in all other directories
 *
 *  @param config - the extension configuration
 *  @returns EitherAsync<string, TSLanguageFeaturesAPIV0>
 */
export const activate = (config: Config.Config) =>
  MaybeAsync
    .liftMaybe(extension())
    .chain(ext => configure(ext, config))
    .toEitherAsync("Couldn't load the builtin TypeScript features. Try restarting VSCode.");




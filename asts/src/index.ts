import * as ts from 'typescript/lib/tsserverlibrary';
import * as mm from 'minimatch';
import * as path from 'path';

let defaultConfig = { include: "assembly/**/*.ts", rootPath: '' };

const create = ({ languageService }: ts.server.PluginCreateInfo): ts.LanguageService => ({
  ...languageService,
  getCompilerOptionsDiagnostics: () => [],
  getSyntacticDiagnostics: filter(languageService, "getSyntacticDiagnostics"),
  getSemanticDiagnostics: filter(languageService, "getSemanticDiagnostics"),
  getSuggestionDiagnostics: filter(languageService, "getSuggestionDiagnostics"),
});

const init = (): ts.server.PluginModule => ({
  create,
  onConfigurationChanged: (config) => {
    defaultConfig = config;
  }
});

const filter = (service: ts.LanguageService, key: keyof ts.LanguageService) => (filename: string) => {
  const relative = path.relative(defaultConfig.rootPath, filename);
  if (mm(relative, defaultConfig.include)) {
    return [];
  }
  return (service as any)[key](filename);
};

export = init;

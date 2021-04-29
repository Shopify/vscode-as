import * as ts from 'typescript/lib/tsserverlibrary';
import * as mm from 'minimatch';
import * as path from 'path';

let DEFAULT_CONFIG = { include: "assembly/**/*.ts", rootPath: '' };
let PROJECT: ts.server.Project | null = null;

const create = ({ languageService, project }: ts.server.PluginCreateInfo): ts.LanguageService => {
  PROJECT = project;
  return {
    ...languageService,
    getCompilerOptionsDiagnostics: () => [],
      getSyntacticDiagnostics: filter(languageService, "getSyntacticDiagnostics"),
    getSemanticDiagnostics: filter(languageService, "getSemanticDiagnostics"),
    getSuggestionDiagnostics: filter(languageService, "getSuggestionDiagnostics"),
  };
};

const init = (): ts.server.PluginModule => ({
  create,
  onConfigurationChanged: (config) => {
    DEFAULT_CONFIG = config;
    if (PROJECT) {
      PROJECT.refreshDiagnostics();
    }
  }
});

const filter = (service: ts.LanguageService, key: keyof ts.LanguageService) => (filename: string) => {
  const relative = path.relative(DEFAULT_CONFIG.rootPath, filename);
  if (mm(relative, DEFAULT_CONFIG.include)) {
    return [];
  }
  return (service as any)[key](filename);
};

export = init;

import * as vscode from 'vscode';
import { ServerOptions, LanguageClientOptions, RevealOutputChannelOn, LanguageClient } from 'vscode-languageclient';
import * as process from 'child_process';
import * as net from 'net';

const out = vscode.window.createOutputChannel(
  "VSCode AssemblyScript"
);

const ID = "vscode-as";
const NAME = "AssemblyScript Language Client";

export function activate(context: vscode.ExtensionContext) {
  // --- TODO: Default to global asls installation when ready
  const command = context.asAbsolutePath('./asls');
  const serverOptions: ServerOptions = run(command);
  let clientOptions: LanguageClientOptions = {
    documentSelector: [
      { language: "assemblyscript", scheme: "file" },
    ],
    outputChannel: out,
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    synchronize: {
      configurationSection: "vscode-as",
      fileEvents: [
        vscode.workspace.createFileSystemWatcher("assembly/**/*.asc"),
        vscode.workspace.createFileSystemWatcher("assembly/**/*.ts"),
        vscode.workspace.createFileSystemWatcher("package.json"),
      ]
    },
  };


  let disposable =
    new LanguageClient(ID, NAME, serverOptions, clientOptions).start();

  out.appendLine("Client started");
  out.show(true);

  context.subscriptions.push(disposable);
}

// --- TODO: Get an available port from  the OS
// --- The current setup is temporary, only for 
// --- development. 
// --- 7658 is the default port of the 
// --- language server.
function run(command: String): ServerOptions {
  return () => {
    return new Promise((resolve, _reject) => {
      // const p = process.spawn(command, ['-p', PORT]);
      const socket = net.createConnection({port: 7658}, () => {
        out.appendLine('Connection established');
        out.show(true);
      });
      resolve({
        reader: socket,
        writer: socket
      });
    });
  };
}

export function deactivate() {}

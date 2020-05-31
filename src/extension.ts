import * as vscode from 'vscode';
import { ServerOptions, LanguageClientOptions, RevealOutputChannelOn, LanguageClient } from 'vscode-languageclient';
import * as process from 'child_process';
import * as net from 'net';

const outputChannel = vscode.window.createOutputChannel(
	"VSCode AS"
);

const ID = "vscode-as";
const NAME = "AssemblyScript Language Client";

export function activate(context: vscode.ExtensionContext) {
  // --- TODO: Default to global asls installation when ready
	const command = context.asAbsolutePath('./asls');
	const serverOptions: ServerOptions = run(command);
	let clientOptions: LanguageClientOptions = {
		documentSelector: [
			{ language: "ts", scheme: "file" },
			{ language: "asc", scheme: "file" },
		],
		revealOutputChannelOn: RevealOutputChannelOn.Never,
		synchronize: {
			configurationSection: "vscode-as",
			fileEvents: [
				vscode.workspace.createFileSystemWatcher("assembly/**/*.asc"),
				vscode.workspace.createFileSystemWatcher("assembly/**/*.ts"),
				vscode.workspace.createFileSystemWatcher("package.json"),
			]
		}
	};


	let disposable = new LanguageClient(
    ID,
    NAME,
		serverOptions,
		clientOptions
	).start();

	outputChannel.appendLine("Client started");
  outputChannel.show(true);

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
				outputChannel.appendLine('Connection established');
				outputChannel.show(true);
			});
			resolve({
				reader: socket,
				writer: socket
			});
		});
	};
}

export function deactivate() {}

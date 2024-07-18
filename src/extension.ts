// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// interface Proxy {
// 	name: string;
// 	proxyType: string;
// 	host: string;
// 	port: string;
// }

function getProxiesConfig() {
    return vscode.workspace.getConfiguration().get('proxyswitcher.proxyListString', []) as string[];
}

// async function addProxy() {
// 	const proxyTypes = ['http', 'https', 'socks5'].map(type => ({ label: type }));

//     const name = await vscode.window.showInputBox({ prompt: 'Proxy Name' });
// 	const proxyType = await vscode.window.showQuickPick(proxyTypes, { 
// 		placeHolder: 'Proxy Type'
// 	});
//     const host = await vscode.window.showInputBox({ prompt: 'Proxy Host' });
//     const port = await vscode.window.showInputBox({ prompt: 'Proxy Port', validateInput: value => isNaN(parseInt(value, 10)) ? 'Port must be a number' : undefined });

//     if (name && host && port && proxyType) {
//         const proxies = getProxiesConfig();
//         proxies.push({ name, proxyType: proxyType.label, host, port});
//         await vscode.workspace.getConfiguration().update('proxyswitcher.proxies', proxies, true);
//     }
// }

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "proxyswitcher" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('proxyswitcher.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ProxySwitcher!');
	});

	const proxyConfig = vscode.workspace.getConfiguration();

	const setProxy = vscode.commands.registerCommand('proxyswitcher.setProxy', () => {
		const proxies = getProxiesConfig();
		proxies.push('No proxy');
		vscode.window.showQuickPick(proxies, {placeHolder: 'Select a proxy'}).then(selectedProxy => {
			if (!selectedProxy) {
				return;
			}
			const proxy = selectedProxy === 'No proxy' ? '' : selectedProxy;
			proxyConfig.update('http.proxy', proxy, vscode.ConfigurationTarget.Global);
			vscode.window.showInformationMessage('proxy set to ' + proxy);
		});
	});
	
	const clearProxy = vscode.commands.registerCommand('proxyswitcher.clearProxy', () => {
		proxyConfig.update('http.proxy', '', vscode.ConfigurationTarget.Global);
		vscode.window.showInformationMessage('proxy cleared.');
	});

	// TODO: Add proxy address validation
	const validateProxy = vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('proxyswitcher.proxyListString')) {
			const proxies = getProxiesConfig();
			proxies.push('No proxy');
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(setProxy);
	context.subscriptions.push(clearProxy);
}

// This method is called when your extension is deactivated
export function deactivate() {}

'use strict';

import * as path from "path";
import * as vscode from 'vscode';
import {compile} from './compile';
import {create_server, preview, preview_browser, source, inPreview, previewProvider} from './preview';
import {process_auto_complete, LaTeXCompletionItemProvider} from './completion';

var hasbin = require('hasbin');
var fs = require('fs');
var loader = require("amd-loader");
var process = require("process");

export var latex_output,
           workshop_output,
           preview_provider,
           has_compiler,
           has_synctex,
           find_path,
           compile_on_save,
           compile_on_save_statusbar,
           compile_on_save_statusbar_timeout;

export async function activate(context: vscode.ExtensionContext) {
    find_path = context.asAbsolutePath;
    console.log('LaTeX Workshop activated.');
    var configuration = vscode.workspace.getConfiguration('latex-workshop');
    latex_output = vscode.window.createOutputChannel('LaTeX Compiler Output');
    workshop_output = vscode.window.createOutputChannel('LaTeX Workshop Output');

    const is_mac = process.platform === 'darwin';
    has_compiler = hasbin.sync(configuration.get('compiler')) || is_mac;
    context.subscriptions.push(
        vscode.commands.registerCommand('latex-workshop.compile', has_compiler ? () => compile() : deactivated_feature),
        vscode.commands.registerCommand('latex-workshop.compile_here', has_compiler ? () => compile(true) : deactivated_feature)
    );
    if (!has_compiler) {
        vscode.window.showWarningMessage(`LaTeX compiler ${configuration.get('compiler')} is not found.`);
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('latex-workshop.preview', preview),
        vscode.commands.registerCommand('latex-workshop.preview_browser', preview_browser),
        vscode.commands.registerCommand('latex-workshop.source', source)
    );

    has_synctex = hasbin.sync('synctex') || is_mac;
    context.subscriptions.push(
        vscode.commands.registerCommand('latex-workshop.synctex', has_synctex ? inPreview : deactivated_feature)
    );
    if (!has_synctex) {
        vscode.window.showWarningMessage(`SyncTeX is not found.`);
    }

    if (has_compiler)
        context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
            try {
                var ext = path.extname(vscode.window.activeTextEditor.document.fileName);
                console.log(ext)
            if (ext != '.tex')
                    return;
            } catch (e) {
                return;
            }
            if (compile_on_save)
                compile()
        }));

    vscode.commands.registerCommand("latex-workshop.toggle_compile_on_save", toggle_compile_on_save);
    compile_on_save_statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    compile_on_save_statusbar.command = "latex-workshop.toggle_compile_on_save";
    compile_on_save_statusbar.tooltip = "Toggle LaTeX Compile-on-save";
    compile_on_save_statusbar.show();

    compile_on_save = !configuration.get('compile_on_save');
    toggle_compile_on_save();

    preview_provider = new previewProvider(context);
    context.subscriptions.push(preview_provider);
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('latex-workshop-preview', preview_provider));

    var completion_provider = new LaTeXCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('latex', completion_provider, '\\', '{', ','));

    fs.readFile(context.asAbsolutePath('data/auto_latex.json'), (err, data) => {
        if (err) throw err;
        process_auto_complete('latex', JSON.parse(data));
    });

    create_server(context);

}

function toggle_compile_on_save() {
    compile_on_save = !compile_on_save;
    if (compile_on_save) {
        compile_on_save_statusbar.text = `$(file-pdf) Compile-on-save Enabled`;
        compile_on_save_statusbar.color = "white";
        if (compile_on_save_statusbar_timeout) {
            clearTimeout(compile_on_save_statusbar_timeout)
        }
        compile_on_save_statusbar_timeout = setTimeout(() => {compile_on_save_statusbar.text = `$(file-pdf)`}, 2000)
    } else {
        compile_on_save_statusbar.text = `$(file-pdf) Compile-on-save Disabled`;
        compile_on_save_statusbar.color = "silver";
        if (compile_on_save_statusbar_timeout) {
            clearTimeout(compile_on_save_statusbar_timeout)
        }
        compile_on_save_statusbar_timeout = setTimeout(() => {compile_on_save_statusbar.text = `$(file-pdf)`}, 2000)
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function deactivated_feature() {

}

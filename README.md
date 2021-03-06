# Visual Studio Code LaTeX Workshop Extension

LaTeX Workshop is an extension for [Visual Studio Code](https://code.visualstudio.com/), aiming to provide all-in-one features and utilities for latex typesetting with Visual Studio Code. 

## Features

- Compile LaTeX with BibTeX to PDF
- Preview PDF on-the-fly (in VSCode or browser)
- Support direct and reverse SyncTex
- Autocomplete
- Colorize
- Log parser

## Requirements

- LaTeX distribution in system PATH. For example, [TeX Live](https://www.tug.org/texlive/).

## Installation

Installing LaTeX Workshop is simple. You can find it in [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop), or simply run `ext install latex-workshop` in VS Code Quick Open (Ctrl/Cmd+P).

Alternatively, you can check out this repository and copy it to the VS Code local extensions folder:
- Windows `%USERPROFILE%\.vscode\extensions`
- Mac/Linux `$HOME/.vscode/extensions`

## Usage

- Compile: Either use `latex-workshop.compile` command, or use right click menu, or simply enable compile-on-save.
- Preview: Click on the `Show Preview` button on the top-right corner of the editor. The preview is updated automatically after compilation.
- In-browser Preview: Right click on TeX and select `Show In-browser Preview`.
- Direct SyncTex from Tex to PDF: Open preview first then right click on TeX and select `Find in Preview`.
- Reverse SyncTex from PDF to TeX: ctrl/cmd + left click on PDF preview.
- Autocomplete: An autocomplete list will show up when '\' or '{' is typed. Multi-citation supported.

## Commands

- `latex-workshop.compile`: Compile LaTeX to PDF.
- `latex-workshop.compile_here`: Compile LaTeX to PDF from active editor.
- `latex-workshop.preview`: Open a live preview column for LaTeX.
- `latex-workshop.preview_browser`: Open a webpage preview for LaTeX.
- `latex-workshop.source`: Show LaTeX source of the preview.
- `latex-workshop.synctex`: Direct synctex from cursor position.

## Settings

All settings need VS Code reload to take effect.
- `latex-workshop.compiler`: Set the LaTeX compiler command.
- `latex-workshop.compile_argument`: Set the compiler arguments. It is required that non-blocking compile argument is used, e.g., `-halt-on-error` and `-interaction=nonstopmode`.
- `latex-workshop.compile_workflow`: Set the compile workflow of LaTeX. Default is `latex`->`bibtex`->`latex`->`latex`. An array of commands is required here. Each command will be executed when the previous one is finished. If any command outputs `error`, the workflow will terminate. Some placeholders are available:
  - `%compiler%`: The compiler set in `latex-workshop.compiler`.
  - `%arguments%`: The compiler argument set in `latex-workshop.compile_argument`.
  - `%document%`: Name of the current active file in VS Code.
- `latex-workshop.compile_on_save`: Whether LaTeX Workshop should compile the current active LaTeX file on save.
- `latex-workshop.main_document`: The relative path to the main document for LaTeX project. Auto-detection enabled with `null`.
- `latex-workshop.log_level`: Define the LaTeX log parser output level. Available levels: `all` for all log entries, `warning` for warnings and errors, `error` for errors only.

## Contributing

- Fork it.
- Do something.
- Pull request.
- Thank you and have some beer.

## License

[MIT](https://opensource.org/licenses/MIT)

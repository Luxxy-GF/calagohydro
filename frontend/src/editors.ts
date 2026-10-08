import type { OnMount } from '@monaco-editor/react';
import type { ITheme, Terminal } from '@xterm/xterm';
import type { ExtensionContext } from 'shared';

function terminalTheme(): ITheme {
  const dark = document.documentElement.dataset.mantineColorScheme !== 'light';
  return {
    background: dark ? '#110f0d' : '#fffdfa',
    foreground: dark ? '#fff1e0' : '#29241f',
    cursor: dark ? '#fff1e0' : '#29241f',
    selectionBackground: dark ? '#433b32' : '#dec09d',
    black: '#29241f',
    red: '#fa4e49',
    green: '#91ffa9',
    yellow: '#f2d9bb',
    blue: '#91c7ff',
    magenta: '#d8a7e8',
    cyan: '#8cdbd3',
    white: '#fff1e0',
  };
}

/** Extend the built-in names used by Calagopus, including live color switching. */
const themeMonaco: OnMount = (_editor, monaco) => {
  monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#110f0d',
      'editor.foreground': '#fff1e0',
      'editor.lineHighlightBackground': '#1d1816',
      'editor.selectionBackground': '#433b32',
      'editorLineNumber.foreground': '#867565',
      'editorCursor.foreground': '#fff1e0',
      'editorWidget.background': '#1d1816',
      'editorWidget.border': '#433b32',
    },
  });
  monaco.editor.defineTheme('light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#fffdfa',
      'editor.foreground': '#29241f',
      'editor.lineHighlightBackground': '#fff8f0',
      'editor.selectionBackground': '#dec09d',
      'editorLineNumber.foreground': '#78695a',
      'editorCursor.foreground': '#29241f',
      'editorWidget.background': '#fff8f0',
      'editorWidget.border': '#e8ddd1',
    },
  });
};

export function installEditorThemes(ctx: ExtensionContext): void {
  ctx.extensionRegistry.elements.monacoEditor.addOnMountHandler(themeMonaco);
  ctx.extensionRegistry.elements.monacoEditor.addDiffOnMountHandler((editor, monaco) => {
    themeMonaco(editor.getModifiedEditor(), monaco);
  });

  const cleanup = new WeakMap<Terminal, () => void>();
  const xterm = ctx.extensionRegistry.pages.server.console.xterm;
  xterm.addInitHandler((options) => {
    options.theme = terminalTheme();
  });
  xterm.addAfterOpenHandler((terminal) => {
    let frame = 0;
    const apply = () => {
      cancelAnimationFrame(frame);
      // Apply after core effects update the terminal for the selected color mode.
      frame = requestAnimationFrame(() => {
        terminal.options.theme = terminalTheme();
      });
    };
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mantine-color-scheme'],
    });
    apply();
    cleanup.set(terminal, () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    });
  });
  xterm.addOnUnmountHandler((terminal) => {
    cleanup.get(terminal)?.();
    cleanup.delete(terminal);
  });
}

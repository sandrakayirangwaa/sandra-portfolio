// Bundles the whole site into one HTML file (dist-preview/index.html) for a quick shareable preview.
import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = 'dist-preview';
mkdirSync(path.join(root, outDir), { recursive: true });
const result = await build({
  stdin: {
    contents: `
      import '@fontsource/anton/400.css';
      import '@fontsource-variable/inter/index.css';
      import './app/globals.css';
      import { createRoot } from 'react-dom/client';
      import { createElement } from 'react';
      import Portfolio from './components/Portfolio';
      createRoot(document.getElementById('root')).render(createElement(Portfolio));`,
    resolveDir: root, loader: 'tsx',
  },
  bundle: true, minify: true, write: false, outdir: 'dist-preview', format: 'iife', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.woff2': 'dataurl', '.woff': 'empty' },
  alias: { '@': root }, logLevel: 'warning',
});
const js = result.outputFiles.find((f) => f.path.endsWith('.js')).text.replace(/<\/script/gi, '<\\/script');
const css = result.outputFiles.find((f) => f.path.endsWith('.css')).text;
writeFileSync(path.join(root, outDir, 'index.html'), `<title>Sandra Kayirangwa</title>\n<style>${css}</style>\n<div id="root"></div>\n<script>${js}</script>\n`);

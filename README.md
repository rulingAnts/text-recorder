# Text Recorder

A stripped‑down, **recording‑only** PWA for native‑speaker coworkers gathering audio
on a phone — record → send. It is the **same app** as the
[Flextext Editor](https://github.com/rulingAnts/flextext-editor) in its "record" mode;
this repo is only a thin shell so it installs as its **own** home‑screen app.

## Why a separate repo?

Two PWAs on the same origin must have **non‑overlapping scopes** or the browser treats
them as one app (installing one makes the other show "already installed"). The editor
lives at `…/flextext-editor/` (root scope). Hosting the recorder at the sibling path
`…/text-recorder/` gives it a **disjoint scope**, so it installs as a separate app —
*without* moving or disrupting the already‑deployed editor.

## How it shares the codebase

`index.html` here is a thin shell that loads the editor's engine over the **same origin**
(no CORS): `/flextext-editor/js/app.js` + `/flextext-editor/css/app.css`. The recording /
consent / upload logic is therefore maintained **once**, in the editor repo. This repo
holds only: the shell (`index.html`), the manifest (`recorder.webmanifest`, distinct
`id` + `scope`), its own service worker (`sw.js` — a SW can't reach above its own folder
on GitHub Pages, so each app serves its own), and the recorder icons.

`window.__MODE = 'record'` (set inline in `index.html`) tells the shared engine to render
the record‑only UI.

## Deploy

GitHub Pages from the repo root → served at `https://rulingants.github.io/text-recorder/`.
Bump `sw.js` `VERSION` on each deploy.

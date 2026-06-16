# Text Recorder

A stripped‑down, **recording‑only** PWA for native‑speaker coworkers gathering audio
on a phone — record → send.

> **This is a companion to the [Flextext Editor](https://github.com/rulingAnts/flextext-editor),
> which is the main project.** The Text Recorder is the *same app* running in its "record"
> mode — all the recording, consent, storage, and upload logic lives in the editor repo and
> is maintained there, once. This repo is only a thin shell so the recorder installs as its
> **own** home‑screen app. **For issues, contributions, and the full story, go to the
> [Flextext Editor repo](https://github.com/rulingAnts/flextext-editor).**

Live: <https://rulingants.github.io/text-recorder/> · Editor: <https://rulingants.github.io/flextext-editor/>

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
holds only:

- `index.html` — the shell (sets `window.__MODE = 'record'` to tell the shared engine to
  render the record‑only UI)
- `recorder.webmanifest` — the manifest, with a distinct `id` + `scope` so it installs separately
- `sw.js` — its own service worker (a SW can't reach above its own folder on GitHub Pages,
  so each app serves its own)
- `icons/` — the recorder's app icons (microphone)

## Deploy

GitHub Pages from the repo root → served at <https://rulingants.github.io/text-recorder/>.
Bump `sw.js` `VERSION` on each deploy.

> ⚠️ The shell depends on the editor being deployed at `…/flextext-editor/` on the **same
> origin**. If the editor moves or its `js/`/`css/` paths change, update the script/link
> hrefs in `index.html` here to match.

## License

[GNU AGPL‑3.0](LICENSE) — same license as the [Flextext Editor](https://github.com/rulingAnts/flextext-editor).
© 2026 Seth Johnston.

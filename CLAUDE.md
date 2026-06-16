# Text Recorder — repo guide for Claude / LLMs

This repo ships the **Text Recorder** PWA (<https://rulingants.github.io/text-recorder/>):
a stripped-down, **recording-only** app for native-speaker coworkers gathering
audio on a phone (record → send). It is a **thin companion** to the **Flextext
Editor**, which is the **main project** — a separate, independent Git repo at
`rulingAnts/flextext-editor` (local: `/Users/Seth/GIT/flextext editor/`).

## The one thing to understand: this is a SHELL, not a fork

`index.html` here is a thin shell. It loads the **editor's engine** cross-path
over the same GitHub Pages origin — `/flextext-editor/js/app.js` +
`/flextext-editor/css/app.css` — and sets `window.__MODE='record'` so that
shared engine renders the record-only UI.

**⇒ All recording / consent / storage / upload logic lives in the EDITOR repo,
not here.** To change behavior, edit the editor repo's `js/`. Do **not** copy
engine code into this repo. This repo holds ONLY:

- `index.html` — the shell (sets `window.__MODE='record'`)
- `recorder.webmanifest` — manifest with a distinct `id`/`scope` so it installs
  as its own app, separate from the editor
- `sw.js` — its own service worker (a SW can't reach above its own folder on
  GitHub Pages, so each app serves its own)
- `icons/` — the recorder's app icons

## Why a separate repo (don't merge them into the editor)

Two PWAs on one origin must have **non-overlapping scopes** or the browser treats
them as one app (installing one makes the other report "already installed"). The
editor owns `/flextext-editor/` (root scope); this recorder lives at the disjoint
sibling path `/text-recorder/`. A separate repo keeps the editor at
`/flextext-editor/` **untouched** — relocating the editor would change its PWA
`id` and **orphan every installed copy in the field**.

## ⚠ VERSION COUPLING

`sw.js` here **precaches the editor's engine files by path** (`/flextext-editor/js/*.js`,
`css/app.css`). Those files have their own lifecycle in the editor repo.
**Whenever the editor engine changes in a way this recorder should pick up, bump
`VERSION` in `sw.js` here** — otherwise installed recorders keep serving a
**stale cached engine** offline.

## ⚠ DEPLOY ORDER — editor first, always

GitHub Pages serves this repo's root at <https://rulingants.github.io/text-recorder/>.
When a change spans both repos:

1. Deploy the **editor's `productionWeb` FIRST**; confirm `/flextext-editor/` is live.
2. **Then** bump this `sw.js` `VERSION` (if not already) and `git push` this repo.

Reason: this recorder's SW precaches whatever editor engine is live **at install
time**. Pushing this repo first would cache the OLD editor engine.

## Branches / deploy

Single `main` branch, deployed straight to Pages (root) — no dev/prod split like
the editor, so this repo is effectively always "production." Test engine changes
on the **editor** repo's dev server first; this shell itself rarely changes. Per
the editor's release rule, do not push without the maintainer's OK.

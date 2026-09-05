# kcal

Express app (TypeScript, compiled to CommonJS) for tracking daily calorie intake and weight. Single
process serves both the static frontend (`express.static`) and the `/api/*` JSON endpoints - no
separate frontend/backend split. File-based, per-user JSON storage under `<app root>/data`
(`src/controller.ts`: `dataDirPath = ${__dirname}/data`, so this stays relative to wherever the
compiled `controller.js` ends up at runtime).

Two independent deployment methods exist side by side:

- **Docker**: CI builds and pushes `ghcr.io/danielnagel/kcal` on every push to `main` (see
  "Build & publish" below). Consumers mount a volume at `/home/node/app/data` for persistence.
- **systemd, no Docker** (`install.sh`, `kcal.service-template`, `backup-kcal.*`): a from-source
  install on a plain Debian-based host (developed/tested on a Raspberry Pi 3, see `readme.md`
  "about"). Unrelated to the Docker image and not affected by the Docker build changes described
  here.

## Build & publish

- `npm run build` - `tsc -p tsconfig.build.json`, compiles `src/**/*.ts` (except tests) into `dist/`.
- `npm run build:production` - chains `prebuild:production` (`npm i`) -> `build` -> `bundle.sh
  production` (copies static assets - HTML/CSS/JS/favicon/serviceworker/manifest/chart.js - into
  `dist/public`, and `package*.json` into `dist`) -> `postbuild:production` (`cd dist && npm i
  --omit=dev`, installs only `express`/`body-parser` into `dist/node_modules`). Result: `dist/` is a
  fully self-contained, flat app root (compiled `.js` files, `public/`, `node_modules/`, no nested
  `dist/` subfolder - required so `${__dirname}/data` keeps resolving correctly at runtime).
- `Dockerfile` (repo root, multi-stage): build stage runs `npm ci` + `npm run build:production`;
  runtime stage (`node:21`, non-root `node` user) copies `dist/` in as the app root. Build context is
  the repo root.
- `.github/workflows/lint-build-test.yml`: `build` job (lint, test, `npm run build` as a compile
  check) gates a `publish` job that builds/pushes the Docker image to GHCR
  (`ghcr.io/danielnagel/kcal:latest` + `:<sha>`) on push to `main`. The GHCR package is public - no
  `docker login` needed to pull.

Previously, CI only compiled the TypeScript and uploaded `dist` as a GitHub Actions artifact; the
deployment target downloaded it and ran `docker build` locally to save resources on that host. This
is why the image is still built exactly the way `bundle.sh`/`postbuild:production` always assembled
`dist` - only *where* `docker build` runs changed (GitHub's runners instead of the deployment
target), which is a strict improvement for a resource-constrained target.

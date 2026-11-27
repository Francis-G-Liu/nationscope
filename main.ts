// NationScope hand-in (Node 22, standard library only).
//
// The site is plain static files in app/ (index.html, CSS and JS, no build
// step) plus screenshots/ of the site running. This program hands them in:
// it copies app/ and screenshots/ beside this file into the output
// directory and writes dossier.json there, the summary the judge reads,
// built by the vendored make.fun library from the files themselves.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Dotfiles (.gitkeep, .DS_Store, ...) are not plain relative names: the
// scorer rejects any output path starting with one, so skip every file or
// directory whose name starts with a dot.
const noDotfiles = (src: string) => !basename(src).startsWith(".");

// Fresh output directory, then the two trees the entry is made of.
mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), {
  recursive: true,
  filter: noDotfiles,
});
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), {
    recursive: true,
    filter: noDotfiles,
  });
}

// The gate's own caps, so a local run refuses what the scorer would refuse.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

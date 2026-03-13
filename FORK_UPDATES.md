# Fork Updates

This file tracks all changes and updates made to this fork of the BikeTag monorepo.

---

## Audit — 2026-03-13

### Findings

Initial evaluation of the project identified the following outdated dependencies and tooling:

**Critical**
- Vite: 5.0.10 → latest 8.0.0 (3 major versions behind)
- Nuxt: 3.9.0 → latest 4.4.2 (major version behind; Nuxt 4 released Dec 2024)
- ESLint: 8.56.0 → latest 10.0.3 (v9+ deprecated the `.eslintrc` config format in use)
- TurboRepo: ~1.11.3 → latest 2.8.16 (major version behind)

**Moderate**
- TypeScript: `noUnusedLocals` and `noUnusedParameters` both set to `false` (allows dead code silently)
- `@types/node`: v20 (EOL) vs v22
- `vue-tsc`: 1.8.27 vs 2.1.0
- No `.nvmrc` file to pin Node version across environments

**Minor / Structural**
- Only `apps/docs` declares `"type": "module"` — other packages are inconsistent
- No `.prettierrc` config file — formatting relies on Prettier defaults
- Nuxt config is essentially empty

### Planned Updates — Monorepo (Priority Order)
1. ~~Add `.nvmrc` to pin Node version~~ ✓
2. ~~Upgrade Vite~~ ✓
3. ~~Migrate ESLint to flat config~~ ✓
4. ~~Upgrade TurboRepo~~ ✓
5. Plan Nuxt 4 migration

### Planned Updates — biketag-vue (Priority Order)
1. ~~Security vulnerabilities~~ ✓
2. ~~`bootstrap-vue-next` upgrade~~ ✓
3. ~~`@typescript-eslint` upgrade~~ ✓
4. ESLint 9 + flat config migration
5. `@netlify/functions` upgrade (2.x → 5.x)
6. Stylelint ecosystem upgrade
7. `vue-i18n` upgrade (9.x → 11.x)
8. Pinia upgrade (2.x → 3.x)
9. Replace `@serverless-jwt/jwt-verifier` with `jose` (fixes remaining jsonwebtoken CVEs)

---

## Update 1 — 2026-03-13

### Add `.nvmrc` + pin npm version

- Added [`.nvmrc`](.nvmrc) pinned to Node 22 (current Active LTS)
- Updated `packageManager` in [`package.json`](package.json) from `npm@10.1.0` → `npm@10.9.2`

**Why:** No `.nvmrc` meant different developers could run different Node versions, causing subtle environment inconsistencies. Node 22 is the current LTS and a safe upgrade from the implicit Node 18 target.

---

## Update 2 — 2026-03-13

### Upgrade Vite + related build tooling (`apps/web`)

- `vite`: `^5.0.10` → `^8.0.0`
- `@vitejs/plugin-vue`: `^5.0.2` → `^5.2.0`
- `vue-tsc`: `^1.8.27` → `^2.0.0`
- `@types/node`: `^20.10.6` → `^22.0.0`

**Why:** Vite was 3 major versions behind with significant performance improvements and security patches. Companion packages bumped to compatible versions.

---

## biketag-vue Audit — 2026-03-13

### Findings

Initial evaluation of `packages/biketag-vue` (the public-facing game app powering sites like boise.biketag.org):

**Critical**
- `swiper@11.x` — prototype pollution vulnerability (GHSA-hmx5-qpq5-p643), fixed in v12
- `@typescript-eslint` plugin + parser: 6.19.0 vs latest 8.x — 2 major versions behind
- `bootstrap-vue-next`: 0.15.5 vs 0.43.9 — ~28 minor versions behind
- 82 total vulnerabilities including 1 critical

**High**
- `@netlify/functions`: 2.x vs 5.x — 2 major versions behind
- `nodemailer`: 6.x vs 7.x — known CVEs (email DoS, unintended domain)
- `netlify-cli`: 22.x vs 24.x — nested vulnerability chain
- `@vue/eslint-config-typescript`: 12.x — incompatible with @typescript-eslint v8
- ESLint 8.x — flat config migration needed

**Medium**
- `vue-i18n`: 9.x vs 11.x
- Pinia: 2.x vs 3.x
- `@turf/turf`: 6.x vs 7.x
- `jose`: 5.x vs 6.x
- `@atproto/api`: 0.13.x vs 0.19.x
- No `.env.example` file for new developers

---

## Update 5 — 2026-03-13

### biketag-vue: Security vulnerability triage (`packages/biketag-vue`)

**Security fixes (82 → 33 vulnerabilities, 0 critical remaining):**
- `swiper`: `^11.0.5` → `^12.0.0` — fixes critical prototype pollution CVE
- `nodemailer`: `^6.9.8` → `^7.0.0` — fixes email DoS and unintended domain CVEs
- `netlify-cli`: `^22.3.0` → `^24.0.0` — fixes nested `ajv`, `diff`, `glob`, `h3`, `jws` CVEs
- Ran `npm audit fix --legacy-peer-deps` to resolve all auto-fixable transitive vulnerabilities

**Remaining 33 vulnerabilities (no critical):**
- 11 high — `jsonwebtoken` (via `@serverless-jwt/jwt-verifier`, needs app-level replacement with `jose`), `minimatch`, `serialize-javascript` (deep transitive, no safe auto-fix)
- 17 moderate + 5 low — all transitive, dev-only or non-exploitable in this context

---

## Update 6 — 2026-03-13

### biketag-vue: Upgrade `@typescript-eslint` + `bootstrap-vue-next`

- `bootstrap-vue-next`: `^0.15.5` → `^0.43.9`
- `@typescript-eslint/eslint-plugin`: `^6.19.0` → `^8.0.0`
- `@typescript-eslint/parser`: `^6.19.0` → `^8.0.0`
- `@vue/eslint-config-typescript`: kept at `^12.0.0` (v14 requires ESLint 9 which is a separate migration)

**Why:** `bootstrap-vue-next` was nearly 30 minor versions behind with likely broken Vue 3 component APIs. `@typescript-eslint` v6 is incompatible with TypeScript 5.x features and has known issues in stricter type-checking scenarios.

---

## Update 3 — 2026-03-13

### Migrate ESLint to flat config (v9)

- ESLint upgraded from `^8.56.0` → `^9.0.0` in root, `apps/web`, and `apps/docs`
- Rewrote [`packages/eslint-config-custom/vue.js`](packages/eslint-config-custom/vue.js) to ESM flat config using `eslint-plugin-vue` + `typescript-eslint`
- Rewrote [`packages/eslint-config-custom/nuxt.js`](packages/eslint-config-custom/nuxt.js) to ESM flat config using `typescript-eslint`
- Rewrote [`packages/eslint-config-custom/library.js`](packages/eslint-config-custom/library.js) to ESM flat config
- Added `"type": "module"` and `exports` map to [`packages/eslint-config-custom/package.json`](packages/eslint-config-custom/package.json)
- Created [`apps/web/eslint.config.mjs`](apps/web/eslint.config.mjs), [`apps/docs/eslint.config.js`](apps/docs/eslint.config.js), [`packages/ui/eslint.config.mjs`](packages/ui/eslint.config.mjs)
- Deleted old `.eslintrc.js` / `.eslintrc.cjs` files
- Removed `@rushstack/eslint-patch` and `@nuxtjs/eslint-config-typescript` (not compatible with flat config)
- Simplified `apps/web` lint script (flat config auto-detects file types, `--ext` flag no longer needed)

**Why:** ESLint v8's `.eslintrc` format is deprecated and will be removed. The flat config format is simpler, explicit, and fully supported in v9+.

---

## Update 4 — 2026-03-13

### Upgrade TurboRepo to v2

- Pinned `turbo` from `"latest"` → `"^2.0.0"` in root [`package.json`](package.json)
- Renamed `"pipeline"` → `"tasks"` in [`turbo.json`](turbo.json) (v2 breaking change)

**Why:** TurboRepo v2 renamed the top-level `pipeline` key to `tasks`. Using `"latest"` was also risky — a major version bump could silently break builds.

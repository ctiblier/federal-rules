# federal-rules.com — Claude Context

Federal Rules of Procedure reference site. Goal: surpass Cornell LII for practicing attorneys and law students.

**Repo:** `/home/ctibs/Projects/federal-rules/` → `github.com/ctiblier/federal-rules`
**Status:** Live on Cloudflare Pages (federal-rules.com)

---

## Multi-Site Framework

This site is part of a three-site legal reference system.
**See `/home/ctibs/Projects/CLAUDE.md`** for:
- Feature parity table (what features exist across all sites)
- Canonical implementation patterns
- Adding-a-feature checklist

### This site's adaptations of shared features

| Param | Value |
|-------|-------|
| Body class | `.rule-body` |
| Section anchor element | `p[id]` (injected by `rehype-subsection-anchors.mjs`) |
| Citation format | `Fed. R. Civ. P. 26(a)(1)` |
| Cross-ref URL | `/${ruleset}/${ruleNum}/` |
| Cross-ref regex | `Rule N(a)` + Bluebook (`Fed. R. Civ. P. N(a)`) |
| Search filter key | `ruleset` (values: civil, criminal, appellate, evidence, bankruptcy) |
| Pagefind filter attr | `data-pagefind-filter="ruleset:civil"` on `<article>` |

---

## Stack

- Astro 5 + Tailwind v4 (CSS `@theme` tokens — NOT `tailwind.config.mjs`)
- Pagefind (run after `astro build`)
- diff-match-patch for version diffs
- Cloudflare Pages (auto-deploys on push to main)

## Build

```bash
cd /home/ctibs/Projects/federal-rules
NODE_OPTIONS=--max-old-space-size=4096 npm run build
# package.json script runs: astro build && npx pagefind --site dist
```

`astro.config.mjs` has `build: { concurrency: 2 }`.

## Content Collections

Five rulesets: `civil`, `criminal`, `appellate`, `evidence`, `bankruptcy`
Path: `src/content/{ruleset}/`

Each rule: `current.md` + historical year files (e.g., `2024.md`)
Decimal rules named `rule-4.1.md` (not `4.1.md`) to avoid Astro ID collision.

## Content Update Workflow

```bash
# Run scraper (in FedRules repo):
cd /home/ctibs/Projects/FedRules/scraper
uv run python scripts/run_pipeline.py --output ../output --version 2025

# Copy to site:
cd /home/ctibs/Projects/federal-rules
./scripts/copy-content.sh /home/ctibs/Projects/FedRules/output/rules

# Deploy:
git add src/content/ && git commit -m "content: update rules" && git push
```

## Key Architecture

- `getStaticPaths` uses `entry.data.rule` (NOT `entry.id`) for routing — critical for decimal rules
- `rehype-subsection-anchors.mjs`: injects `id="a-1-A-i"` on `<p>` elements with subsection labels
- `stripMarkdown()` in `src/utils/markdown.ts` normalizes em-dash → `-` (prevents false diffs)
- `has_deadlines` frontmatter → gold "D" badge in sidebar (computed at build time)
- Sidebar rule number column: `w-12` (48px) — handles 4-digit decimal rules like `2007.1`

## Routes

- `/` — home page with 5 ruleset cards + search
- `/{ruleset}/` — rule index (e.g. `/civil/`)
- `/{ruleset}/{rule}/` — rule page (e.g. `/civil/26/`)
- `/{ruleset}/{rule}/{year}/` — historical version
- `/search/` — Pagefind search
- `/about/`, `/privacy/`

## Pending (from feature parity table)

- `@astrojs/sitemap` + Google Search Console submission

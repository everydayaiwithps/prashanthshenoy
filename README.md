# prashanthshenoy.com

Static site. No build step, no dependencies, no framework. Plain HTML, one stylesheet,
one small progressive-enhancement script. It works with JavaScript disabled.

---

## Deploying to GitHub Pages

1. Push the **contents** of this folder (not the folder itself) to the root of
   `github.com/everydayaiwithps/prashanthshenoy`. `index.html` must sit at the repo root.
2. Repo → **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch**,
   Branch: `main`, folder: `/ (root)`.
3. In the same panel, set **Custom domain** to `www.prashanthshenoy.com`.
   (The `CNAME` file in this repo already contains that value.)
4. Wait for the DNS check to pass, then tick **Enforce HTTPS**.

### DNS records to create at your registrar

Canonical host is `www`. The apex redirects to it.

| Type  | Name  | Value                        |
|-------|-------|------------------------------|
| CNAME | `www` | `everydayaiwithps.github.io` |
| A     | `@`   | `185.199.108.153`            |
| A     | `@`   | `185.199.109.153`            |
| A     | `@`   | `185.199.110.153`            |
| A     | `@`   | `185.199.111.153`            |

The four A records let `prashanthshenoy.com` (no `www`) resolve; GitHub then redirects it
to the canonical `www` host. If your registrar supports `ALIAS`/`ANAME` at the apex, you may
use `everydayaiwithps.github.io` there instead of the four A records.

**Expect a delay.** DNS propagation takes minutes to a few hours, and the TLS certificate is
issued only after that succeeds. A browser warning in the first hour is normal, not a fault.

`.nojekyll` is present so GitHub serves the files as-is rather than running them through Jekyll.

---

## Editing

| What you want to change            | Where                                    |
|------------------------------------|------------------------------------------|
| Any wording on the homepage        | `index.html`                             |
| A study's own page                 | `research/<slug>.html`                   |
| Publication metadata, in one place | `data/publications.json`                 |
| Colours, type, spacing             | `assets/css/site.css` (tokens at the top)|
| Behaviour                          | `assets/js/site.js`                      |

`data/publications.json` is the single source of truth for the research library.
Every field currently marked `CONFIRM` needs checking against the real publication record
before this site goes live.

### To add a publication

1. Add an entry to `data/publications.json`.
2. Copy `research/teacher-ai-adoption-tam-meta-analysis.html` to a new slug and fill it in,
   or ask for it to be generated from the JSON.
3. Add the summary block to the library section of `index.html`.

---

## Images

Both are in place. To regenerate either from a new source photograph, re-run
`images.ps1` (kept with the working files, not in this repo) or rebuild by hand:

- **`assets/img/portrait.jpg`** is 960×1200 (4:5), quality 88. Displayed at 240px, so this
  is sharp to 4× pixel density. If the file is ever missing, the page falls back to a
  monogram plate rather than a broken-image icon.
- **`assets/img/og-card.jpg`** is 1200×630, ~111 KB. The preview card that renders when the
  link is shared on WhatsApp or LinkedIn. Kept as JPEG deliberately: a heavy PNG makes some
  preview crawlers time out and fall back to a grey box.

## Still to confirm

Four entries in `data/publications.json` still carry `CONFIRM` markers on venue or status.
They must be resolved before launch. The site should never state a venue that has not been
verified.

---

## Conventions worth keeping

- **The four slots.** Every study is summarised as *The question · The study · The finding ·
  Why it matters*, in that order, in that voice. The consistency is what makes the library
  scannable; breaking it for one study costs more than it gains.
- **No first person in the research.** The study is the subject, not the author. Findings are
  co-authored with Mirka Saarela and impersonal voice states that honestly.
- **One URL per study.** Never collapse a study into a modal. It has to be linkable and
  indexable on its own.
- **Numbers are load-bearing.** Every figure on this site traces to a specific paper. Do not
  round, restate, or dramatise them.
- **No em dashes.** Anywhere: headlines, prose, metadata, code comments. Use a comma, a
  colon, a semicolon or a full stop instead. En dashes in numeric ranges (`2023–2025`,
  `97.9–98.6%`) and minus signs in intervals are not em dashes and stay as they are.

# prashanthshenoy.com

Static site. No build step, no dependencies, no framework. Plain HTML, one stylesheet,
one small progressive-enhancement script. It works with JavaScript disabled: the reveal
cards, the publication reveals, the FAQ and the mobile menu are all native
`<details>` elements, and the explainer carousels are CSS scroll-snap.

Rebuilt November 2026 from `ps-website content.md`, which is the content specification
and the source of truth for wording, statuses and figures.

---

## Pages

| Route                | What it carries                                                        |
|----------------------|------------------------------------------------------------------------|
| `index.html`         | Hero, proof bar, the nine-card finding feed, strands, positions, ongoing work, instruments |
| `research.html`      | The five strands in full, the eight positions, the 2027 to 2030 agenda, methods |
| `publications.html`  | All twelve papers grouped by status, plus the six ongoing studies at `#ongoing` |
| `work-with-me.html`  | Workshops, talks, advice, research partnership, FAQ                     |
| `about.html`         | First-person biography, the at-a-glance panel, ready-to-use bios for organisers |
| `contact.html`       | Enquiry form that composes an email, contact card                       |
| `research/<slug>.html` | Four long-form explainers with charts, one per study                  |
| `work-with-ps.html`  | Redirect only. The old enquiry page, kept so old links do not break.    |

`sitemap.xml` and `robots.txt` sit at the root. Add any new page to the sitemap.

---

## Deploying to GitHub Pages

1. Push the **contents** of this folder (not the folder itself) to the root of
   `github.com/everydayaiwithps/prashanthshenoy`. `index.html` must sit at the repo root,
   and the `assets`, `research` and `data` folders must go up with it.
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
to the canonical `www` host. If your registrar supports `ALIAS` or `ANAME` at the apex, you
may use `everydayaiwithps.github.io` there instead of the four A records.

**Expect a delay.** DNS propagation takes minutes to a few hours, and the TLS certificate is
issued only after that succeeds. A browser warning in the first hour is normal, not a fault.

`.nojekyll` is present so GitHub serves the files as-is rather than running them through Jekyll.

### After deploying

Submit `https://www.prashanthshenoy.com/sitemap.xml` in Google Search Console and Bing
Webmaster Tools. Indexing, not design, is what the traffic depends on.

---

## Editing

| What you want to change              | Where                                     |
|--------------------------------------|-------------------------------------------|
| Headlines and cards on the home page | `index.html`                              |
| A strand, a position, the agenda     | `research.html`                           |
| A paper, its summary or its status   | `publications.html` and `data/publications.json` |
| Workshops, talks, advice, FAQ        | `work-with-me.html`                       |
| Biography and the at-a-glance panel  | `about.html`                              |
| The enquiry form and its options     | `contact.html`                            |
| A study's own explainer              | `research/<slug>.html`                    |
| Colours, type, spacing               | `assets/css/site.css` (tokens at the top) |
| Behaviour                            | `assets/js/site.js`                       |

`data/publications.json` is the record of the underlying papers. No page is generated from
it, so treat it as the reference for venues, statuses and citations and keep it in step by
hand when a status changes.

### To add a publication

1. Add an entry to `data/publications.json`.
2. Add a `.pub` block to the right status group in `publications.html`, with the reveal.
3. If it deserves a hook, add a `.card` to the `feed` grid in `index.html`: one strand
   label, one number, one curiosity headline, one sentence.
4. If it is published, add a `ScholarlyArticle` entry to the JSON-LD block in the head of
   `publications.html`, and the URL to `sitemap.xml` if it gets its own explainer page.

---

## Images

- **`assets/img/portrait.jpg`** is 960x1200 (4:5), quality 88. Displayed at up to 272px, so
  this is sharp well past 2x pixel density. If the file is ever missing, the page falls back
  to a monogram plate rather than a broken-image icon.
- **`assets/img/og-card.jpg`** is 1200x630. The preview card that renders when the link is
  shared on WhatsApp or LinkedIn. Kept as JPEG deliberately: a heavy PNG makes some preview
  crawlers time out and fall back to a grey box.

---

## Conventions worth keeping

- **No em dashes and no en dashes.** Anywhere: headlines, prose, metadata, code comments,
  JSON. Use a comma, a colon, a full stop, or the word "to" in a range ("2027 to 2030").
- **British spelling.** Programme, behaviour, synthesise.
- **Status labels are fixed.** Published, Accepted, Under review, In progress, In design,
  Proposed. Nothing else, and never a venue that has not been confirmed.
- **Numbers are load-bearing.** Every figure traces to a specific paper. Do not round,
  restate or dramatise them. A curiosity headline is allowed; an unsupported claim is not.
- **The four slots, on explainer pages only.** Each one carries *The question, The study,
  The finding, Why it matters*, in that order. The consistency is what makes the set
  scannable.
- **No first person in the research itself.** On explainer pages the study is the subject,
  not the author. The work is co-authored with Dr. Mirka Saarela and the impersonal voice
  states that honestly. Page copy elsewhere is first person.
- **One URL per study.** Never collapse a study into a modal. It has to be linkable and
  indexable on its own.
- **Reveals must be native.** Anything that opens on click uses `<details>`, so it still
  opens with JavaScript off and still gets indexed.

---

## Local preview

There is no build step, but `file://` breaks the relative paths, so serve the folder. Any
static server will do. On a machine with neither Python nor Node, a few lines of PowerShell
with `System.Net.HttpListener` is enough.

# Site tools

The pages of https://mengyuan-l.github.io/ are hand-written HTML, and the HTML is canonical. `build.py` regenerates only the parts that are derived from data, and its `--check` mode verifies the whole site before a commit. It needs Python 3.9 or later and no packages.

This folder is not published: GitHub Pages builds the site with Jekyll, which skips folders whose names start with `_` (`_tools/`, `_data/`).

## Commands

Run both from the repository root (or give the full path to the script):

```sh
python3 _tools/build.py           # rewrite the generated outputs, then list any site problems
python3 _tools/build.py --check   # change nothing; exit 1 if anything below fails
```

`--check` fails when:

- a generated output is out of date (run the build to fix it);
- a link to this site, relative or absolute (`https://mengyuan-l.github.io/…`), points to a missing file or `#anchor`. This covers links, images, stylesheets and alternate links on every page, the Markdown links in `llms.txt`, and the `url`, `item`, `image` and `@id` values in JSON-LD (an `@id` may instead name a node in the JSON-LD of the page it points to, such as the homepage's `#person`);
- a JSON-LD block does not parse;
- the publication ids in `_data/publications.json`, the list on `index.html` and the JSON-LD disagree;
- a paper entry on a topic page differs from its record in `_data/publications.json`: the title, the title's link (the DOI or one of the record's links), the authors, the venue, the disclosures, a note or the link row;
- a public page lacks `<title>`, the meta description, the canonical link, or `og:title`, `og:description`, `og:type`, `og:url`, `og:image`;
- `sitemap.xml` misses a public page, lists a file that does not exist, or lists a page that should not be indexed (one marked `noindex`, such as `404.html`, or one whose canonical link points elsewhere, such as the `sept_lab.html` redirect);
- the Web-Stat counter snippet in the `index.html` footer was changed (it must stay byte-for-byte);
- a Markdown file sits at the repository root (Jekyll would publish it as a page).

The build prints the same site problems as warnings but does not fail on them.

## What the build writes

| Output | Generated from | Notes |
|---|---|---|
| `index.html`, between `<!-- BEGIN publications … -->` and `<!-- END publications -->` | `_data/publications.json` | Year index, legend and one entry per record, newest year first; papers from before 2024 share one "Before 2024" group (`EARLIER` in `build.py`), with the year beside each venue tag; records of kind `preprint` form a final "Preprints" group in a quieter style. Each entry's `id` is the record id, so `index.html#crossline-ccs21` stays a stable link. |
| `index.html`, between `<!-- BEGIN json-ld (generated) -->` and `<!-- END json-ld -->` | `_data/profile.json`, `_data/publications.json` | Schema.org graph: ProfilePage, WebSite, Person, USC and both departments, SEPT Lab, verifiable.pro, and one ScholarlyArticle or Thesis per publication (`@id` = page URL + `#id`). The page name comes from `<title>`; `dateModified` comes from `date_modified` in `profile.json` if present, otherwise from the homepage `<lastmod>` in `sitemap.xml`. |
| `index.html`, the "Earlier news" label | the `<time datetime>` values inside `<details class="more">` | Becomes, for example, "Earlier news, 2021–2024". |
| `files/bib/<id>.bib` | `_data/publications.json` | One BibTeX entry per record. A record with `bibtex.file` is written to that path instead (`files/hollow-llm.bib`). Stray files in `files/bib/` are removed. |
| `files/publications.bib` | `_data/publications.json` | All entries in one file. |
| `llms-full.txt` | the `<main>` element of each page in `PAGES` | Markdown for AI agents. A page without `<main>` is read from `<body>`. Elements marked `data-export="skip"`, buttons and visually hidden text are left out. |

Everything outside these regions is yours to edit. Edits inside a generated region are overwritten by the next build.

## Common edits

**Add or correct a publication.** Edit `_data/publications.json`, then run the build and the check. Records are listed newest first, and their order within a year is the display order. The fields are:

- `id` (stable anchor), `title`, `authors`, `equal_contribution` (names marked `*`), `venue`, `venue_short` (the label in the margin), `year`;
- top-level `students`: `names` are shown in bold in the homepage list (besides the owner), and `note` explains it above the list;
- `kind`: `conference`, `workshop`, `journal`, `preprint` or `thesis`. Workshop, journal, preprint and thesis entries get a small type label under the venue tag, unless the tag already says it;
- `doi`: becomes the first link, labelled DOI. `links` holds the other links in display order, each a `label` and a `url`; BibTeX is appended automatically;
- `doi_pending`: a DOI that is printed in the paper but not yet registered. The build ignores it, so the entry links arXiv or its other links instead; rename it to `doi` once `https://doi.org/<doi>` resolves;
- `award`, `award_detail` and `award_links`, shown as one brick line; `disclosures` (vendor bulletins, CVEs); `notes` (text plus an optional link); `acceptance` written as `57/407 = 14.0%`;
- `bibtex`: the citation `key`, plus `pages`, `journal`, `volume`, `number` and an optional `file` path;
- `arxiv` and `dblp` identifiers, and `themes` topic tags (`tee`, `attacks`, `verifiable-ai`, `agent-security`). The build uses `arxiv` in the JSON-LD and for preprint BibTeX.

Never change an existing `id`; other pages, news items and external sites link to it.

The three topic pages (`tee-confidential-computing.html`, `verifiable-ai.html`, `ai-agent-security.html`) repeat some entries by hand, with a page-specific summary; update them too. `--check` lists every hand-copied entry that no longer matches its record.

**Post news.** Edit the news list in `index.html`. Each item is `<li class="m"><time class="side" datetime="2026-10">Oct 2026</time><p>…</p></li>`. Move older items into the `<details class="more">` list; the build updates its label.

**Edit any page's text.** Edit the HTML, then run the build, which refreshes `llms-full.txt`, and the check.

**Add a page.**

1. Copy the `<head>`, header, breadcrumb and footer from an existing subpage such as `verifiable-ai.html`, and change the title, description, canonical, `og:` tags and JSON-LD. Subpages have no Web-Stat counter; it stays on `index.html` only.
2. Add the page to `PAGES` in `build.py` so `llms-full.txt` includes it.
3. Add it to `sitemap.xml` and, if it matters to agents, to `llms.txt`.
4. Run the build and the check.

**Update the SEPT Lab or verifiable.pro icon.** The icons beside these links reuse each site's own mark. `assets/img/verifiable-pro.svg` is a copy of verifiable.pro's favicon. `assets/img/sept-lab.png` is SEPT Lab's header mark (`assets/img/sept-mark-240.png` in the lab site's repository), exported at 48 × 48 px with transparent side padding, the same composition as the lab's favicons. It is shown at about 16 px, so the 48 px export stays sharp on 3× phone screens. When the lab changes its mark, export it again on a Mac:

```sh
sips -s format png -Z 48 path/to/sept-mark-240.png --out /tmp/sept-mark-48.png
sips -p 48 48 /tmp/sept-mark-48.png --out assets/img/sept-lab.png
```

**Favicon.** The site icon is the letter M from Literata at weight 800 (the typeface of the page text), in the brick accent. `assets/img/favicon.svg` switches to the lighter dark-mode brick under `prefers-color-scheme: dark`. The other files are exports of it: `assets/img/favicon-32.png` for older browsers, `assets/img/apple-touch-icon.png` (180 px on white) for iPhone home screens, and `favicon.ico` (16, 32 and 48 px) at the root for PDFs and other files that browsers open without a page. The links in each page's `<head>` end in `?v=2`; raise the number whenever the icon changes, so browsers fetch the new one instead of a cached copy.

## Shared stylesheet and script

`assets/css/site.css` is the single stylesheet for every page. Its header comment lists the building blocks (margin rows, section heads, paper entries, project lists, course facts, tables, breadcrumb, 404 message). The colors are custom properties at the top. Light mode uses a white page, and dark mode a neutral near-black (#141414). The brick accent appears only at text level: links, a small label and thin rules.

The two typefaces, Literata (text) and Libre Franklin (navigation, labels, link rows), are self-hosted in `assets/fonts/`: the latin subsets that Google Fonts serves, under the SIL Open Font License (`assets/fonts/OFL.txt`). The `@font-face` rules are at the top of `site.css`. Pages load no third-party stylesheet or font, so they render even where Google's servers are slow or blocked.

`assets/js/site.js` holds two progressive enhancements: the light/dark toggle, and scrolling a keyboard-focused link fully into view inside a sideways-scrolling table. Every page works without it. Each page also carries a one-line script at the top of `<head>`, after the `theme-color` metas and before the stylesheets, that applies a saved theme and its `theme-color` before the first paint. Keep that script inline, since moving it into a file would make the page flash in the wrong theme.

## Notes for AI agents

- Treat the HTML as the source of truth for prose and `_data/*.json` as the source of truth for publications and identity facts. Do not hand-edit generated regions, `files/bib/`, `files/publications.bib` or `llms-full.txt`; change the source and rebuild.
- Run `python3 _tools/build.py --check` before proposing a commit, and report any problem it lists.
- Do not add Markdown files at the repository root, and keep the Web-Stat snippet in the `index.html` footer unchanged.

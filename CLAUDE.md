# reminder

Personal cheat sheets published as a local MkDocs Material site, in French (default) and English. Commands: `mise run serve`, `mise run build` (strict, must pass before any commit).

## Rule: every change is bilingual

- Each page exists as `page.md` (French) and `page.en.md` (English), side by side. A change in one file is made in the other in the same commit.
- Exception: `docs/knowledge/expressions.md` is bilingual by nature (French and English side by side) and exists only in French. The English site serves it through `fallback_to_default`, and the `.no-lang-switch` marker in the page disables the language switcher there (`docs/javascripts/ux.js`).
- A new page needs both files, a `nav` entry in `mkdocs.yml` (French file name) under the right group, an English title in `nav_translations` when the title differs, a card in `docs/index.md` and `docs/index.en.md` under the matching `###` group (Knowledge groups: Code, API et sécurité, Exploitation, Qualité et outils, IA, Culture; Culture holds IT and company culture: seminal texts, eponymous laws, organization; other non technical pages go in Divers), and a line in the same group of `README.md`.
- Links between pages use the French file name (`sql.md`, never `sql.en.md`). Anchors use the slug of the heading in the language of the page.
- Exception: MkDocs does not rewrite links inside raw HTML (`<a href>` of the badges), so `href="sql.md#x"` gives a 404. In raw HTML, point to the built URL: `href="../sql/#x"`, for links to the same page too. `mkdocs build --strict` does not catch these, check the built `site/` for broken `href`.

## Rule: disclaimer on every page

- Every page (`page.md` and `page.en.md`, home included) starts, right after its `#` title, with the same `!!! warning "Avertissement"` / `!!! warning "Disclaimer"` box: personal notes, not a source of truth, subjective despite the quotes, may be wrong or outdated, check the official documentation, provided as is without warranty. Copy it from an existing page, word for word. The README carries the French version too. The repo is under CC BY 4.0 (`LICENSE`), and `copyright` in `mkdocs.yml` repeats the no-warranty line in every page footer.

## Rule: update the card date

- Each home card shows the date of the last change to any page it links to: `*:material-calendar-check: Mis à jour le DD/MM/YYYY*` in `docs/index.md`, `*:material-calendar-check: Updated on YYYY-MM-DD*` in `docs/index.en.md`.
- When a page changes, update the date of its card in both files, in the same commit. Only that card: the others keep their date.
- A section whose content depends on the date (benchmarks, tool features, spec status) carries its own `!!! info` box with the date it was written.

## Rule: page style

- Write for someone who does not know the topic: define each term the first time it appears, then give a concrete example (code, command, tree, timeline, table), then a "when to use what" table.
- Each concept, pattern or model in an architecture-related section carries scale badges right under its heading: `<a class="pill pill-scope pill-scope-<code|app|system|infra|enterprise|all>" href="../architecture/#carte-des-echelles">Échelle · Code</a>` (English: `../architecture/#map-of-scales`, `Scale · Code`). Code, Application, Système, Infrastructure, Entreprise, as defined in the map of scales in `architecture.md`; a word whose meaning changes with the scale goes in its table.
- Every page that carries scale badges has, right after the disclaimer, the `!!! abstract "Les échelles"` / `!!! abstract "Scales"` box that redefines the five scales in one line each. Copy it from an existing page.
- Each concept, pattern, model or framework answers three questions: **when** to apply it (signals, and when not to), **why** (the problem it solves, the gain and the cost), **how** (steps, a concrete example). A definition alone is not enough.
- An improvement or correction to an answer goes into the answer itself, never in a separate review box: the page shows one coherent answer, not an answer plus an addendum.
- Content stays generic: it is written for anyone preparing for the role, not for the author. No personal career details. Advice is written in the first person ("je prépare une histoire vécue", "je cite mes propres chiffres"), and example numbers are flagged as examples.
- Every page uses hover definitions for the technical terms a newcomer would not know (the expressions page excepted). Mark a term at most once per `##` section, never in headings, code, links or the disclaimer.
- Hover definitions: wrap a term as `<span class="term" data-term="id">texte</span>` and define `id` in `docs/javascripts/terms-data.js` (`window.REMINDER_TERMS.fr` and `.en`: `term`, `definition`, `example`, `example_is_code`). One id per meaning (`interface-code` is not `interface-ui`). Every definition comes with an example, as code when the term is a code concept.
- The first section of a page that defines its terms is titled `## Vocabulaire` / `## Terminology`. Never "Les mots de base" or "Basic terms": too beginner-sounding.
- Every source, article, book, standard or specification mentioned carries its date, discreetly, in the text itself: `RFC 9449, publiée en 2023`, `Will Larson, "Staff Engineer" (2021)`, `OWASP API Security Top 10 (édition 2023)`, `(révision de juillet 2026)`. In source lists, the date goes in parentheses at the end of the link text. If the date is unknown, write so ("date de publication non indiquée").
- Mark facts that may age or that were not verified first-hand ("à vérifier", "to check") and add sources as links.
- Any figure that should be taken with caution says so in the page itself, next to the figure, with the reason: `[À prendre avec précaution : ...]` / `[Take with caution: ...]`. Typical reasons: preprint not peer-reviewed, read through a secondary summary, vendor's own numbers, no official source found, estimates that disagree. A table of figures gets a "Fiabilité de la source" / "Source reliability" column.

## Rule: user-friendly wording

- Voice: first person everywhere, "je" / "I" (and "mon", "mes", "my"), never "tu" / "you". "Je veux..." tables continue their header the same way.
- Describe a situation from the reader's side: who needs what, in which context, then a concrete named example ("comme...", "like..."). Never a compressed technical label.
- Decision tables (`Situation`, `Je veux...`, `Besoin`, `Quand` columns): the situation cell is a full sentence with an example, the answer cell stays short. Lookup tables (HTTP codes, methods, definitions) stay terse.
- Paragraphs: start from the person and their problem ("j'ai...", "mon équipe veut..."), then the notion that solves it, with a concrete example. Short sentences, everyday words, the consequence spelled out ("donc l'appli plante"), no stacked jargon.
- Before: `plusieurs écrans (mobile, web) qui composent les mêmes données différemment`. After: `j'ai plusieurs consommateurs aux besoins différents, sur un site web ou sur une appli mobile, qui veulent des combinaisons différentes des mêmes données : la liste des commandes du site affiche le client, l'adresse et le détail des articles, celle de l'appli seulement le numéro, le statut et le total`.

## Rule: diagrams and reference docs

- Draw a concept whenever a picture explains it better than text, in the style of its official doc or original author. Mermaid for flows, sequences, states, graphs, class and ER diagrams; inline SVG only for shapes Mermaid cannot draw (Venn, pyramids, maps), using the `.set`, `.hit`, `.layer-1/2/3` classes of `extra.css` inside `<figure>` (several side by side in `<div class="diagram-grid">`, one wide in `<figure class="diagram">`), with no blank line inside the HTML block.
- Each notion ends with one reference line to the most recognized online doc for it (official doc, RFC, original author), dated like any source: `:material-book-open-variant: Doc de référence : [Titre](url) (version 18, 2025)` / `Reference docs:`, followed by `{ .doc-ref }` on the next line. Living docs without a date say `(consultée en novembre 2026)` / `(accessed November 2026)`.
- Check new URLs before committing (curl, or a browser for sites that block bots) and that every Mermaid block parses.

## Rule: "As noob" boxes

- Abstract, jargon-heavy or often misunderstood notions get a `!!! noob "As noob"` box (same title in both languages), placed right after the paragraph that introduces the notion: 2 to 4 sentences, an everyday picture, then the takeaway in bold. The analogy must stay accurate; say its limit when it has an important one.
- Not on plain notions, term lists, tables of choices or source lists, and never inside another admonition.

## Rule: tool relations

- The first mention of a tool on a page (or right under its own heading) carries an italic line: `*Playwright : concurrent de Cypress, Selenium ; complémentaire de Checkly*` / `*Playwright: competes with Cypress, Selenium; complements Checkly*`, labels `concurrent de`, `concurrent en partie de`, `complémentaire de`, `remplace`, `remplacé par`, several tools joined with `<br>`, then `{ .tool-rel }` on its own line. The full map lives in `outils.md#complementaires-ou-concurrents`; keep both in sync.

## Rule: code examples in several languages

- Pages that show the same example in several programming languages (design patterns) use `pymdownx.tabbed` tabs labelled exactly `PHP`, `Python`, `Java`. The `content.tabs.link` feature switches every tab set of the site to the language the reader picked.

## Rule: status tags

- Each notion whose validity can age (practice, pattern, standard, tool, flow, spec) carries a small status pill right under its heading, on the same line as its scale badges when there are some: `<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>` or `<span class="pill pill-status pill-status-obsolete" title="Remplacé par ...">Obsolète · 11/2026</span>` (English: `Current` / `Obsolete`, title in English). The date is the month the status was checked; the title says why. Not on vocabulary, history, people or laws that cannot go out of date.

## Rule: standard closing sections

- Every page (expressions excepted) ends, before its sources, with `## Pièges à éviter` / `## Pitfalls to avoid` (5 to 8 first-person bullets: the mistake, its consequence, what to do instead) and `## Ce qu'on demande en entretien` / `## What interviews ask` (typical questions as quotes, then how to answer, with links to the page's sections).

## Rule: verdict comments in code examples

- In every code or config block (not Mermaid, JSON, Markdown, CLI output or logs), a one-line comment above each function, method, class, query or meaningful block tells the reader what they are looking at, with a fixed label: `À éviter :` / `Avoid:`, `Bien :` / `Good:`, `Ce qui change :` / `What changes:` (the "after" of a before/after pair), `Exemple :` / `Example:` (neutral). Same comment in every language tab and in both page languages.

## Rule: believable examples

- An example must describe something a developer would recognise as really happening, with the cause-and-effect mechanism stated (which code is shared, which call fails, what the user sees). No far-fetched link such as "changing the logo breaks the VAT calculation" without the shared code that makes it happen.

## Rule: typography

No em dash, no en dash and no Unicode arrow anywhere (pages, commits, README). Use a colon, a comma, parentheses or words. Box-drawing characters in trees and diagrams are fine.

## Rule: no employer traces

This repo is personal. No company name, internal product or service name, colleague name, Jira key, internal URL or work email. Use fictitious names (`my-api`, `orders-service`, `ada`, `grace`, `team-core`). Before committing, grep the diff for the employer's name, its internal prefixes and its domain.

## Rule: git

- Commit as `Vincent Baticle <vincentbaticle@users.noreply.github.com>` (set in the local git config).
- Conventional commits, with a `Co-Authored-By` trailer when Claude writes the commit.
- Commit and push to `main` directly: the repo is private, no MR needed.

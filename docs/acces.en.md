# Access the site

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

The site runs on my machine. It is not published online, so the content stays private, like the repo.

## Terminology

- **MkDocs**: the tool that turns the Markdown files in `docs/` into a website. **Material** is its theme (colors, search, dark mode).
- **mise**: the tool that installs the right Python version for this project and runs its commands (`mise run serve`), defined in `mise.toml`.
- **Virtual environment (`.venv`)**: a folder holding the Python libraries of this project only, without touching the rest of the machine.
- **`127.0.0.1` and port**: `127.0.0.1` (or `localhost`) means my own machine. The port (`8100`) is the number of the "door" the site listens on. Two programs cannot use the same port at the same time.
- **GitHub Pages**: the GitHub service that hosts a static site from a repository.
- **Workflow (GitHub Actions)**: a file in `.github/workflows/` that runs tasks automatically, for example publishing the site on every push.

## First time

Prerequisites: `git` and [mise](https://mise.jdx.dev/).

```
$ git clone https://github.com/vincentbaticle/reminder.git
$ cd reminder
$ mise trust
$ mise run serve
```

`mise` installs Python, creates a `.venv` virtual environment in the repo and installs MkDocs. Then it starts the site.

Open [http://127.0.0.1:8100/en/](http://127.0.0.1:8100/en/).

## Next times

```
$ cd reminder
$ git pull
$ mise run serve
```

The site reloads by itself when I change a file in `docs/`.

## Languages

The site exists in French and English. The language button (translate icon) in the header switches between them.

| Language | Address                          | Files           |
|----------|----------------------------------|-----------------|
| French   | `http://127.0.0.1:8100/`         | `page.md`       |
| English  | `http://127.0.0.1:8100/en/`      | `page.en.md`    |

The `mkdocs-static-i18n` plugin builds both versions.

## Commands

| I want to...                                       | Command           |
|----------------------------------------------------|-------------------|
| read the site locally                              | `mise run serve`  |
| check that no link is broken                       | `mise run build`  |
| reinstall the dependencies                         | `mise run install`|

## Add a page

1. Create the French Markdown file in `docs/knowledge/`, for example `docker.md`.
2. Create its English translation next to it, with the `.en.md` suffix: `docker.en.md`.
3. Add it to the `nav` section of `mkdocs.yml` (with the French file name), and its English title in `nav_translations` if the title differs.
4. Add its card on the home page, in `docs/index.md` and `docs/index.en.md`, with today's date.
5. `mise run build` to check, then commit and push.

Without a `.en.md` file, the English version shows the French page.

## Change a page

1. Change the French page **and** its English version (`page.md` and `page.en.md`).
2. Update the date of its card on the home page, in both languages:
   ```
   docs/index.md      *:material-calendar-check: Mis à jour le 21/10/2026*
   docs/index.en.md   *:material-calendar-check: Updated on 2026-10-21*
   ```
   Only that card changes date: the date shows the last change to any of the card's pages.
3. `mise run build`, then commit and push.

These rules are also written in `CLAUDE.md` at the root of the repo, so the assistant applies them by itself.

## Port 8100 is already taken

The site listens on port 8100 rather than 8000, MkDocs' default port: 8000 and 8001 are often taken by APIs running in Docker. The sibling interview preparation site uses 8101. If 8100 is taken anyway, pick another free port:

```
$ lsof -nP -iTCP:8100 -sTCP:LISTEN
$ mise exec -- mkdocs serve -a 127.0.0.1:8102
```

## Why not GitHub Pages

On a personal GitHub account, a GitHub Pages site is **always public**, even if the repo is private. To publish anyway, a deployment workflow would be needed, knowing that the whole content would be visible to anyone.

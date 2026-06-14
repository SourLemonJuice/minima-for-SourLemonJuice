# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal fork of the Jekyll [minima](https://github.com/jekyll/minima) theme, customized for SourLemonJuice's blog. Unlike upstream, **this fork is not published as a gem**. It is consumed by the author's blog via `jekyll-remote-theme` (pointing at the `@stable` branch). The `minima.gemspec` still exists but is only built in CI as a smoke test.

The fork's specific changes are documented in Chinese in `README_FORK.md` — read it before touching layouts, includes, or the date/meta logic, since it explains intent that is not obvious from the templates.

**Keep `README_FORK.md` in sync.** Whenever you add or change a config key, variable, or behavior — especially anything that breaks compatibility with upstream minima — update `README_FORK.md` in the same change to document it. When you author a section there yourself, mark it with a "Collaborate with Claude Code" sign so it's clear the section was written with Claude Code.

## Commands

```sh
script/bootstrap   # gem install bundler && bundle install
script/server      # bundle exec jekyll serve --config _config_theme-dev.yml (http://localhost:4000)
script/build       # bundle exec jekyll build --config _config_theme-dev.yml
script/cibuild     # build, assert _site/index.html exists, then gem build minima.gemspec
```

All dev commands run against `_config_theme-dev.yml`, **not** `_config.yml`. The theme has no test suite — `script/cibuild` is the only verification, and it passes if the demo site builds and the gem packages.

CI (`.github/workflows/ci.yaml`) runs `script/cibuild` against Jekyll `~> 3.9` and `~> 4.2`. Set `JEKYLL_VERSION` to test a specific version locally (the `Gemfile` reads it; `~> 3.9` also pulls in `kramdown-parser-gfm`).

Keep command calls simple. Avoid writing to log files (especially under `/tmp`) and tailing them to monitor long-running background tasks — use the internal Monitor tool to stream events instead.

## Architecture

Standard Jekyll theme layering. Layouts derive from `base.html` via front matter (`layout: base`); the derived layout's content is injected at `{{ content }}`. `_includes` are reusable snippets pulled into layouts. `_sass` holds styles, compiled through `assets/css/style.scss`.

Skins are the color-palette system. `assets/css/style.scss` imports `minima/skins/{{ site.minima.skin }}` then `minima/initialize`. A skin file defines color variables plus syntax-highlighting rules. `initialize.scss` pulls in (in order) `custom-variables` → `_base` → `_layout` → `custom-styles`. The two `custom-*.scss` files are override hooks: **`custom-variables.scss` can only override variables/mixins, `custom-styles.scss` can only override styles** — they are imported at different points and cannot cross over.

**The two `custom-*.scss` hooks are reserved for the theme's downstream user (the blog author), not for fork features.** Keep them as empty placeholders. When you add a fork feature's styles, put them in `_layout.scss` (structure/components) or `_base.scss` (element resets/typography) like any other built-in style — do not write them into `custom-styles.scss` or `custom-variables.scss`, or you'll clobber the user's own overrides and blur the line between theme and user code.

## Fork-specific conventions

These diverge from upstream minima; preserve them when editing:

- **Override-hook includes**: `custom-head.html` (extra `<head>` metadata) and `custom-footer.html` (content shown above social links, below the bio). These exist as deliberate user-extension points.
- **Modified-date display** (`_layouts/post.html`, `home.html`): driven by `page.has_modified` and `page.mdate`. `has_modified: true` or `mdate: file` pulls the timestamp from the `jekyll-last-modified-at` plugin; otherwise `page.mdate` is used as a literal date. `has_modified` takes priority over `mdate`.
- **Meta tags** (`_includes/head.html`): three mechanisms, kept for backward compat. `page.noindex: true` emits `<meta name="robots" content="noindex">`; `page.robots: <value>` emits an arbitrary robots content string; `page.meta_tags` is a list of `{name, content}` for arbitrary tags. Both `noindex` and `robots` (but not `meta_tags`) trigger the "robot blocking tags enabled" note in `post.html`.
- **`site.minima.rainbow_header`**: the header strip is always a standalone `.header-bar` element (rendered above `.site-header` in `header.html`), gray by default. When true, adds the `rainbow` class (`.header-bar.rainbow`) to swap the gray background for a pride-flag gradient. `.site-header` itself has no `border-top`.
- **`site.minima.contacts`**: a list of `{url, text}` links rendered next to the email in the footer.
- **`site.minima.date_format_no_hour`**: date format for timestamps without an hour component (e.g. post publish dates derived from the filename).
- **Sticky table of contents** (`_includes/post-toc.html`, included by `_layouts/post.html`): a `position: sticky` TOC in the left gutter beside the centered article. On wide viewports the post `.wrapper` becomes a symmetric 3-column grid (`1fr | $content-width | 1fr`) so the article stays centered while the TOC is a real in-flow item in the left column — that's what makes `sticky` work, and it's bounded by the article height so it never overlaps the footer. The grid is gated by `.wrapper:has(> .post-toc:not([hidden]))`, so non-post pages and unbuilt TOCs are unaffected. Built client-side — an inline script (deferred to `DOMContentLoaded`, since the include sits before `<article>`) scans `h2/h3/h4` in `.post-content`, generates anchor links, and runs an `IntersectionObserver` for scroll-spy (`.is-active`). Hidden until it finds ≥2 headings. Styles live in `_layout.scss` under the "Sticky table of contents" heading; `$toc-breakpoint` is derived from `$content-width` so the grid turns off (article goes full-width) when the gutters won't fit, and the TOC's `top` is coupled to the same hardcoded `61px` header height as `.site-header`/`.page-content`. Authors opt out per-post with `toc: false`.
- **`slj-dev-build-warning.html`**: included in `base.html` to flag dev builds.

## Things to watch

- Use tools to read and analyze files and walk through directories instead of using bash command as much as possible.
- Date format defaults appear inline in templates (`"%b %-d, %Y"`); keep them consistent across `post.html` and `home.html`.
- Comments (Disqus) and Google Analytics only render when `JEKYLL_ENV=production`. Per-post `comments: false` disables comments.
- **This fork intentionally makes breaking changes against upstream minima.** Do not assume upstream minima documentation, the upstream README, or web search results about minima apply here — variable names, config keys, layouts, and behaviors may differ or be removed. Verify against this repo's own source (templates, `_sass/`, and `README_FORK.md`) before relying on any minima convention.
- **Branch workflow**: `main` is where experimental, possibly-breaking work happens. The author's real blog pins to the `@stable` branch via `jekyll-remote-theme`. Do not merge or fast-forward `stable` into `main` (or otherwise move `stable`) to pick up in-progress work — only promote features to `stable` when they are ready and the user explicitly asks for it.

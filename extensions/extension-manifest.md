# Extension Manifest

Each extension must include a `manifest.yaml` file that describes how it should be loaded.

## Example

```yaml
id: my-extension
name: My Extension
version: 1.0.0
author: Your Name
icon: https://website.com/favicon.ico

main: index.js
type: anime                       # anime | manga | novel | torrent

language: en
nsfw: false
skip_default_processing: false
exact_results: false              # torrent only, see below

settings:
  - key: mirror
    label: Mirror
    type: select                  # string | number | boolean | select | multiselect
    default: "website.com"
    options:
      - label: Website.com
        value: "website.com"
      - label: Website.net
        value: "website.net"
```


:::info When to use `skip_default_processing`
Enable this only if **all content provided by your extension** cannot be matched to standard databases (Anilist, MyAnimeList or Kitsu).

**Use this for:**
- Fully fan-made or unofficial sources
- Doujinshi-only sites
- Content outside typical anime/manga/novel databases
- Sources with completely non-standard naming
:::

:::info When to use `exact_results`
Torrent extensions only. Enable it when your extension looks up results by ID (using `filters.ids` and `filters.episode`) instead of by title. Hoshi then calls `search()` once and skips title matching, since every result is already for the requested episode.
:::

## Settings

Each setting needs a `key`, a `label`, a `type` and a `default`. `select` and `multiselect` also need `options`.

## Settings Usage

Settings are available in your code via [`__settings`](./sandbox#settings):

```js
const mirror = __settings.mirror;
```
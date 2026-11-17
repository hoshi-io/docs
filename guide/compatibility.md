---
title: Compatibility Layers
description: Support for LNReader plugins and Stremio addons
---

# Compatibility Layers

Compatibility layers let you use extensions built for other apps directly inside Hoshi, with no extra installation.

Two are supported: LNReader plugins and Stremio addons.

## LNReader plugins

LNReader plugins map really well onto how this app works. All their features have an equivalent here, so most plugins should just work out of the box.

To use them, add an LNReader plugin repository URL in the marketplace, the same way as a Hoshi marketplace.

If a specific extension doesn't work, it's usually one of two things:
- the source website is down, or
- the extension itself is broken upstream.

Neither of those is something I can fix on my end. I only fix issues caused by my own glue code (the part that connects the extension to the app), not the extensions themselves.

## Stremio addons

Stremio addons work as torrent sources for anime. Paste the addon URL in the marketplace, under **Stremio addon** (desktop and Android TV). You can paste either the `https://` or the `stremio://` version of the link.

- **Anime only.** Hoshi looks up streams using the anime's Kitsu ID, or its MAL ID if the addon doesn't support Kitsu. Addons that only use IMDb IDs (most movie and series addons) won't return anything.
- **Configure first.** If the addon has a configuration page (like Torrentio, Comet or AIOStreams), configure it on its website and paste the URL it gives you, not the plain one.
- **Debrid works.** If your configured addon returns direct links from a debrid service, they play directly, without a torrent.

Your preferences from **Settings → Torrent** (release groups, resolution, codec and so on) still apply to Stremio results.

::: warning Season packs
Some addons return a whole season pack when asked for one episode. Hoshi picks the right file by its name, which can occasionally pick the wrong one.
:::

## Dropped layers

Tachiyomi, Aniyomi and Sora extensions were supported experimentally in earlier versions. Support was removed because they needed too much work to keep running, and the results weren't reliable enough.

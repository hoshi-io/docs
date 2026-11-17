# General FAQ
Frequently Asked Questions.

## Is hoshi stable?
hoshi is still in early development.  
Some features may be incomplete, buggy, or subject to change as the project evolves.

## Are all features the same on every platform?
Most of the app works identically everywhere, but a couple of things are desktop-only for now.

On desktop, everything is fully supported. Discord Rich Presence and the Extension IDE are desktop-only, so they aren't available on Android, Android TV or iOS.

iOS and macOS support is experimental: neither has been tested on real hardware yet.

## How does the extension system work?
Extensions allow hoshi to connect to external content sources.

They act as plugins that can:
- Provide additional sources for existing tracked content
- Add entirely new content that isn’t available on trackers (e.g. doujinshi)

This gives you flexibility in where your media comes from while keeping the core app lightweight.

Torrent extensions (and [Stremio addons](/guide/compatibility#stremio-addons)) just give episode sources for anime content, they can't add content to the app.

## Are extensions safe to run?
Extensions run in a sandboxed environment and are isolated from the core app to reduce risk.

Extensions do not have access to your app data or your OS.

## Why are translations inaccurate?
All non-English translations are AI-generated.

They may include mistakes or awkward phrasing. If accuracy matters, use the English version when available.

## Why doesn’t the Chinese title option apply everywhere?
This is a current limitation, but now should be applied everywhere but on search results.

## Does my data sync across devices?
No, hoshi does not provide built-in cross-device syncing for local data.

However, if you connect a tracker like AniList, MyAnimeList, Simkl, Kitsu, Shikimori, MangaBaka or MangaUpdates, your progress will sync through those services.

Local lists remain device-specific.
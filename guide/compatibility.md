---
title: Compatibility Layers
description: Support for LNReader, Tachiyomi, and Aniyomi extensions
---

# Compatibility Layers

This release adds support for three new compatibility layers, letting you use extensions originally built for other apps directly inside this one.

## LNReader plugins

LNReader plugins map really well onto how this app works. All their features have an equivalent here, so most plugins should just work out of the box.

If a specific extension doesn't work, it's usually one of two things:
- the source website is down, or
- the extension itself is broken upstream.

Neither of those is something I can fix on my end. I only fix issues caused by my own glue code (the part that connects the extension to the app), not the extensions themselves.

## Tachiyomi & Aniyomi extensions

These two work the same way under the hood, so I'm covering them together.

**Heads up: this is very early and experimental.** Right now, only a small percentage of extensions will work, and some of those may still have issues. This will keep improving over time as I update the underlying compatibility shim, but for now, please treat it as a beta feature.

For Aniyomi extensions specifically: nothing works yet. Support is in place, but it needs more work before any extension will actually function correctly.

The good news is that the app supports almost everything of what tachiyomi extensions can do, extension settings, search filters, and most other features map over and are usable. What I can't promise yet is that any given extension will fully work end-to-end. For some, search might work but reading won't; for others, nothing will load at all. It really varies extension by extension right now.


### Works everywhere, not just Android
Even though Tachiyomi and Aniyomi extensions are normally Android-only (they ship as APKs), once translated to JavaScript they run the same way on any platform this app supports, desktop included, no extra install needed. If iOS support gets added down the line, the same would apply there too. So this effectively brings that whole extension ecosystem outside of Android.

### How it works

For the curious: extensions for these two are separate Android apps (APKs). The app translates that code into JavaScript, then run it inside the app's sandboxed environment, using a large "shim" layer that mimics the parts of the Android/Tachiyomi/Aniyomi APIs those extensions expect.

That shim is what's incomplete right now, which is why support is fragile. As it gets fleshed out, more extensions should start working without needing any changes on the extension side.

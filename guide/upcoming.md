# Upcoming Features

Hoshi is mostly feature-complete, so don't expect big new features for now.

The main thing I'm looking into is improving performance on Linux, where the system webview is noticeably slower than on other platforms. The options I'm weighing are:

- **Waiting for CEF in Tauri:** Tauri v3 is expected to support CEF (Chromium) as a webview, which would replace the slow system webview once it's stable.
- **A native desktop UI:** rebuilding the desktop interface with a native UI toolkit instead of a webview.

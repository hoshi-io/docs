# Torrent Extension

Torrent extensions extend `Torrent` and give episode sources for anime that is already in the app. They can't add new content.

The only base method shared is `getFilters()`.

## Example

```js
class MyTorrent extends Torrent {

    async search(query, filters, page) {
        return [
            {
                id: "",
                title: "Naruto",
                magnet: null,
                size: null,
                seeders: null,
                leechers: null,
                isBatch: false
            }
        ];
    }

    async getMagnet(id) {
        return "magnet:?xt=urn:btih:...";
    }
}
```

## `search(query, filters, page)`

Besides your own filters, `filters` always includes the IDs of the anime being watched:

```js
{
    ids: { anilist: "21", mal: "21", kitsu: "12" }, // only the ones Hoshi knows
    episode: 5,
    movie: false
}
```

Use them for ID-based lookups, and set [`exact_results`](../extension-manifest) in the manifest if your results are already for the requested episode.

Each result needs `id` and `title`. Everything else is optional, but the more you fill in, the better Hoshi can pick a release for the user. Results are checked against these types, and a wrong type (e.g. `seeders: "5"`) fails the whole search:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `magnet` | string | Magnet URI. If missing, `getMagnet()` is called |
| `url` | string | Direct `http(s)` link to the video (e.g. debrid). Played directly, without a torrent |
| `infoHash` | string | Torrent info hash |
| `size` | string | Human-readable size, e.g. `"1.4 GB"` |
| `sizeBytes` | number | Size in bytes |
| `seeders` / `leechers` | number | Peer counts |
| `isBatch` | boolean | `true` if it contains several episodes |
| `releaseGroup` | string | e.g. `"SubsPlease"` |
| `resolution` | string | e.g. `"1080p"` |
| `episodeNumber` | number | Episode the result is for |
| `date` | string | Release date |

## `getMagnet(id)`

This function only gets called if the search result does not return the magnet. It must return a `magnet:` URI.

---

:::details Full template
```js
class MyTorrent extends Torrent {

    async search(query, filters, page) {
        return [
            {
                id: "",
                title: "",
                magnet: null,
                size: null,
                seeders: null,
                leechers: null,
                isBatch: false
            }
        ];
    }

    async getMagnet(id) {
        return "magnet:?xt=urn:btih:...";
    }
}
```
:::
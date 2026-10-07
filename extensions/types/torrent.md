# Anime Extension

Torrent extensions extend `Torrent` and add torrent-related methods.

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

## `getMagnet()`

This function only gets called if the search result does not return the magnet.

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
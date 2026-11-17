# Sandbox APIs

Extensions run inside a [QuickJS](https://bellard.org/quickjs/) sandbox. It provides a small, browser-like set of APIs: `fetch`, `URL`, `URLSearchParams`, `atob`, `btoa`, `console` and `setTimeout`, plus a few Hoshi helpers for HTML parsing, headless browsing, state and crypto.

This is **not** a full browser or Node.js environment. There is no DOM, no modules and no access to the filesystem. See below for exact behavior and differences.

## Limits

Every call into your extension (one `search()`, one `findEpisodes()`, etc.) runs in a fresh sandbox with these limits:

| Limit | Value |
| ----- | ----- |
| Total time per call | 25 seconds |
| Single `fetch()` | 20 seconds |
| Single `headless.fetch()` | 20 seconds |
| Single `setTimeout` delay | 30 seconds (still bound by the 25 second total) |
| Memory | 64 MB |
| Stack size | 512 KB |

When the 25 second deadline is reached, the script is interrupted and the call fails. Requests still pending return a timeout error.

:::info One file, one class
Your extension is a single script. `import`, `export` and `require` are not available. Hoshi loads the first `class X extends Y` it finds, where `Y` is one of `Anime`, `Manga`, `Novel` or `Torrent`.
:::

## `fetch(url, options)`

Works like the browser `fetch`, with some differences.

```js
const res = await fetch("https://example.com/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: "naruto" }),
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

**Options:**
- `method`: `GET`, `POST`, `PUT`, `DELETE` or `PATCH`. Anything else is sent as `GET`.
- `headers`: a plain object.
- `body`: a string, or a `FormData` (sent as `application/x-www-form-urlencoded`).

**Response:**

```js
res.ok           // true for 2xx
res.status       // HTTP status code
res.url          // final URL, after redirects
res.headers.get("content-type")  // case-insensitive, null if missing
res.cookies      // { name: value } from the Set-Cookie headers
await res.text()
await res.json()
await res.arrayBuffer()
```

:::warning Differences from the browser
- `res.headers` has `get`, `has`, `keys`, `entries` and `forEach`, and can be iterated. Repeated headers are joined with `", "`.
- The body is always read as text. `arrayBuffer()` is built from that text, so binary responses (images, archives) can come back corrupted.
- Redirects are followed automatically.
- There is no `AbortController` and no `Request`/`Response`/`Headers` classes.
:::

### `fetchSync(url, options)`

A blocking version of `fetch` for places where async code is inconvenient. It takes the same options.

```js
const res = fetchSync("https://example.com/page");
res.ok       // boolean
res.status   // number
res.url      // final URL, after redirects
res.text     // string (a property, not a function)
res.headers  // same as fetch
res.cookies  // { name: value }
```

## `parseHTML(html)`

Parses an HTML string and returns a `$` function to query it with CSS selectors, similar to jQuery or `document.querySelectorAll`.

```js
const $ = parseHTML(htmlString);
const items = $("ul.results li");
```

`$()` returns an array of matched elements, so `map`, `filter`, `forEach` and `length` work as usual. Each element has:

```js
el.text()        // text content, including children
el.html()        // inner HTML
el.outer()       // outer HTML
el.attr("href")  // attribute value, or null
el.find("span")  // query inside this element
```

The array also has shorthand methods:

```js
$("h1").text()       // combined text of all matches
$("h1").html()       // inner HTML of the first match, or null
$("a").attr("href")  // attribute of the first match, or null
```

### Selectors

Standard CSS selectors work, including the `>`, `+` and `~` combinators and comma-separated groups. These extra pseudo-classes are also supported:

| Pseudo-class | Matches elements that |
| ------------ | --------------------- |
| `:contains(text)` | contain `text` in their text content |
| `:containsData(text)` | contain `text` in their raw data (e.g. inside `<script>`) |
| `:has(selector)` | have a descendant matching `selector` |
| `:not(selector)` | don't match `selector` |

```js
const script = $("script:containsData(sources)").html();
const next   = $("a:contains(Next)").attr("href");
```

**Example: scraping a list**

```js
const res = await fetch("https://example.com/archive");
const $   = parseHTML(await res.text());

const links = $("article a.title").map(el => ({
    title: el.text().trim(),
    url:   el.attr("href"),
}));
```

## `headless`

A hidden browser for pages that need JavaScript to load their content (SPAs, client-rendered sites, pages behind a JS challenge).

Use it only when `fetch()` returns incomplete or empty HTML. It's much slower than `fetch()`.

```js
if (!headless.available) {
    throw new Error("Headless browser is not available");
}

const page = await headless.fetch("https://example.com/page", {
    waitFor: ".results",
});

const $ = parseHTML(page.html);
```

### Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `waitFor` | When to read the page, see below | `"dom_ready"` |
| `javascript` | Code to run in the page before reading it. Its return value (or resolved promise) comes back as `result` | none |
| `block` | Resources to block: `"images"`, `"fonts"`, `"media"`, `"stylesheet"`, or any URL substring | `[]` |
| `capture` | URL substrings. Matching `fetch()` calls made by the page are recorded in `captured` | `[]` |
| `timeoutMs` | How long to wait for the page. Values under 15000 are raised to 15000 | `15000` |

Common ad and tracking domains are always blocked. The page is always loaded with a plain `GET`.

### `waitFor`

```js
"dom_ready"      // read the page as soon as it loads (default)
"network_idle"   // wait 5 seconds after load
".selector"      // wait until the element exists (recommended)
```

A selector is the most reliable option. If the element doesn't appear within 10 seconds, the page is read as it is.

### Result

```js
page.url        // final URL
page.html       // full page HTML
page.result     // return value of `javascript`, or { error } if it threw
page.captured   // [{ url, method, status, body, headers }]
page.cookies    // [{ name, value }]
```

### Example

```js
const page = await headless.fetch("https://example.com/app", {
    waitFor: ".results-loaded",
    block: ["images", "fonts"],
    javascript: `document.querySelectorAll(".item").length`,
    capture: ["/api/data"],
});

const count   = page.result;
const apiData = JSON.parse(page.captured[0]?.body ?? "null");
const session = page.cookies.find(c => c.name === "session_id")?.value;
```

:::info
`capture` only records requests the page makes with `fetch()`. Requests made with `XMLHttpRequest` are not captured.
:::

## `__settings`

A frozen object with the current values of the settings defined in your [manifest](./extension-manifest). Users change them from the extension's settings in the app.

```js
const mirror = __settings.mirror ?? "website.com";
```

## `state`

A key-value store that keeps data between calls of your extension, for things like session tokens or cached lookups. Values must be JSON-serializable.

```js
state.set("token", "abc-123");
state.get("token");              // "abc-123"
state.get("missing", "default"); // "default"
state.has("token");              // true
state.keys();                    // ["token"]
state.delete("token");

state.update("counters", (c) => {
    c.views = (c.views || 0) + 1;
    return c;
}, { views: 0 });
```

:::warning Not saved to disk
State lives in memory. It's kept while the app is running and is cleared when the app restarts or the extension is uninstalled. Don't rely on it for anything that has to survive a restart.
:::

Each call only writes back the keys it changed, so two calls running at the same time don't overwrite each other's keys.

## `crypto`

Built-in cryptographic utilities. No imports needed.

:::warning Hex in, hex out
AES keys, AES data and HMAC keys are bytes, passed as hex strings. Convert strings with `crypto.hex.fromString()` first.
:::

### Hashing

Input is a string (hashed as UTF-8), output is lowercase hex.

```js
crypto.md5("hello")     // "5d41402abc4b2a76b9719d911017c592"
crypto.sha1("hello")    // "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"
crypto.sha256("hello")  // "2cf24db..."
crypto.sha512("hello")  // "9b71d224..."
```

### HMAC

Key is hex, data is a plain string. Returns hex.

```js
const key = crypto.hex.fromString("my-secret");
crypto.hmac.sha1(key, "message")
crypto.hmac.sha256(key, "message")
crypto.hmac.sha512(key, "message")
```

### AES-CBC

Key, data and IV are hex. The key length picks the variant: 16 bytes for AES-128, 32 bytes for AES-256. Data is padded with PKCS#7, so it doesn't need to be block-aligned.

```js
const key = crypto.hex.fromString("1234567890abcdef"); // 16 bytes → AES-128
const iv  = crypto.hex.fromString("abcdef1234567890"); // 16 bytes

const encrypted = crypto.aes.encrypt(key, crypto.hex.fromString("hello world"), { iv });
const decrypted = crypto.aes.decrypt(key, encrypted, { iv });

crypto.hex.toString(decrypted) // "hello world"
```

| Option | Values | Default |
| ------ | ------ | ------- |
| `iv`   | hex string, 16 bytes | 16 zero bytes |
| `mode` | `"cbc"` or `"gcm"` | `"cbc"` |

### AES-GCM

Same key sizes. The IV (nonce) is required and must be 12 bytes. The output has the authentication tag at the end, and decryption fails if the data was tampered with.

```js
const nonce = crypto.hex.fromString("unique-nonce"); // 12 bytes, never reuse with the same key

const encrypted = crypto.aes.gcm.encrypt(key, data, { iv: nonce });
const decrypted = crypto.aes.gcm.decrypt(key, encrypted, { iv: nonce });
```

Invalid keys, IVs or data throw an `Error`.

### Hex helpers

```js
crypto.hex.fromString("hello")    // "68656c6c6f"
crypto.hex.toString("68656c6c6f") // "hello"
crypto.hex.fromBase64("aGVsbG8=") // "68656c6c6f"
crypto.hex.toBase64("68656c6c6f") // "aGVsbG8="
```

`fromString` and `toString` work on single-byte characters (Latin-1). Non-ASCII text like `"é"` or `"日本"` is not converted to UTF-8 bytes.

## Timers

```js
await new Promise(r => setTimeout(r, 1000));
```

- `setTimeout` **blocks** for the given time and then runs the callback. Nothing else runs while it waits.
- `clearTimeout` has no practical effect, since the callback has already run by the time `setTimeout` returns.
- `setInterval` is not supported and throws.

For polling, use `waitUntil`. It calls your function until it returns something other than `undefined`, `null` or `false`, and throws if the timeout is reached:

```js
const data = await waitUntil(async () => {
    const res = await fetch("https://example.com/status");
    const json = await res.json();
    return json.ready ? json : null;
}, { interval: 1000, timeout: 10000 }); // defaults: 500ms, 10s
```

## Other globals

- **`console`:** `log`, `info`, `warn`, `error` and `debug`. Objects are printed as JSON. See [Debugging](./getting-started#debugging) for where logs show up.
- **`URL`:** parses `http` and `https` URLs, with an optional base: `new URL("/path", "https://example.com")`. Exposes `href`, `origin`, `protocol`, `host`, `hostname`, `port`, `pathname`, `search`, `hash` and `searchParams`. Properties are read-only: changing one doesn't update `href`.
- **`URLSearchParams`:** built from a query string or an object. Keys are unique, so `append` replaces an existing value and `getAll` returns at most one value.
- **`atob` / `btoa`:** Base64 decode and encode on binary strings.
- **`FormData`:** `append`, `get` and `has`. Only useful as a `fetch` body.
- Standard JavaScript built-ins (`JSON`, `Math`, `Date`, `RegExp`, `Promise`, `Map`, `Set`, typed arrays, etc.).

## What's not available

- No DOM (`document`, `window`). Use `parseHTML` or `headless`
- No `WebSocket` or `XMLHttpRequest`
- No `TextEncoder` / `TextDecoder`
- No `import`, `export` or `require`, and no Node.js built-ins (`fs`, `path`, `Buffer`, etc.)
- No access to the host machine, the filesystem or the app's data

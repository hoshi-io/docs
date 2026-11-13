# Manga Extension

Manga extensions extend `Manga`.

Base methods like `search()`, `getMetadata()` and `getFilters()` work the same as in Base Extension.

## Example

```js
class MyManga extends Manga {
  async findChapters(contentId) {
    return [
      {
        id: "chapter-1-en",
        title: "Chapter 1",
        number: 1,
        index: 0,
        language: "en",
        scanlators: ["Alpha Scans"]
      },
      {
        id: "chapter-1-es",
        title: "Capítulo 1",
        number: 1,
        index: 1,
        language: "es",
        scanlator: "Traducciones Sol"
      }
    ];
  }

  async findChapterPages(chapterId) {
    return [
      {
        url: "https://example.com/page1.jpg",
      }
    ];
  }
}
```

## `findChapters(contentId)`

- `id` is required and used in `findChapterPages()`
- `title` is required
- `number` what user sees, decimals allowed.
- `index` is used for ordering (0 = first, no decimal)
- `language` optional, language code of the chapter (`"en"`, `"es"`, `"pt-br"`). Lowercase codes are recommended, they are shown uppercased.
- `scanlators` optional, groups that released the chapter (`["Group A", "Group B"]`)
- `scanlator` optional, single string alternative to `scanlators`. `"A & B"` or `"A, B"` is split into groups. Ignored if `scanlators` is set.

### Multiple languages / scanlators

Return every version of a chapter as its own entry, with the same `number` and a different `id`. Hoshi groups them by `number`:

- the chapter list shows a language and scanlator filter when there is more than one of each
- the reader keeps the language and scanlator of the chapter being read when going to the next one, and falls back to another version if the chapter doesn't exist in it
- progress is tracked by `number`, so switching version keeps it

Extensions without these fields work as before: one chapter per `number`.

## `findChapterPages(chapterId)`

- pages should be in reading order

---

:::details Full template
```js
class MyManga extends Manga {
    async getFilters() {
        return {};
    }

    async search(query, filters, page) {
        return [{
            id: "",
            title: "",
            image: null,
            url: null,
            nsfw: false
        }];
    }

    async getMetadata(id) {
        return {
            title: "",
            synopsis: null,
            image: null,

            eps_or_chapters: null,
            rating: null,
            year: null,

            genres: [],

            nsfw: false,

            anilist_id: null,
            mal_id: null,

            external_ids: {}
        };
    }

    async findChapters(contentId) {
        return [{
            id: "",
            title: "",
            number: 1,
            index: 0,
            language: null,
            scanlators: null
        }];
    }

    async findChapterPages(chapterId) {
        return [{
            url: "",
        }];
    }
}
```
:::
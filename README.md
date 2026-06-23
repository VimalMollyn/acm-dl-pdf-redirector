# ACM DL PDF Redirector

A small Chrome extension for the [ACM Digital Library](https://dl.acm.org).

## What it does

When you're not signed in, ACM DL's **PDF / eReader** button opens papers in
ACM's native in-browser viewer via a `/doi/epdf/...` URL. This extension swaps
`epdf` for `pdf`, so papers open as raw PDFs (`/doi/pdf/...`) in your browser's
default PDF viewer instead.

For example:

```
https://dl.acm.org/doi/epdf/10.1145/3654777.3676455   ->   https://dl.acm.org/doi/pdf/10.1145/3654777.3676455
```

## How it works

Two complementary mechanisms, both scoped to `dl.acm.org`:

- **`content.js`** rewrites `/doi/epdf/` links to `/doi/pdf/` in the page (and
  keeps doing so as the page updates), so hovering, copying the link, opening in
  a new tab, and clicking all go to the PDF version.
- **`rules.json`** (a `declarativeNetRequest` redirect rule) is the backstop: it
  redirects any navigation to `/doi/epdf/` over to `/doi/pdf/`, even if the
  navigation isn't a plain link click.

## Install (unpacked, for development)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and select this folder.
4. Visit a paper, e.g. <https://dl.acm.org/doi/10.1145/3654777.3676455>, and
   click the **PDF** button — it should open the raw PDF in your default viewer.

If you change any files, return to `chrome://extensions` and click the reload
icon on the extension card.

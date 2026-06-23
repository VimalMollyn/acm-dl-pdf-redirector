// ACM DL PDF Redirector
//
// ACM's Digital Library points its "PDF / eReader" button at /doi/epdf/...,
// which opens the paper in ACM's native in-browser viewer. Swapping "epdf"
// for "pdf" yields the raw PDF (/doi/pdf/...), which the browser opens in its
// own default PDF viewer.
//
// This content script rewrites those links in place so that hovering, copying
// the link, opening in a new tab, and plain clicks all go to the PDF version.
// A declarativeNetRequest rule (rules.json) is the backstop that catches any
// navigation to /doi/epdf/ that isn't a rewritten anchor (e.g. JS-driven nav).
(function () {
  "use strict";

  var EPDF = "/doi/epdf/";
  var PDF = "/doi/pdf/";

  function rewriteLink(a) {
    // a.href resolves relative URLs to absolute, so this also handles
    // href="/doi/epdf/..." attributes.
    if (a.href && a.href.indexOf(EPDF) !== -1) {
      a.href = a.href.replace(EPDF, PDF);
    }
  }

  function rewriteAll(root) {
    var links = root.querySelectorAll('a[href*="/doi/epdf/"]');
    for (var i = 0; i < links.length; i++) {
      rewriteLink(links[i]);
    }
  }

  // Initial pass over whatever is already in the DOM.
  rewriteAll(document);

  // ACM DL renders a lot dynamically, so keep watching for new or changed
  // links and rewrite them as they appear.
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];

      if (m.type === "attributes" && m.target instanceof HTMLAnchorElement) {
        rewriteLink(m.target);
      }

      for (var j = 0; j < m.addedNodes.length; j++) {
        var node = m.addedNodes[j];
        if (node instanceof HTMLAnchorElement) {
          rewriteLink(node);
        } else if (node instanceof Element) {
          rewriteAll(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href"],
  });
})();

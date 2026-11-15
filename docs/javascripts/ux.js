/**
 * Reading comfort helpers: the site name in the header always links to the home page of the current language,
 * paragraphs made of a single bold label ("**Réponse générique**") get the `section-label` class,
 * switching language keeps the reading position (both languages share the same block structure),
 * pages that contain a `.no-lang-switch` marker (bilingual by nature) get a disabled language switcher,
 * very tall Mermaid diagrams are scaled down so that one diagram does not fill several screens,
 * search results get a small flag showing their language (the search index holds both languages),
 * a thin bar under the header shows how far the reader is in the page,
 * and the home page "random page" button opens one of the cards at random.
 */
(function () {
  const POSITION_KEY = "reminder-reading-position";
  const READING_OFFSET = 120;
  const DIAGRAM_MAX_HEIGHT = 560;
  const DIAGRAM_MIN_ZOOM = 0.65;

  function articleBlocks() {
    const article = document.querySelector(".md-content article");
    return article ? Array.from(article.children) : [];
  }

  function pageTop(element) {
    return element.getBoundingClientRect().top + window.scrollY;
  }

  function readingPosition() {
    const blocks = articleBlocks();
    const line = window.scrollY + READING_OFFSET;
    const index = blocks.findIndex(function (block) {
      return pageTop(block) + block.offsetHeight > line;
    });
    if (index < 0) {
      return { count: blocks.length, index: -1, ratio: 0, scroll: window.scrollY };
    }
    const block = blocks[index];
    const ratio = block.offsetHeight > 0 ? Math.max(0, line - pageTop(block)) / block.offsetHeight : 0;
    return { count: blocks.length, index: index, ratio: ratio, scroll: window.scrollY };
  }

  function rememberPositionOnLanguageSwitch() {
    document.querySelectorAll(".md-select__link[hreflang]").forEach(function (link) {
      link.addEventListener("click", function () {
        const position = readingPosition();
        position.target = new URL(link.href, window.location.href).pathname;
        try {
          sessionStorage.setItem(POSITION_KEY, JSON.stringify(position));
        } catch (error) {
          console.warn("Reading position not saved", error);
        }
      });
    });
  }

  function restorePosition() {
    let position = null;
    try {
      position = JSON.parse(sessionStorage.getItem(POSITION_KEY) || "null");
      sessionStorage.removeItem(POSITION_KEY);
    } catch (error) {
      console.warn("Reading position not restored", error);
    }
    if (!position || position.target !== window.location.pathname || window.location.hash) {
      return;
    }
    const blocks = articleBlocks();
    const block = blocks[position.index];
    if (blocks.length !== position.count || !block) {
      window.scrollTo(0, position.scroll || 0);
      return;
    }
    window.scrollTo(0, pageTop(block) + position.ratio * block.offsetHeight - READING_OFFSET);
  }

  function linkHeaderTitle() {
    const logo = document.querySelector(".md-header__button.md-logo");
    const home = document.querySelector(".md-header__title .md-header__topic:first-child");
    if (!logo || !home) {
      return;
    }
    home.setAttribute("role", "link");
    home.setAttribute("tabindex", "0");
    home.addEventListener("click", function () {
      window.location.href = logo.href;
    });
    home.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        window.location.href = logo.href;
      }
    });
  }

  function markSectionLabels() {
    document.querySelectorAll(".md-typeset p > strong:only-child").forEach(function (strong) {
      const paragraph = strong.parentElement;
      if (paragraph.textContent.trim() === strong.textContent.trim()) {
        paragraph.classList.add("section-label");
      }
    });
  }

  function disableLanguageSwitchWhenBilingual() {
    if (!document.querySelector(".no-lang-switch")) {
      return;
    }
    const link = document.querySelector(".md-select__link[hreflang]");
    const option = link ? link.closest(".md-header__option") : null;
    if (!option) {
      return;
    }
    const message = document.documentElement.lang.startsWith("en")
      ? "Bilingual page: the language switcher is disabled"
      : "Page bilingue : le changement de langue est désactivé";
    option.classList.add("lang-switch--disabled");
    option.setAttribute("title", message);
    option.setAttribute("aria-disabled", "true");
    option.querySelectorAll("a, button").forEach(function (element) {
      element.setAttribute("tabindex", "-1");
      element.addEventListener("click", function (event) {
        event.preventDefault();
      });
    });
  }

  function fitTallDiagrams() {
    if (!("ResizeObserver" in window)) {
      return;
    }
    const observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        const diagram = entry.target;
        const height = entry.contentRect.height;
        if (diagram.dataset.fitted || height <= DIAGRAM_MAX_HEIGHT) {
          return;
        }
        diagram.dataset.fitted = "true";
        diagram.style.zoom = Math.max(DIAGRAM_MIN_ZOOM, DIAGRAM_MAX_HEIGHT / height).toFixed(2);
        observer.unobserve(diagram);
      });
    });
    function watch(root) {
      root.querySelectorAll("div.mermaid").forEach(function (diagram) {
        observer.observe(diagram);
      });
    }
    const content = document.querySelector(".md-content");
    if (!content) {
      return;
    }
    watch(content);
    new MutationObserver(function () {
      watch(content);
    }).observe(content, { childList: true, subtree: true });
  }

  function siteRoot() {
    const config = document.getElementById("__config");
    let base = ".";
    try {
      base = JSON.parse(config.textContent).base || ".";
    } catch (error) {
      console.warn("Site base not found", error);
    }
    return new URL(base.replace(/\/?$/, "/"), window.location.href).pathname;
  }

  function resultLanguage(link, root) {
    const path = new URL(link.href, window.location.href).pathname;
    const relative = path.startsWith(root) ? path.slice(root.length) : path;
    return relative === "en" || relative.startsWith("en/") ? "en" : "fr";
  }

  function flagSearchResults() {
    const list = document.querySelector(".md-search-result__list");
    if (!list) {
      return;
    }
    const root = siteRoot();
    const english = document.documentElement.lang.startsWith("en");
    const labels = english
      ? { fr: "Result in French", en: "Result in English" }
      : { fr: "Résultat en français", en: "Résultat en anglais" };
    function decorate() {
      list.querySelectorAll("a.md-search-result__link").forEach(function (link) {
        const article = link.querySelector(".md-search-result__article--document");
        if (!article || article.querySelector(".lang-flag")) {
          return;
        }
        const language = resultLanguage(link, root);
        const flag = document.createElement("span");
        flag.className = "lang-flag lang-flag--" + language;
        flag.setAttribute("role", "img");
        flag.setAttribute("aria-label", labels[language]);
        flag.title = labels[language];
        article.prepend(flag);
      });
    }
    new MutationObserver(decorate).observe(list, { childList: true, subtree: true });
  }

  function showReadingProgress() {
    if (!document.querySelector(".md-content article h2")) {
      return;
    }
    const bar = document.createElement("div");
    bar.className = "reading-progress";
    document.body.appendChild(bar);
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      bar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function wireRandomPage() {
    const button = document.querySelector(".hero__random");
    const links = Array.from(document.querySelectorAll(".grid.cards a[href]"));
    if (!button || links.length === 0) {
      return;
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const pick = links[Math.floor(Math.random() * links.length)];
      window.location.href = pick.href;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireRandomPage();
    flagSearchResults();
    showReadingProgress();
    disableLanguageSwitchWhenBilingual();
    linkHeaderTitle();
    markSectionLabels();
    rememberPositionOnLanguageSwitch();
    fitTallDiagrams();
  });

  window.addEventListener("load", restorePosition);
})();

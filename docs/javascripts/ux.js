/**
 * Reading comfort helpers: the site name in the header always links to the home page of the current language,
 * paragraphs made of a single bold label ("**Réponse générique**") get the `section-label` class,
 * switching language keeps the reading position (both languages share the same block structure),
 * pages that contain a `.no-lang-switch` marker (bilingual by nature) get a disabled language switcher,
 * and very tall Mermaid diagrams are scaled down so that one diagram does not fill several screens.
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

  document.addEventListener("DOMContentLoaded", function () {
    disableLanguageSwitchWhenBilingual();
    linkHeaderTitle();
    markSectionLabels();
    rememberPositionOnLanguageSwitch();
    fitTallDiagrams();
  });

  window.addEventListener("load", restorePosition);
})();

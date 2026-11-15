/**
 * Hover and focus definitions for terms marked with <span class="term" data-term="id">.
 * Definitions come from window.REMINDER_TERMS (terms-data.js), keyed by language then id.
 */
(function () {
  const LABELS = { fr: "Exemple", en: "Example" };
  let popup = null;
  let current = null;

  function language() {
    return (document.documentElement.lang || "fr").slice(0, 2);
  }

  function entryFor(id) {
    const all = window.REMINDER_TERMS || {};
    const byLang = all[language()] || all.fr || {};
    return byLang[id];
  }

  function render(entry) {
    const box = document.createElement("div");
    box.className = "term-popup";
    box.setAttribute("role", "tooltip");
    const title = document.createElement("strong");
    title.textContent = entry.term;
    const def = document.createElement("p");
    def.textContent = entry.definition;
    box.append(title, def);
    if (entry.example) {
      const label = document.createElement("p");
      label.className = "term-popup__label";
      label.textContent = LABELS[language()] || LABELS.fr;
      box.append(label);
      if (entry.example_is_code) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = entry.example;
        pre.append(code);
        box.append(pre);
      } else {
        const ex = document.createElement("p");
        ex.textContent = entry.example;
        box.append(ex);
      }
    }
    return box;
  }

  function hide() {
    if (popup) popup.remove();
    popup = null;
    current = null;
  }

  function show(el) {
    const entry = entryFor(el.dataset.term);
    if (!entry || current === el) return;
    hide();
    popup = render(entry);
    document.body.append(popup);
    const rect = el.getBoundingClientRect();
    const width = popup.offsetWidth;
    const left = Math.min(Math.max(8, rect.left + window.scrollX), window.scrollX + document.documentElement.clientWidth - width - 8);
    let top = rect.bottom + window.scrollY + 6;
    if (rect.bottom + popup.offsetHeight + 12 > window.innerHeight) {
      top = rect.top + window.scrollY - popup.offsetHeight - 6;
    }
    popup.style.left = left + "px";
    popup.style.top = top + "px";
    current = el;
  }

  function bind(root) {
    root.querySelectorAll(".term[data-term]").forEach(function (el) {
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      el.setAttribute("tabindex", "0");
      el.addEventListener("mouseenter", function () { show(el); });
      el.addEventListener("mouseleave", hide);
      el.addEventListener("focus", function () { show(el); });
      el.addEventListener("blur", hide);
      el.addEventListener("click", function (event) {
        event.stopPropagation();
        if (current === el) hide(); else show(el);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") hide();
  });
  document.addEventListener("click", hide);
  window.addEventListener("scroll", hide, { passive: true });

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () { bind(document); });
  } else {
    document.addEventListener("DOMContentLoaded", function () { bind(document); });
  }
})();

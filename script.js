(() => {
  const langButtons = [...document.querySelectorAll("[data-language]")];
  const translatable = [...document.querySelectorAll("[data-id][data-en]")];
  function setLanguage(lang) {
    const selected = lang === "en" ? "en" : "id";
    document.documentElement.lang = selected;
    translatable.forEach(el => { el.innerHTML = el.dataset[selected]; });
    langButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === selected)));
    try { localStorage.setItem("seragi-language", selected); } catch {}
  }
  langButtons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
  let initialLanguage = "id";
  try { initialLanguage = localStorage.getItem("seragi-language") || "id"; } catch {}
  setLanguage(initialLanguage);

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup navigasi" : "Buka navigasi");
    nav.classList.toggle("is-open", open);
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Buka navigasi");
  }));

  const tabs = [...document.querySelectorAll(".menu-tab")];
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
        (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].focus();
      activate(tabs[next]);
    });
  });
  activate(tabs.find(tab => tab.classList.contains("is-active")) || tabs[0]);
  function activate(tab) {
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.dataset.panel);
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }
})();
(function () {
const api = window.BizFlowApi;

const tocLinks = document.querySelectorAll(".docs-toc a[data-section]");
const sections = document.querySelectorAll(".docs-section[id]");
const searchInput = document.querySelector("#docsSearch");
const copyPageLinkButton = document.querySelector("#copyPageLinkButton");
const dynamicCallbackExample = document.querySelector("#dynamicCallbackExample");

init();

function init() {
  if (!api) return;
  if (!api.requireAuth()) return;

  setDynamicExamples();
  bindToc();
  bindSearch();
  bindCopyLink();
  highlightFromHash();
  observeSections();

  window.addEventListener("hashchange", highlightFromHash);
}

function setDynamicExamples() {
  const origin = window.location.origin;
  const isLocal = /localhost|127\.0\.0\.1/i.test(origin);
  const callback = isLocal
    ? "https://ваш-адрес.bizflow.ru/api/vkbot/webhook"
    : `${origin}/api/vkbot/webhook`;

  if (dynamicCallbackExample) {
    dynamicCallbackExample.textContent = callback;
  }
}

function bindToc() {
  tocLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setActiveToc(id);
    });
  });
}

function bindSearch() {
  if (!searchInput) return;
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    tocLinks.forEach((link) => {
      const text = link.textContent?.toLowerCase() || "";
      link.classList.toggle("is-hidden", Boolean(query) && !text.includes(query));
    });
    if (!query) {
      sections.forEach((section) => {
        section.style.display = "";
      });
      return;
    }

    sections.forEach((section) => {
      const body = section.textContent?.toLowerCase() || "";
      section.style.display = body.includes(query) ? "" : "none";
    });
  });
}

function bindCopyLink() {
  copyPageLinkButton?.addEventListener("click", async () => {
    const url = window.location.href.split("#")[0];
    const hash = window.location.hash || "";
    try {
      await navigator.clipboard.writeText(url + hash);
      api.showToast("Ссылка на документацию скопирована", "success");
    } catch {
      api.showToast("Не удалось скопировать ссылку", "error");
    }
  });
}

function highlightFromHash() {
  const id = window.location.hash.replace("#", "");
  if (id) setActiveToc(id);
}

function setActiveToc(id) {
  tocLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === id);
  });
}

function observeSections() {
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveToc(visible.target.id);
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}
})();

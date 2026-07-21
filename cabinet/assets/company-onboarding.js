(function () {
  const api = window.BizFlowApi;
  if (!api?.requireAuth()) return;

  let step = 1;
  let presets = [];
  let selectedType = "";

  const stepLabel = document.getElementById("stepLabel");
  const stepProject = document.getElementById("stepProject");
  const stepBusiness = document.getElementById("stepBusiness");
  const businessTypeGrid = document.getElementById("businessTypeGrid");
  const projectName = document.getElementById("projectName");
  const projectDescription = document.getElementById("projectDescription");
  const businessDescription = document.getElementById("businessDescription");
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const messageEl = document.getElementById("onboardingMessage");
  const onboardingTitle = document.getElementById("onboardingTitle");
  const onboardingLead = document.getElementById("onboardingLead");

  init();

  async function init() {
    await window.BizFlowShell?.ready;

    backBtn.addEventListener("click", () => goToStep(1));
    nextBtn.addEventListener("click", onNext);

    try {
      const data = await api.get("/api/company/my/onboarding");
      if (data.completed) {
        window.location.href = "/company";
        return;
      }
      if (data.projectName && data.projectName !== "Мой проект") {
        projectName.value = data.projectName;
      }
      presets = data.presets || [];
      renderPresets();
    } catch (error) {
      showMessage(error.message || "Не удалось загрузить настройки", false);
    }
  }

  function renderPresets() {
    businessTypeGrid.innerHTML = presets
      .map(
        (p) => `
        <button type="button" class="bf-type-card${selectedType === p.type ? " selected" : ""}" data-type="${escapeHtml(p.type)}">
          <strong>${escapeHtml(p.title)}</strong>
          <span>${escapeHtml(p.description || "")}</span>
        </button>`,
      )
      .join("");

    businessTypeGrid.querySelectorAll(".bf-type-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedType = btn.dataset.type || "";
        renderPresets();
      });
    });
  }

  function goToStep(n) {
    step = n;
    stepProject.hidden = step !== 1;
    stepBusiness.hidden = step !== 2;
    backBtn.hidden = step === 1;
    nextBtn.textContent = step === 2 ? "Запустить проект" : "Далее";
    stepLabel.textContent = `Шаг ${step} из 2`;

    if (step === 1) {
      onboardingTitle.textContent = "Расскажите о проекте";
      onboardingLead.textContent =
        "Название и описание помогут ИИ понимать контекст вашего бизнеса.";
    } else {
      onboardingTitle.textContent = "Выберите тип бизнеса";
      onboardingLead.textContent =
        "Мы подставим готовые настройки — их можно изменить позже в разделе ИИ-ассистент.";
    }
    hideMessage();
  }

  async function onNext() {
    hideMessage();
    if (step === 1) {
      if (!projectName.value.trim()) {
        showMessage("Укажите название проекта", false);
        return;
      }
      goToStep(2);
      return;
    }

    if (!selectedType) {
      showMessage("Выберите тип бизнеса", false);
      return;
    }

    nextBtn.disabled = true;
    nextBtn.textContent = "Сохранение...";

    try {
      const result = await api.post("/api/company/my/onboarding", {
        projectName: projectName.value.trim(),
        projectDescription: projectDescription.value.trim(),
        businessType: selectedType,
        businessDescription: businessDescription.value.trim(),
      });

      if (result.company) {
        localStorage.setItem("bizflow_company", JSON.stringify(result.company));
      }

      showMessage(result.message || "Готово!", true);
      setTimeout(() => {
        window.location.href = "/company";
      }, 700);
    } catch (error) {
      showMessage(error.message || "Ошибка сохранения", false);
      nextBtn.disabled = false;
      nextBtn.textContent = "Запустить проект";
    }
  }

  function showMessage(text, success) {
    messageEl.hidden = false;
    messageEl.textContent = text;
    messageEl.classList.toggle("success", Boolean(success));
  }

  function hideMessage() {
    messageEl.hidden = true;
    messageEl.classList.remove("success");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();

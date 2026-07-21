(function () {
  const api = window.BizFlowApi;

  const els = {
    heroAvatar: document.getElementById("heroAvatar"),
    heroName: document.getElementById("heroName"),
    heroRole: document.getElementById("heroRole"),
    heroEmail: document.getElementById("heroEmail"),
    heroMeta: document.getElementById("heroMeta"),
    heroTariffValue: document.getElementById("heroTariffValue"),
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    roleLabel: document.getElementById("roleLabel"),
    companyName: document.getElementById("companyName"),
    companyDescription: document.getElementById("companyDescription"),
    companyId: document.getElementById("companyId"),
    companyCreatedAt: document.getElementById("companyCreatedAt"),
    tariffLabel: document.getElementById("tariffLabel"),
    accountStatus: document.getElementById("accountStatus"),
    userCreatedAt: document.getElementById("userCreatedAt"),
    vkStatus: document.getElementById("vkStatus"),
    statDialogs: document.getElementById("statDialogs"),
    statClients: document.getElementById("statClients"),
    statMessages: document.getElementById("statMessages"),
    saveButton: document.getElementById("saveButton"),
    logoutButton: document.getElementById("logoutButton"),
  };

  init();

  async function init() {
    if (!api) return;
    if (!api.requireAuth()) return;

    els.saveButton?.addEventListener("click", saveProfile);
    els.logoutButton?.addEventListener("click", () => api.logout());

    try {
      await api.waitForShell();
      await loadProfile();
    } catch (error) {
      console.error(error);
      api.showToast(error.message || "Не удалось загрузить профиль", "error");
    }
  }

  async function loadProfile() {
    const data = await api.get("/api/company/my/profile");
    renderProfile(data);
  }

  function renderProfile(data) {
    const user = data.user || {};
    const company = data.company || {};
    const stats = data.stats || {};

    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      "Пользователь";
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    if (els.heroAvatar) els.heroAvatar.textContent = initials;
    if (els.heroName) els.heroName.textContent = fullName;
    if (els.heroRole) els.heroRole.textContent = user.roleLabel || "—";
    if (els.heroEmail) els.heroEmail.textContent = user.email || "—";
    if (els.heroMeta)
      els.heroMeta.textContent = `Владелец аккаунта · зарегистрирован ${user.createdAt || "—"}`;
    if (els.heroTariffValue) els.heroTariffValue.textContent = company.tariffLabel || "Демо";

    if (els.firstName) els.firstName.value = user.firstName || "";
    if (els.lastName) els.lastName.value = user.lastName || "";
    if (els.email) els.email.value = user.email || "";
    if (els.roleLabel) els.roleLabel.value = user.roleLabel || "";
    if (els.companyName) els.companyName.value = company.name || "";
    if (els.companyDescription) els.companyDescription.value = company.description || "";
    if (els.companyId) els.companyId.value = String(company.id || "—");
    if (els.companyCreatedAt) els.companyCreatedAt.value = company.createdAt || "—";
    if (els.tariffLabel) els.tariffLabel.textContent = company.tariffLabel || "Демо";
    if (els.accountStatus)
      els.accountStatus.textContent = company.isActive && user.isActive ? "Активен" : "Неактивен";
    if (els.userCreatedAt) els.userCreatedAt.textContent = user.createdAt || "—";
    if (els.vkStatus)
      els.vkStatus.textContent = company.vkConnected
        ? company.vkCommunityName
          ? `Подключено · ${company.vkCommunityName}`
          : "Подключено"
        : "Не подключено";

    if (els.statDialogs) els.statDialogs.textContent = String(stats.dialogs ?? 0);
    if (els.statClients) els.statClients.textContent = String(stats.clients ?? 0);
    if (els.statMessages) els.statMessages.textContent = String(stats.messages ?? 0);

    const shellUser = window.BizFlowShell?.currentUserData?.();
    if (shellUser) {
      shellUser.firstName = user.firstName;
      shellUser.lastName = user.lastName;
      localStorage.setItem("bizflow_user", JSON.stringify(shellUser));
    }
  }

  async function saveProfile() {
    const payload = {
      firstName: els.firstName?.value?.trim() || "",
      lastName: els.lastName?.value?.trim() || "",
      companyName: els.companyName?.value?.trim() || "",
      companyDescription: els.companyDescription?.value?.trim() || "",
    };

    if (!payload.companyName) {
      api.showToast("Укажите название организации", "error");
      return;
    }

    try {
      els.saveButton.disabled = true;
      const data = await api.put("/api/company/my/profile", payload);
      renderProfile(data);
      api.showToast("Профиль сохранён", "success");
      setTimeout(() => window.location.reload(), 600);
    } catch (error) {
      api.showToast(error.message || "Не удалось сохранить профиль", "error");
    } finally {
      els.saveButton.disabled = false;
    }
  }
})();

(function() {
        const api = window.BizFlowApi;

        let vkConfigForm = document.querySelector("#vkConfigForm");
        let vksContent = document.querySelector("#vksContent");
        let pageError = document.querySelector("#pageError");
        let addCommunitySection = document.querySelector("#addCommunitySection");
        let addFormConnectedHint = document.querySelector("#addFormConnectedHint");
        let connectionTypeSelect = document.querySelector("#connectionType");
        let communityNameInput = document.querySelector("#communityName");
        let targetIdInput = document.querySelector("#targetId");
        let targetIdLabel = document.querySelector("#targetIdLabel");
        let vkAccessTokenInput = document.querySelector("#vkAccessToken");
        let maskedTokenHint = document.querySelector("#maskedTokenHint");
        let callbackUrlInput = document.querySelector("#callbackUrl");
        let secretKeyInput = document.querySelector("#secretKey");
        let confirmationTokenInput = document.querySelector("#confirmationToken");
        let confirmationTokenVisible = document.querySelector("#confirmationTokenVisible");
        let vkConfigMessage = document.querySelector("#vkConfigMessage");
        let connectedList = document.querySelector("#connectedList");
        let connectedEmpty = document.querySelector("#connectedEmpty");
        let connectionWarnings = document.querySelector("#connectionWarnings");
        let checkReport = document.querySelector("#checkReport");
        let connectButton = document.querySelector("#connectButton");
        let checkVkButton = document.querySelector("#checkVkButton");
        let saveManageButton = document.querySelector("#saveManageButton");
        let managedCallbackPreview = document.querySelector("#managedCallbackPreview");
        let managedSecretPreview = document.querySelector("#managedSecretPreview");
        let copyCallbackButton = document.querySelector("#copyCallbackButton");
        let copySecretButton = document.querySelector("#copySecretButton");
        let generateSecretButton = document.querySelector("#generateSecretButton");
        let setupCallbackButton = document.querySelector("#setupCallbackButton");
        let toggleTokenButton = document.querySelector("#toggleTokenButton");
        let addCommunityButton = document.querySelector("#addCommunityButton");
        let manageModal = document.querySelector("#manageModal");
        let closeManageModal = document.querySelector("#closeManageModal");
        let manageCommunityName = document.querySelector("#manageCommunityName");
        let manageTargetId = document.querySelector("#manageTargetId");
        let manageTargetIdLabel = document.querySelector("#manageTargetIdLabel");
        let manageVkAccessToken = document.querySelector("#manageVkAccessToken");
        let manageTokenHint = document.querySelector("#manageTokenHint");
        let manageToggleTokenButton = document.querySelector("#manageToggleTokenButton");
        let manageTypeToggle = document.querySelector("#manageTypeToggle");
        let manageModalSubtitle = document.querySelector("#manageModalSubtitle");
        let copyDocsLinkButton = document.querySelector("#copyDocsLinkButton");
        let connectionTypeCustom = document.querySelector("#connectionTypeCustom");
        let connectionTypeTrigger = document.querySelector("#connectionTypeTrigger");
        let connectionTypeLabel = connectionTypeCustom ?.querySelector(".vks-custom-select__label");

        function refreshDomRefs() {
            vkConfigForm = document.querySelector("#vkConfigForm");
            vksContent = document.querySelector("#vksContent");
            pageError = document.querySelector("#pageError");
            addCommunitySection = document.querySelector("#addCommunitySection");
            addFormConnectedHint = document.querySelector("#addFormConnectedHint");
            connectionTypeSelect = document.querySelector("#connectionType");
            communityNameInput = document.querySelector("#communityName");
            targetIdInput = document.querySelector("#targetId");
            targetIdLabel = document.querySelector("#targetIdLabel");
            vkAccessTokenInput = document.querySelector("#vkAccessToken");
            maskedTokenHint = document.querySelector("#maskedTokenHint");
            callbackUrlInput = document.querySelector("#callbackUrl");
            secretKeyInput = document.querySelector("#secretKey");
            confirmationTokenInput = document.querySelector("#confirmationToken");
            confirmationTokenVisible = document.querySelector("#confirmationTokenVisible");
            vkConfigMessage = document.querySelector("#vkConfigMessage");
            connectedList = document.querySelector("#connectedList");
            connectedEmpty = document.querySelector("#connectedEmpty");
            connectionWarnings = document.querySelector("#connectionWarnings");
            checkReport = document.querySelector("#checkReport");
            connectButton = document.querySelector("#connectButton");
            checkVkButton = document.querySelector("#checkVkButton");
            saveManageButton = document.querySelector("#saveManageButton");
            managedCallbackPreview = document.querySelector("#managedCallbackPreview");
            managedSecretPreview = document.querySelector("#managedSecretPreview");
            copyCallbackButton = document.querySelector("#copyCallbackButton");
            copySecretButton = document.querySelector("#copySecretButton");
            generateSecretButton = document.querySelector("#generateSecretButton");
            setupCallbackButton = document.querySelector("#setupCallbackButton");
            toggleTokenButton = document.querySelector("#toggleTokenButton");
            addCommunityButton = document.querySelector("#addCommunityButton");
            manageModal = document.querySelector("#manageModal");
            closeManageModal = document.querySelector("#closeManageModal");
            manageCommunityName = document.querySelector("#manageCommunityName");
            manageTargetId = document.querySelector("#manageTargetId");
            manageTargetIdLabel = document.querySelector("#manageTargetIdLabel");
            manageVkAccessToken = document.querySelector("#manageVkAccessToken");
            manageTokenHint = document.querySelector("#manageTokenHint");
            manageToggleTokenButton = document.querySelector("#manageToggleTokenButton");
            manageTypeToggle = document.querySelector("#manageTypeToggle");
            manageModalSubtitle = document.querySelector("#manageModalSubtitle");
            copyDocsLinkButton = document.querySelector("#copyDocsLinkButton");
            connectionTypeCustom = document.querySelector("#connectionTypeCustom");
            connectionTypeTrigger = document.querySelector("#connectionTypeTrigger");
            connectionTypeLabel = connectionTypeCustom ?.querySelector(".vks-custom-select__label");
        }

        const VK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.254 2.151-3.185 2.151-3.185.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.203.322-.271.44 0 .78.186.254.78.780 1.186 1.253.745.712 1.304 1.253 1.459 1.642.17.407-.085.78-.576.78z"/></svg>`;

        boot();

        function boot() {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", init, { once: true });
            } else {
                init();
            }
            window.addEventListener("pageshow", init);
            document.addEventListener("spa-navigated", () => setTimeout(init, 0));
        }

        async function init() {
            if (!api) return;
            if (!api.requireAuth()) return;

            refreshDomRefs();
            bindEvents();

            try {
                setPageLoading(true);
                await Promise.resolve().then(() => api ?.waitForShell ? api.waitForShell() : Promise.resolve());
                await loadConfig();
                syncAllEyeIcons();
                requestAnimationFrame(() => syncAllEyeIcons());
                setTimeout(() => syncAllEyeIcons(), 30);
                setTimeout(() => syncAllEyeIcons(), 150);
            } catch (error) {
                console.error("VK init error:", error);
                showPageError(error.message || "Не удалось загрузить настройки VK.");
                if (api ?.showToast) api.showToast(error.message || "Ошибка загрузки VK", "error");
            } finally {
                setPageLoading(false);
            }
        }

        function bindEvents() {
            connectionTypeSelect ?.addEventListener("change", updateAddModeUI);
            initCustomSelect();
            syncAllEyeIcons();
            vkConfigForm ?.addEventListener("submit", saveConfig);
            checkVkButton ?.addEventListener("click", runCheck);
            saveManageButton ?.addEventListener("click", saveFromModal);
            setupCallbackButton ?.addEventListener("click", setupCallback);
            copyCallbackButton ?.addEventListener("click", () =>
                copyText(managedCallbackUrl, "Callback URL скопирован."),
            );
            copySecretButton ?.addEventListener("click", () =>
                copyText(secretKeyInput ?.value.trim(), "Secret Key скопирован."),
            );
            generateSecretButton ?.addEventListener("click", () => {
                if (secretKeyInput) secretKeyInput.value = generateSecret();
                syncManagedPreview();
                notify("Сгенерирован новый Secret Key. Сохраните настройки.", "success");
            });
            toggleTokenButton ?.addEventListener("click", () => toggleTokenVisibility(vkAccessTokenInput, toggleTokenButton));
            manageToggleTokenButton ?.addEventListener("click", () =>
                toggleTokenVisibility(manageVkAccessToken, manageToggleTokenButton)
            );
            addCommunityButton ?.addEventListener("click", focusConnectForm);
            closeManageModal ?.addEventListener("click", () => manageModal ?.close());

            manageModal ?.addEventListener("cancel", (event) => event.preventDefault());
            manageModal ?.addEventListener("click", (event) => {
                if (event.target === manageModal) manageModal.close();
            });

            manageTypeToggle ?.querySelectorAll(".vks-type-btn").forEach((button) => {
                button.addEventListener("click", () => {
                    setManageConnectionType(button.dataset.type);
                });
            });

            confirmationTokenVisible ?.addEventListener("input", () => {
                if (confirmationTokenInput) {
                    confirmationTokenInput.value = confirmationTokenVisible.value.trim();
                }
            });

            copyDocsLinkButton ?.addEventListener("click", () =>
                copyText(`${window.location.origin}/company/docs#vk-integration`, "Ссылка на документацию скопирована."),
            );

            window.addEventListener("pageshow", (event) => {
                if (event.persisted) discardUnsavedAddFormDraft();
            });

            manageModal ?.addEventListener("close", () => {
                if (latestConfig) fillManageForm(latestConfig);
            });
        }

        function initCustomSelect() {
            if (!connectionTypeCustom || !connectionTypeSelect) return;

            const options = connectionTypeCustom.querySelectorAll(".vks-custom-select__option");

            const open = () => {
                connectionTypeCustom.classList.add("open");
                connectionTypeCustom.setAttribute("aria-expanded", "true");
                const dropdown = connectionTypeCustom.querySelector(".vks-custom-select__dropdown");
                dropdown ?.setAttribute("aria-hidden", "false");
            };

            const close = () => {
                connectionTypeCustom.classList.remove("open");
                connectionTypeCustom.setAttribute("aria-expanded", "false");
                const dropdown = connectionTypeCustom.querySelector(".vks-custom-select__dropdown");
                dropdown ?.setAttribute("aria-hidden", "true");
            };

            const toggle = () => {
                if (connectionTypeCustom.classList.contains("open")) close();
                else open();
            };

            const selectValue = (value, silent = false) => {
                options.forEach((opt) => {
                    const isSel = opt.dataset.value === value;
                    opt.classList.toggle("selected", isSel);
                    opt.setAttribute("aria-selected", String(isSel));
                });
                const chosen = connectionTypeCustom.querySelector(`.vks-custom-select__option[data-value="${value}"]`);
                if (chosen && connectionTypeLabel) {
                    connectionTypeLabel.textContent = (chosen.querySelector("span") ?.textContent || "").trim();
                }
                if (connectionTypeSelect.value !== value) {
                    connectionTypeSelect.value = value;
                    if (!silent) connectionTypeSelect.dispatchEvent(new Event("change"));
                } else if (!silent) {
                    updateAddModeUI();
                }
                close();
            };

            connectionTypeTrigger ?.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
            });

            connectionTypeCustom ?.addEventListener("click", (e) => {
                const option = e.target.closest(".vks-custom-select__option");
                if (option) {
                    e.preventDefault();
                    e.stopPropagation();
                    selectValue(option.dataset.value);
                }
            });

            connectionTypeCustom ?.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!connectionTypeCustom.classList.contains("open")) open();
                } else if (e.key === "Escape") {
                    close();
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (!connectionTypeCustom.classList.contains("open")) open();
                    const list = Array.from(options);
                    const idx = list.findIndex((o) => o.classList.contains("selected"));
                    const next = list[(idx + 1) % list.length];
                    next ?.focus();
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (!connectionTypeCustom.classList.contains("open")) open();
                    const list = Array.from(options);
                    const idx = list.findIndex((o) => o.classList.contains("selected"));
                    const prev = list[(idx - 1 + list.length) % list.length];
                    prev ?.focus();
                }
            });

            document.addEventListener("click", (e) => {
                if (!connectionTypeCustom.contains(e.target)) close();
            });

            const syncFromHiddenSelect = () => {
                const current = connectionTypeSelect.value;
                const labelNow = connectionTypeLabel ?.textContent ?.trim() || "";
                const chosen = connectionTypeCustom.querySelector(`.vks-custom-select__option[data-value="${current}"]`);
                const chosenText = chosen ? (chosen.querySelector("span") ?.textContent || "").trim() : "";
                if (chosenText && chosenText !== labelNow) {
                    selectValue(current, true);
                } else {
                    options.forEach((opt) => {
                        const isSel = opt.dataset.value === current;
                        opt.classList.toggle("selected", isSel);
                        opt.setAttribute("aria-selected", String(isSel));
                    });
                }
            };
            if (!connectionTypeSelect._customSelectPatched) {
                connectionTypeSelect._customSelectPatched = true;
                if (connectionTypeSelect.form) {
                    connectionTypeSelect.form.addEventListener("reset", () => {
                        setTimeout(syncFromHiddenSelect, 0);
                    });
                }
            }
            window._syncConnectionTypeCustom = syncFromHiddenSelect;
        }

        function discardUnsavedAddFormDraft() {
            clearAddForm();
            vkConfigForm ?.reset();
            if (typeof window._syncConnectionTypeCustom === "function") window._syncConnectionTypeCustom();
        }

        async function loadConfig() {
            const config = await api.get("/api/company/my/vk-config");
            latestConfig = config;
            hasSavedToken = Boolean(config.hasAccessToken);
            isCommunityConnected = Boolean(config.targetId || config.hasAccessToken);
            managedCallbackUrl =
                config.managedCallbackUrl || `${window.location.origin}/api/vkbot/webhook`;

            if (callbackUrlInput) callbackUrlInput.value = config.callbackUrl || managedCallbackUrl;
            if (secretKeyInput) secretKeyInput.value = config.secretKey || "";
            const confirmation = config.confirmationToken || "";
            if (confirmationTokenInput) confirmationTokenInput.value = confirmation;
            if (confirmationTokenVisible) confirmationTokenVisible.value = confirmation;

            discardUnsavedAddFormDraft();
            updateAddFormState();
            syncManagedPreview();
            renderConnectedCommunities(config);
            renderWarnings(config);
            clearPageError();
        }

        function clearAddForm() {
            if (communityNameInput) communityNameInput.value = "";
            if (connectionTypeSelect) connectionTypeSelect.value = "group";
            if (typeof window._syncConnectionTypeCustom === "function") window._syncConnectionTypeCustom();
            if (targetIdInput) targetIdInput.value = "";
            if (vkAccessTokenInput) vkAccessTokenInput.value = "";
            if (maskedTokenHint) {
                maskedTokenHint.textContent = "Токен необходим для получения и отправки сообщений";
            }
            updateAddModeUI();
        }

        function updateAddFormState() {
            if (isCommunityConnected) {
                clearAddForm();
                addFormConnectedHint && (addFormConnectedHint.hidden = false);
                vkConfigForm ?.classList.add("vks-form--secondary");
                addCommunitySection ?.classList.add("vks-card--secondary");
            } else {
                addFormConnectedHint && (addFormConnectedHint.hidden = true);
                vkConfigForm ?.classList.remove("vks-form--secondary");
                addCommunitySection ?.classList.remove("vks-card--secondary");
            }
        }

        function fillManageForm(config) {
            manageConnectionType = config.connectionType || "group";
            setManageConnectionType(manageConnectionType, false);

            if (manageCommunityName) {
                manageCommunityName.value = config.communityName || config.companyName || "";
            }
            if (manageTargetId) manageTargetId.value = config.targetId || "";
            if (manageVkAccessToken) manageVkAccessToken.value = "";
            if (manageTokenHint) {
                manageTokenHint.textContent = hasSavedToken ?
                    `Текущий токен сохранён: ${config.maskedAccessToken}. Оставьте поле пустым, чтобы не менять.` :
                    "Введите Access Token сообщества";
            }
            if (confirmationTokenVisible) {
                confirmationTokenVisible.value = config.confirmationToken || confirmationTokenInput ?.value || "";
            }
            if (confirmationTokenInput) {
                confirmationTokenInput.value = confirmationTokenVisible ?.value || config.confirmationToken || "";
            }
            if (secretKeyInput && config.secretKey) secretKeyInput.value = config.secretKey;

            manageModalSubtitle.textContent = config.communityName ?
                `${config.communityName} · ID ${config.targetId || "—"}` :
                "Настройки подключённого сообщества";
            syncManagedPreview();
        }

        function setManageConnectionType(type, updateLabel = true) {
            manageConnectionType = type === "personal" ? "personal" : "group";
            manageTypeToggle ?.querySelectorAll(".vks-type-btn").forEach((button) => {
                button.classList.toggle("active", button.dataset.type === manageConnectionType);
            });
            if (updateLabel && manageTargetIdLabel) {
                manageTargetIdLabel.textContent =
                    manageConnectionType === "personal" ? "VK ID менеджера" : "ID сообщества";
            }
        }

        function setConnectedEmptyVisible(visible) {
            if (!connectedEmpty) return;
            connectedEmpty.hidden = !visible;
            connectedEmpty.style.display = visible ? "" : "none";
        }

        function isGenericVkPhoto(url) {
            const value = String(url || "");
            return /\/images\/(community|camera|deactivated)_100\.png/i.test(value);
        }

        function renderCommunityAvatar(config) {
            const photoUrl = String(config.communityPhotoUrl || "").trim();
            if (photoUrl && !isGenericVkPhoto(photoUrl)) {
                return `
      <div class="vks-community-icon vks-community-icon--photo">
        <img
          class="vks-community-photo"
          src="${escapeHtml(photoUrl)}"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <span class="vks-community-icon-fallback" hidden aria-hidden="true">${VK_ICON}</span>
      </div>`;
            }

            return `<div class="vks-community-icon vks-community-icon--fallback">${VK_ICON}</div>`;
        }

        function bindCommunityAvatarFallback(card) {
            const img = card.querySelector(".vks-community-photo");
            const fallback = card.querySelector(".vks-community-icon-fallback");
            const iconWrap = card.querySelector(".vks-community-icon--photo");
            if (!img || !fallback || !iconWrap) return;

            img.addEventListener("error", () => {
                iconWrap.classList.remove("vks-community-icon--photo");
                iconWrap.classList.add("vks-community-icon--fallback");
                img.remove();
                fallback.hidden = false;
            });
        }

        function renderConnectedCommunities(config) {
            connectedList ?.querySelectorAll(".vks-community").forEach((node) => node.remove());

            const hasCommunity = Boolean(config.targetId || config.hasAccessToken);
            if (!hasCommunity) {
                setConnectedEmptyVisible(true);
                return;
            }

            setConnectedEmptyVisible(false);

            const fullyConnected =
                config.isConnected && !config.callbackIsLocal && config.confirmationTokenConfigured;

            const typeLabel =
                config.connectionType === "personal" ? "Личный аккаунт" : "Публичная страница";
            const name = config.communityName || config.companyName || "Сообщество VK";
            const statusLabel = fullyConnected ? "Подключено" : "Требует настройки";
            const badgeClass = fullyConnected ? "vks-badge--ok" : "vks-badge--warn";
            const activityStatus = fullyConnected ? "Активно" : "Настройка";
            const activityClass = fullyConnected ? "ok" : "";
            const connectedDate = config.lastActivityAt ? formatDate(config.lastActivityAt) : "—";
            const vkUrl = config.targetId ? `https://vk.com/club${config.targetId}` : "#";

            const card = document.createElement("article");
            card.className = "vks-community";
            card.innerHTML = `
    <div class="vks-community-top">
      ${renderCommunityAvatar(config)}
      <div class="vks-community-meta">
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(typeLabel)}</p>
      </div>
      <div class="vks-community-actions">
        <span class="vks-badge ${badgeClass}">${escapeHtml(statusLabel)}</span>
        <button type="button" class="vks-menu-btn" data-action="manage" aria-label="Управление">⋯</button>
      </div>
    </div>
    <div class="vks-stats">
      <div class="vks-stat">
        <label>ID сообщества</label>
        <strong>${escapeHtml(config.targetId || "—")}</strong>
      </div>
      <div class="vks-stat">
        <label>Сообщений сегодня</label>
        <strong>${escapeHtml(String(config.messagesToday ?? 0))}</strong>
      </div>
      <div class="vks-stat">
        <label>Статус</label>
        <strong class="${activityClass}">${escapeHtml(activityStatus)}</strong>
      </div>
      <div class="vks-stat">
        <label>Активность</label>
        <strong>${escapeHtml(connectedDate)}</strong>
      </div>
    </div>
    <div class="vks-community-footer">
      <button type="button" class="vks-manage-btn" data-action="manage">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Управление
      </button>
      ${
        config.targetId
          ? `<a class="vks-link vks-open-vk" href="${escapeHtml(vkUrl)}" target="_blank" rel="noreferrer">Открыть в VK</a>`
          : ""
      }
    </div>
  `;

  connectedList?.appendChild(card);
  bindCommunityAvatarFallback(card);
  card.querySelectorAll('[data-action="manage"]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openManageModal();
    });
  });
}

function openManageModal() {
  if (!latestConfig) return;
  fillManageForm(latestConfig);
  syncAllEyeIcons();
  manageModal?.showModal();
}

function renderWarnings(config) {
  const warnings = [];
  if (config.callbackIsLocal) {
    warnings.push("Завершите настройку Callback API в окне «Управление» или обратитесь в поддержку.");
  }
  if (!config.confirmationTokenConfigured) {
    warnings.push("Скопируйте confirmation token в VK → Callback API → Строка подтверждения.");
  }
  if (!warnings.length) {
    if (connectionWarnings) {
      connectionWarnings.hidden = true;
      connectionWarnings.innerHTML = "";
    }
    return;
  }
  if (connectionWarnings) {
    connectionWarnings.hidden = false;
    connectionWarnings.innerHTML = warnings
      .map((item) => `<div class="vks-warning">${escapeHtml(item)}</div>`)
      .join("");
  }
}

function updateAddModeUI() {
  if (!connectionTypeSelect) return;
  const isPersonal = connectionTypeSelect.value === "personal";
  if (targetIdLabel) {
    targetIdLabel.textContent = isPersonal ? "VK ID менеджера" : "ID сообщества";
  }
}

function syncManagedPreview() {
  if (managedCallbackPreview) managedCallbackPreview.textContent = managedCallbackUrl || "—";
  if (managedSecretPreview) managedSecretPreview.textContent = secretKeyInput?.value.trim() || "—";
}

function toggleTokenVisibility(input, btn) {
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
  syncEyeIconsForButton(input, btn);
}

function setEyeIconVisible(icon, visible) {
  if (!icon) return;
  icon.hidden = !visible;
  icon.style.setProperty("display", visible ? "block" : "none", "important");
  icon.setAttribute("aria-hidden", String(!visible));
}

function syncEyeIconsForButton(input, btn) {
  if (!input || !btn) return;
  const hiddenPassword = input.type === "password";
  const hideIcon = btn.querySelector('[data-eye="hide"]');
  const showIcon = btn.querySelector('[data-eye="show"]');
  setEyeIconVisible(hideIcon, hiddenPassword);
  setEyeIconVisible(showIcon, !hiddenPassword);
}

function syncAllEyeIcons() {
  syncEyeIconsForButton(vkAccessTokenInput, toggleTokenButton);
  syncEyeIconsForButton(manageVkAccessToken, manageToggleTokenButton);
}

function focusConnectForm() {
  if (isCommunityConnected) {
    clearAddForm();
    notify("Заполните форму, чтобы заменить текущее подключение на другое сообщество.", "info");
  }
  addCommunitySection?.scrollIntoView({ behavior: "smooth", block: "start" });
  communityNameInput?.focus();
}

async function saveConfig(event) {
  event.preventDefault();
  await persistConfig({ source: "add", closeModal: false });
}

async function saveFromModal() {
  await persistConfig({ source: "manage", closeModal: true });
}

function syncManageFieldsToHidden() {
  if (confirmationTokenVisible && confirmationTokenInput) {
    confirmationTokenInput.value = confirmationTokenVisible.value.trim();
  }
}

async function persistConfig({ source, closeModal }) {
  syncManageFieldsToHidden();

  const payload = source === "manage" ? getManageFormPayload() : getAddFormPayload();
  const previousTargetId = latestConfig?.targetId || "";
  const validationErrors = validateForm(payload, {
    requireToken: source === "add",
    allowExistingToken: source === "manage",
  });
  if (validationErrors.length) {
    notify(validationErrors[0], "error");
    return;
  }

  if (source === "add") {
    if (!payload.secretKey) payload.secretKey = generateSecret();
    if (!payload.confirmationToken) payload.confirmationToken = generateSecret().slice(0, 16);
  }

  try {
    setBusy(true);
    notify("Сохраняем настройки VK...", "info");
    await api.post("/api/company/my/vk-config", payload);
    const groupSwitched =
      payload.connectionType === "group" &&
      previousTargetId &&
      payload.targetId &&
      normalizeTargetId(previousTargetId, false) !== normalizeTargetId(payload.targetId, false);

    if (payload.connectionType === "group" && (payload.vkAccessToken || hasSavedToken)) {
      try {
        const result = await api.post("/api/company/my/vk-setup-callback");
        await loadConfig();
        notify(
          groupSwitched
            ? result.message || "Новая группа VK подключена, Callback API настроен."
            : result.message || "Callback API настроен.",
          "success",
        );
      } catch (setupError) {
        await loadConfig();
        notify(
          groupSwitched
            ? `Группа сохранена, но Callback API не настроен: ${setupError.message}. Нажмите «Настроить Callback API».`
            : `Настройки сохранены. Callback API: ${setupError.message}`,
          "error",
        );
      }
    } else {
      await loadConfig();
      notify("Настройки VK сохранены", "success");
    }

    if (closeModal) manageModal?.close();
  } catch (error) {
    const serverErrors = api.extractErrors(error);
    notify(error.message || "Не удалось сохранить.", "error");
    if (serverErrors.length) renderClientValidationReport("Ошибки валидации", serverErrors);
  } finally {
    setBusy(false);
  }
}

async function setupCallback() {
  syncManageFieldsToHidden();
  await setupCallbackInternal();
}

async function setupCallbackInternal() {
  const payload = getManageFormPayload();
  const validationErrors = validateForm(payload, { requireToken: false, allowExistingToken: true });
  if (validationErrors.length) {
    notify(validationErrors[0], "error");
    return;
  }

  try {
    setBusy(true);
    notify("Сначала сохраняем изменения...", "info");
    await api.post("/api/company/my/vk-config", payload);
    const result = await api.post("/api/company/my/vk-setup-callback");
    await loadConfig();
    notify(result.message || "Callback API настроен", "success");
  } catch (error) {
    notify(error.message || "Не удалось настроить Callback API.", "error");
  } finally {
    setBusy(false);
  }
}

async function runCheck() {
  syncManageFieldsToHidden();
  const payload = getManageFormPayload();
  const validationErrors = validateForm(payload, { requireToken: false, allowExistingToken: true });
  if (validationErrors.length) {
    notify(validationErrors[0], "error");
    return;
  }

  try {
    setBusy(true);
    notify("Проверяем подключение VK...", "info");
    await api.post("/api/company/my/vk-config", payload);
    const report = await api.post("/api/company/my/vk-check");
    renderCheckReport(report);
    await loadConfig();
    notify(report.summary || "Проверка завершена", report.overallStatus === 1 ? "success" : "info");
  } catch (error) {
    notify(error.message || "Не удалось выполнить проверку.", "error");
    const serverErrors = api.extractErrors(error);
    if (serverErrors.length) renderClientValidationReport("Ошибки конфигурации", serverErrors);
  } finally {
    setBusy(false);
  }
}

function getAddFormPayload() {
  const isPersonal = connectionTypeSelect?.value === "personal";
  return {
    connectionType: connectionTypeSelect?.value || "group",
    communityName: communityNameInput?.value.trim() || "",
    targetId: targetIdInput?.value.trim() || "",
    vkAccessToken: vkAccessTokenInput?.value.trim() || "",
    callbackUrl: isPersonal ? callbackUrlInput?.value.trim() || "" : managedCallbackUrl,
    secretKey: secretKeyInput?.value.trim() || "",
    confirmationToken: confirmationTokenInput?.value.trim() || "",
  };
}

function getManageFormPayload() {
  const isPersonal = manageConnectionType === "personal";
  const targetId = manageTargetId?.value.trim() || latestConfig?.targetId || "";
  return {
    connectionType: manageConnectionType,
    communityName: manageCommunityName?.value.trim() || "",
    targetId,
    vkAccessToken: manageVkAccessToken?.value.trim() || "",
    callbackUrl: isPersonal ? callbackUrlInput?.value.trim() || "" : managedCallbackUrl,
    secretKey: secretKeyInput?.value.trim() || "",
    confirmationToken: confirmationTokenVisible?.value.trim() || confirmationTokenInput?.value.trim() || "",
  };
}

function renderCheckReport(report) {
  if (!checkReport) return;
  checkReport.hidden = false;
  checkReport.innerHTML = `
    <h3>Отчёт по проверке <span class="vks-badge ${report.overallStatus === 1 ? "vks-badge--ok" : "vks-badge--warn"}">${escapeHtml(formatVkStatus(report.overallStatus))}</span></h3>
    <p class="vks-hint">${escapeHtml(report.summary || "")}</p>
    <div class="vks-report-list">
      ${(report.checks || [])
        .map(
          (check) => `
        <div class="vks-report-item ${check.ok ? "ok" : "error"}">
          <strong>${check.ok ? "OK" : "Ошибка"} — ${escapeHtml(check.label)}</strong>
          <p>${escapeHtml(check.details || "")}</p>
        </div>`,
        )
        .join("")}
    </div>`;
  checkReport.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderClientValidationReport(title, errors) {
  if (!checkReport) return;
  checkReport.hidden = false;
  checkReport.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <div class="vks-report-list">
      ${errors.map((error) => `<div class="vks-report-item error"><p>${escapeHtml(error)}</p></div>`).join("")}
    </div>`;
}

function notify(message, type = "info") {
  if (!message || !api) return;
  if (vkConfigMessage) {
    vkConfigMessage.hidden = false;
    vkConfigMessage.textContent = message;
    vkConfigMessage.className = `vks-message ${type}`.trim();
  }
  api.showToast(message, type);
}

function showPageError(message) {
  if (!pageError) return;
  pageError.hidden = false;
  pageError.textContent = message;
}

function clearPageError() {
  if (!pageError) return;
  pageError.hidden = true;
  pageError.textContent = "";
}

function setPageLoading(isLoading) {
  vksContent?.classList.toggle("bf-page-loading", isLoading);
}

function setBusy(isBusy) {
  if (connectButton) connectButton.disabled = isBusy;
  if (checkVkButton) checkVkButton.disabled = isBusy;
  if (saveManageButton) saveManageButton.disabled = isBusy;
  if (setupCallbackButton) setupCallbackButton.disabled = isBusy;
}

function validateForm(payload, { requireToken = false, allowExistingToken = false } = {}) {
  const errors = [];
  if (!payload.targetId) {
    errors.push("Укажите ID сообщества или ссылку VK.");
  } else if (payload.connectionType === "personal") {
    const normalized = normalizeTargetId(payload.targetId, true);
    if (!/^\d+$/.test(normalized)) errors.push("Для личного аккаунта укажите numeric VK ID.");
  } else {
    const normalized = normalizeTargetId(payload.targetId, false);
    if (!/^\d+$/.test(normalized) && !/^[a-zA-Z0-9_.]+$/.test(normalized)) {
      errors.push("Некорректный ID сообщества.");
    }
  }

  if (requireToken && !payload.vkAccessToken && !(allowExistingToken && hasSavedToken)) {
    errors.push("Нужен Access Token — вставьте токен.");
  }

  if (payload.vkAccessToken) {
    if (/\s/.test(payload.vkAccessToken)) errors.push("Токен не должен содержать пробелы.");
    else if (payload.vkAccessToken.length < 20) errors.push("Токен слишком короткий.");
  }

  if (payload.secretKey && (payload.secretKey.includes(" ") || payload.secretKey.length < 6)) {
    errors.push("Secret Key: минимум 6 символов без пробелов.");
  }

  return errors;
}

function formatVkStatus(value) {
  const numeric = Number(value);
  if (numeric === 1) return "OK";
  if (numeric === 2) return "Warning";
  if (numeric === 3) return "Error";
  return "Unknown";
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTargetId(value, personalMode) {
  let normalized = String(value || "").trim();
  normalized = normalized
    .replace(/^https?:\/\//i, "")
    .replace(/^vk\.com\//i, "")
    .replace(/^@/i, "")
    .replace(/\/$/, "");
  if (personalMode) {
    normalized = normalized.replace(/^id/i, "");
    return normalized.replace(/\D/g, "");
  }
  if (/^club\d+$/i.test(normalized)) return normalized.replace(/^club/i, "");
  if (/^public\d+$/i.test(normalized)) return normalized.replace(/^public/i, "");
  return normalized;
}

function generateSecret() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID().replace(/-/g, "");
  return `${Date.now()}${Math.random().toString(16).slice(2)}`;
}

async function copyText(value, successMessage) {
  if (!value) {
    notify("Сначала сохраните значение.", "error");
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    notify(successMessage, "success");
  } catch {
    notify("Скопируйте значение вручную.", "error");
  }
}
})();
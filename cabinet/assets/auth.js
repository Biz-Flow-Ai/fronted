const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const bootstrapPanel = document.querySelector("#bootstrapPanel");
const bootstrapForm = document.querySelector("#bootstrapForm");
const bootstrapHint = document.querySelector("#bootstrapHint");
const bootstrapStatusBadge = document.querySelector("#bootstrapStatusBadge");
const bootstrapMessage = document.querySelector("#bootstrapMessage");

const token = localStorage.getItem("bizflow_token");
const savedUser = JSON.parse(localStorage.getItem("bizflow_user") || "null");
if (token && savedUser) {
  window.location.href = isAdmin(savedUser.role) ? "/admin" : "/company";
}

init();

async function init() {
  loginForm.addEventListener("submit", onLoginSubmit);
  bootstrapForm?.addEventListener("submit", onBootstrapSubmit);
  await loadBootstrapStatus();
}

async function onLoginSubmit(event) {
  event.preventDefault();

  const submitButton = loginForm.querySelector("button[type='submit']");
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  setMessage(loginMessage, "Выполняем вход...", "");
  submitButton.disabled = true;

  try {
    const data = await postJson("/api/auth/login", { email, password });
    persistSession(data);
    setMessage(loginMessage, "Готово. Открываем панель...", "success");
    window.location.href = isAdmin(data.user?.role) ? "/admin" : "/company";
  } catch (error) {
    setMessage(
      loginMessage,
      error.message || "Не удалось войти. Проверьте email и пароль.",
      "error",
    );
  } finally {
    submitButton.disabled = false;
  }
}

async function loadBootstrapStatus() {
  if (!bootstrapPanel) return;

  try {
    const status = await getJson("/api/auth/bootstrap-status");
    bootstrapPanel.hidden = false;
    bootstrapHint.textContent = status.hint || "";
    bootstrapStatusBadge.textContent = status.bootstrapAvailable
      ? "Можно создать"
      : "Уже настроено";
    bootstrapForm.hidden = !status.bootstrapAvailable;
  } catch (error) {
    bootstrapPanel.hidden = false;
    bootstrapHint.textContent =
      "Backend отвечает старыми API-роутами или не был перезапущен после обновления. Запусти файл backend/restart-bizflow.cmd, дождись нового окна с сервером и обнови страницу.";
    bootstrapStatusBadge.textContent = "Нужен рестарт";
    bootstrapForm.hidden = false;
  }
}

async function onBootstrapSubmit(event) {
  event.preventDefault();

  const submitButton = bootstrapForm.querySelector("button[type='submit']");
  const payload = {
    email: document.querySelector("#bootstrapEmail").value.trim(),
    password: document.querySelector("#bootstrapPassword").value,
    firstName: document.querySelector("#bootstrapFirstName").value.trim(),
    lastName: document.querySelector("#bootstrapLastName").value.trim(),
    companyName: document.querySelector("#bootstrapCompanyName").value.trim(),
  };

  const validationError = validateBootstrapPayload(payload);
  if (validationError) {
    setMessage(bootstrapMessage, validationError, "error");
    return;
  }

  setMessage(bootstrapMessage, "Создаём первого администратора...", "");
  submitButton.disabled = true;

  try {
    const data = await postJson("/api/auth/bootstrap-admin", payload);
    persistSession(data);
    setMessage(
      bootstrapMessage,
      "Admin создан. Открываем /admin...",
      "success",
    );
    window.location.href = "/admin";
  } catch (error) {
    setMessage(
      bootstrapMessage,
      error.message ||
        "Не удалось создать первого admin. Чаще всего это значит, что backend ещё работает на старом процессе. Запусти backend/restart-bizflow.cmd и повтори.",
      "error",
    );
  } finally {
    submitButton.disabled = false;
  }
}

function validateBootstrapPayload(payload) {
  if (!payload.email) return "Укажите email администратора.";
  if (!payload.password || payload.password.length < 6) {
    return "Пароль должен быть не короче 6 символов.";
  }
  if (!payload.companyName) return "Укажите название компании.";
  return "";
}

function persistSession(data) {
  localStorage.setItem("bizflow_token", data.token);
  localStorage.setItem("bizflow_user", JSON.stringify(data.user));
}

function isAdmin(role) {
  return role === 0 || String(role).toLowerCase() === "admin";
}

function setMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`.trim();
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { "ngrok-skip-browser-warning": "1" },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Не удалось выполнить запрос.");
  }
  return data;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "1",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Не удалось выполнить запрос.");
  }

  return data;
}

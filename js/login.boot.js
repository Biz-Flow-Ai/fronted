<<<<<<< Updated upstream
(function() {
    function boot() {
        if (typeof Babel === "undefined") {
            setTimeout(boot, 50);
            return;
        }
        if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
            setTimeout(boot, 50);
            return;
        }

        const sourceEl = document.getElementById("login-source");
        if (!sourceEl) {
            console.error("[login.boot] #login-source not found");
            return;
        }

        const source = sourceEl.textContent || "";

        try {
            const { code } = Babel.transform(source, {
                presets: ["react"],
                sourceType: "module",
            });
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.textContent = code;
            document.body.appendChild(script);
        } catch (err) {
            console.error("[login.boot] Babel transform failed:", err);
            const app = document.getElementById("app");
            if (app) {
                app.innerHTML =
                    '<div style="padding:24px;color:#fff;font-family:sans-serif">' +
                    "<p><b>Ошибка инициализации страницы входа.</b></p>" +
                    "<pre style=\"background:rgba(0,0,0,.25);padding:12px;overflow:auto\">" +
                    String(err && err.message ? err.message : err).replace(/</g, "&lt;") +
                    "</pre></div>";
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
=======
(function () {
  // Fallback boot for older login.html that kept JSX in type="text/plain".
  var source = document.getElementById("login-source");
  if (!source || !window.Babel) return;
  try {
    var result = Babel.transform(source.textContent, { presets: ["react"] });
    var script = document.createElement("script");
    script.textContent = result.code;
    document.body.appendChild(script);
  } catch (err) {
    console.error("login.boot.js failed", err);
  }
})();
>>>>>>> Stashed changes

/* ==========================================================================
   LEXTOOLS RD — Shared UI Layer
   Header, footer, dark mode, command palette, progress y toasts.
   Vanilla JS, sin dependencias. Se carga en TODAS las páginas.
   ========================================================================== */
(function () {
    "use strict";

    // ----------------------------------------------------------------------
    // Catálogo de herramientas (fuente única de verdad)
    // ----------------------------------------------------------------------
    const TOOLS = [
        { id: "plazos",       url: "plazos.html",       title: "Calculadora de Plazos",  desc: "Cómputo procesal Ley 139-97", icon: "calendar" },
        { id: "foliador",     url: "foliador.html",     title: "Foliador de PDF",         desc: "Numerar expedientes", icon: "hash" },
        { id: "prestaciones", url: "prestaciones.html", title: "Prestaciones Laborales",  desc: "Cálculo Código Trabajo", icon: "briefcase" },
        { id: "intereses",    url: "intereses.html",    title: "Intereses e Indexación",  desc: "Demora y reajuste", icon: "trending-up" },
        { id: "tasas",        url: "tasas.html",        title: "Tasas e Impuestos",       desc: "DGII y Registros", icon: "receipt" },
        { id: "combinador",   url: "combinador.html",   title: "Combinar / Dividir PDF",  desc: "Merge y split de piezas", icon: "layers" },
        { id: "compresor",    url: "compresor.html",    title: "Compresor de PDF",        desc: "Reducir peso", icon: "archive" },
        { id: "contratos",    url: "contratos.html",    title: "Generador de Contratos",  desc: "Borradores legales", icon: "file-signature" },
        { id: "ocr",          url: "ocr.html",          title: "OCR / Extractor Texto",   desc: "Texto de PDFs escaneados", icon: "scan-text" },
        { id: "firma",        url: "firma.html",        title: "Firma y Sello Digital",   desc: "Estampar en PDF", icon: "pen-tool" }
    ];

    const ICONS = {
        calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        hash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
        briefcase: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        "trending-up": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
        receipt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg>',
        layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        archive: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
        "file-signature": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 18s1-1 2-1 2 1 4 1 3-1 3-1"/></svg>',
        "scan-text": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="17" y2="13"/><line x1="7" y1="17" x2="13" y2="17"/></svg>',
        "pen-tool": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
        home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
        moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="6"/></svg>',
        check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        alert: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    // ----------------------------------------------------------------------
    // Utilidades
    // ----------------------------------------------------------------------
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const currentPage = () => (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const currentToolId = () => {
        const page = currentPage().replace(".html", "");
        const t = TOOLS.find(t => t.id === page);
        return t ? t.id : null;
    };

    // ----------------------------------------------------------------------
    // HEADER + FOOTER
    // ----------------------------------------------------------------------
    function buildHeader() {
        const tool = TOOLS.find(t => t.id === currentToolId());
        const header = document.createElement("header");
        header.className = "lex-header";
        header.innerHTML = `
            <div class="lex-header-inner">
                <a href="index.html" class="lex-brand" aria-label="LexTools RD — Inicio">
                    <span class="lex-brand-mark">Lx</span>
                    <span>LexTools RD<small>Herramientas Legales · RD</small></span>
                </a>
                <nav class="lex-header-nav" aria-label="Principal">
                    <a href="index.html" class="lex-nav-link" ${currentPage() === "index.html" ? 'aria-current="page"' : ""}>Inicio</a>
                    <a href="index.html#herramientas" class="lex-nav-link">Herramientas</a>
                </nav>
                <div class="lex-header-actions">
                    <button class="lex-search-trigger" data-action="open-palette" aria-label="Buscar herramientas">
                        ${ICONS.search}
                        <span>Buscar herramientas…</span>
                        <span class="lex-kbd">Ctrl K</span>
                    </button>
                    <button class="lex-icon-btn" data-action="toggle-theme" aria-label="Cambiar tema claro/oscuro" title="Cambiar tema">
                        <span data-theme-icon></span>
                    </button>
                    <button class="lex-icon-btn lex-mobile-nav-toggle" data-action="open-palette" aria-label="Abrir menú">
                        ${ICONS.menu}
                    </button>
                </div>
            </div>
        `;
        document.body.prepend(header);
        updateThemeIcon();
    }

    function buildBreadcrumb() {
        const tool = TOOLS.find(t => t.id === currentToolId());
        if (!tool) return;
        const container = $(".app-container");
        if (!container) return;
        const nav = document.createElement("nav");
        nav.className = "lex-breadcrumb";
        nav.setAttribute("aria-label", "Ruta de navegación");
        nav.innerHTML = `
            <a href="index.html">Inicio</a>
            <span class="lex-breadcrumb-sep">›</span>
            <span class="lex-breadcrumb-current">${tool.title}</span>
        `;
        container.prepend(nav);
    }

    function buildFooter() {
        const footer = document.createElement("footer");
        footer.className = "lex-footer";
        footer.innerHTML = `
            <span class="lex-footer-brand">LexTools RD</span>
            <p>Portal modular de herramientas gratuitas para abogados dominicanos.</p>
            <nav class="lex-footer-links" aria-label="Enlaces del pie de página">
                <a href="index.html">Inicio</a>
                <a href="plazos.html">Plazos</a>
                <a href="foliador.html">Foliador</a>
                <a href="contratos.html">Contratos</a>
                <a href="ocr.html">OCR</a>
            </nav>
            <p class="lex-footer-disclaimer">
                <strong>100% local y privado.</strong> Ninguno de tus archivos, datos personales o cálculos se suben a un servidor. Todo el procesamiento ocurre en tu navegador.
                <br>&copy; ${new Date().getFullYear()} LexTools RD · Herramienta de referencia. No sustituye asesoría legal profesional.
            </p>
        `;
        document.body.appendChild(footer);
    }

    // ----------------------------------------------------------------------
    // DARK MODE
    // ----------------------------------------------------------------------
    const THEME_KEY = "lex-theme";
    function getTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function applyTheme(theme) {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem(THEME_KEY, theme);
        updateThemeIcon();
    }
    function updateThemeIcon() {
        const el = $("[data-theme-icon]");
        if (el) el.innerHTML = document.documentElement.classList.contains("dark") ? ICONS.sun : ICONS.moon;
    }
    function toggleTheme() {
        applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
    }
    // Aplicar cuanto antes (además del inline script en <head>)
    applyTheme(getTheme());

    // ----------------------------------------------------------------------
    // COMMAND PALETTE
    // ----------------------------------------------------------------------
    let paletteEl, paletteInput, paletteList, paletteSelected = 0, paletteResults = [];

    function buildPalette() {
        paletteEl = document.createElement("div");
        paletteEl.className = "lex-cmd-backdrop";
        paletteEl.setAttribute("role", "dialog");
        paletteEl.setAttribute("aria-modal", "true");
        paletteEl.setAttribute("aria-label", "Búsqueda de herramientas");
        paletteEl.innerHTML = `
            <div class="lex-cmd-modal">
                <div class="lex-cmd-input-wrap">
                    ${ICONS.search}
                    <input type="text" class="lex-cmd-input" placeholder="Buscar herramienta o acción…" aria-label="Buscar">
                </div>
                <div class="lex-cmd-list" role="listbox"></div>
                <div class="lex-cmd-footer">
                    <span><kbd>↑</kbd><kbd>↓</kbd> navegar · <kbd>↵</kbd> abrir · <kbd>Esc</kbd> cerrar</span>
                    <span>${TOOLS.length} herramientas</span>
                </div>
            </div>
        `;
        document.body.appendChild(paletteEl);
        paletteInput = $(".lex-cmd-input", paletteEl);
        paletteList = $(".lex-cmd-list", paletteEl);

        paletteEl.addEventListener("click", (e) => { if (e.target === paletteEl) closePalette(); });
        paletteInput.addEventListener("input", renderPalette);
        paletteInput.addEventListener("keydown", handlePaletteKey);
    }

    function renderPalette() {
        const q = paletteInput.value.trim().toLowerCase();
        const filtered = q
            ? TOOLS.filter(t => (t.title + " " + t.desc + " " + t.id).toLowerCase().includes(q))
            : TOOLS;

        const actions = [
            { id: "action-theme", title: document.documentElement.classList.contains("dark") ? "Cambiar a modo claro" : "Cambiar a modo oscuro", desc: "Alternar tema", icon: document.documentElement.classList.contains("dark") ? "sun" : "moon", action: () => { toggleTheme(); closePalette(); } },
            { id: "action-home", title: "Ir a Inicio", desc: "Portal principal", icon: "home", url: "index.html" }
        ].filter(a => !q || (a.title + " " + a.desc).toLowerCase().includes(q));

        paletteResults = [...filtered.map(t => ({ ...t, kind: "tool" })), ...actions.map(a => ({ ...a, kind: "action" }))];
        paletteSelected = 0;

        if (paletteResults.length === 0) {
            paletteList.innerHTML = `<div class="lex-cmd-empty">Sin resultados para "${escapeHtml(q)}"</div>`;
            return;
        }
        const tools = paletteResults.filter(r => r.kind === "tool");
        const acts = paletteResults.filter(r => r.kind === "action");
        let html = "";
        if (tools.length) {
            html += `<div class="lex-cmd-group-label">Herramientas</div>`;
            tools.forEach((r, i) => html += renderItem(r, i));
        }
        if (acts.length) {
            html += `<div class="lex-cmd-group-label">Acciones</div>`;
            acts.forEach((r) => html += renderItem(r, tools.length + acts.indexOf(r)));
        }
        paletteList.innerHTML = html;
        paletteList.querySelectorAll(".lex-cmd-item").forEach((el, idx) => {
            el.addEventListener("click", () => activateResult(idx));
            el.addEventListener("mouseenter", () => setSelected(idx));
        });
        updateSelected();
    }

    function renderItem(r, idx) {
        return `
            <div class="lex-cmd-item" role="option" data-idx="${idx}">
                <span class="lex-cmd-item-icon">${ICONS[r.icon] || ICONS.info}</span>
                <span class="lex-cmd-item-body">
                    <div class="lex-cmd-item-title">${escapeHtml(r.title)}</div>
                    <div class="lex-cmd-item-desc">${escapeHtml(r.desc)}</div>
                </span>
            </div>
        `;
    }

    function setSelected(i) {
        paletteSelected = Math.max(0, Math.min(paletteResults.length - 1, i));
        updateSelected();
    }
    function updateSelected() {
        paletteList.querySelectorAll(".lex-cmd-item").forEach((el, i) => {
            el.setAttribute("aria-selected", i === paletteSelected ? "true" : "false");
            if (i === paletteSelected) el.scrollIntoView({ block: "nearest" });
        });
    }
    function activateResult(idx) {
        const r = paletteResults[idx];
        if (!r) return;
        if (r.action) { r.action(); return; }
        if (r.url) { window.location.href = r.url; }
    }
    function handlePaletteKey(e) {
        if (e.key === "ArrowDown") { e.preventDefault(); setSelected(paletteSelected + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setSelected(paletteSelected - 1); }
        else if (e.key === "Enter") { e.preventDefault(); activateResult(paletteSelected); }
        else if (e.key === "Escape") { e.preventDefault(); closePalette(); }
    }
    function openPalette() {
        paletteEl.classList.add("open");
        paletteInput.value = "";
        renderPalette();
        setTimeout(() => paletteInput.focus(), 30);
    }
    function closePalette() { paletteEl.classList.remove("open"); }

    // ----------------------------------------------------------------------
    // TOASTS + PROGRESS  (LexUI)
    // ----------------------------------------------------------------------
    let toastsWrap;
    function ensureToastsWrap() {
        if (!toastsWrap) {
            toastsWrap = document.createElement("div");
            toastsWrap.className = "lex-toasts";
            toastsWrap.setAttribute("role", "status");
            toastsWrap.setAttribute("aria-live", "polite");
            document.body.appendChild(toastsWrap);
        }
        return toastsWrap;
    }
    function toast(message, opts) {
        opts = opts || {};
        const kind = opts.kind || "info";
        const duration = opts.duration || 3800;
        ensureToastsWrap();
        const iconKey = kind === "success" ? "check" : kind === "error" ? "alert" : kind === "warning" ? "alert" : "info";
        const el = document.createElement("div");
        el.className = "lex-toast " + kind;
        el.innerHTML = `
            <span class="lex-toast-icon">${ICONS[iconKey]}</span>
            <span class="lex-toast-body">${escapeHtml(message)}</span>
            <button class="lex-toast-close" aria-label="Cerrar">${ICONS.x}</button>
        `;
        toastsWrap.appendChild(el);
        const remove = () => {
            el.classList.add("leaving");
            setTimeout(() => el.remove(), 250);
        };
        el.querySelector(".lex-toast-close").addEventListener("click", remove);
        setTimeout(remove, duration);
    }

    // Progress bar (una por página, se auto-inserta antes del primer button de la tool)
    function ensureProgress() {
        let el = $(".lex-progress[data-shared]");
        if (el) return el;
        el = document.createElement("div");
        el.className = "lex-progress";
        el.setAttribute("data-shared", "true");
        el.setAttribute("role", "progressbar");
        el.setAttribute("aria-valuemin", "0");
        el.setAttribute("aria-valuemax", "100");
        el.innerHTML = `
            <div class="lex-progress-header">
                <span class="lex-progress-label">Procesando…</span>
                <span class="lex-progress-percent"></span>
            </div>
            <div class="lex-progress-track"><div class="lex-progress-fill"></div></div>
        `;
        // Insertar tras el primer botón .btn-primary de la página
        const anchor = $(".tool-body .btn-primary") || $(".tool-body button") || $(".tool-body");
        if (anchor && anchor.parentNode) {
            anchor.parentNode.insertBefore(el, anchor.nextSibling);
        } else {
            document.body.appendChild(el);
        }
        return el;
    }
    const progress = {
        start(label) {
            const el = ensureProgress();
            el.classList.add("active", "indeterminate");
            $(".lex-progress-label", el).textContent = label || "Procesando…";
            $(".lex-progress-percent", el).textContent = "";
            $(".lex-progress-fill", el).style.width = "";
        },
        update(ratio, label) {
            const el = ensureProgress();
            el.classList.add("active");
            el.classList.remove("indeterminate");
            const pct = Math.max(0, Math.min(1, ratio)) * 100;
            $(".lex-progress-fill", el).style.width = pct + "%";
            $(".lex-progress-percent", el).textContent = Math.round(pct) + "%";
            el.setAttribute("aria-valuenow", String(Math.round(pct)));
            if (label) $(".lex-progress-label", el).textContent = label;
        },
        done(label) {
            const el = ensureProgress();
            if (label) $(".lex-progress-label", el).textContent = label;
            setTimeout(() => {
                el.classList.remove("active", "indeterminate");
                $(".lex-progress-fill", el).style.width = "0%";
            }, 400);
        }
    };

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    // Exponer API global
    window.LexUI = {
        toast: {
            info: (m, o) => toast(m, { ...o, kind: "info" }),
            success: (m, o) => toast(m, { ...o, kind: "success" }),
            error: (m, o) => toast(m, { ...o, kind: "error" }),
            warning: (m, o) => toast(m, { ...o, kind: "warning" }),
        },
        progress,
        tools: TOOLS
    };

    // ----------------------------------------------------------------------
    // Init
    // ----------------------------------------------------------------------
    function init() {
        buildHeader();
        buildBreadcrumb();
        buildFooter();
        buildPalette();

        // Delegación de clicks para actions del header
        document.addEventListener("click", (e) => {
            const trigger = e.target.closest("[data-action]");
            if (!trigger) return;
            const a = trigger.getAttribute("data-action");
            if (a === "toggle-theme") toggleTheme();
            else if (a === "open-palette") openPalette();
        });

        // Atajos globales
        document.addEventListener("keydown", (e) => {
            const isMod = e.ctrlKey || e.metaKey;
            if (isMod && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (paletteEl && paletteEl.classList.contains("open")) closePalette();
                else openPalette();
            } else if (e.key === "Escape" && paletteEl && paletteEl.classList.contains("open")) {
                closePalette();
            }
        });

        // Interceptar alert() en las páginas de herramientas para convertirlo en toast
        // (los JS existentes usan alert() para validación)
        const nativeAlert = window.alert;
        window.alert = function (msg) {
            if (typeof msg === "string" && msg.length < 250) {
                LexUI.toast.warning(msg, { duration: 4200 });
            } else {
                nativeAlert(msg);
            }
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

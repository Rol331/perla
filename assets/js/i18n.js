/* ==========================================================================
   Campamento La Perla — traducción del sitio (español · inglés · alemán)
   Sin dependencias externas.

   Cómo funciona
   -------------
   · El HTML está escrito en español: ese es el idioma por defecto y el que
     ven los buscadores. Cada texto traducible lleva un atributo:
        data-i18n="clave"              → el contenido del elemento
        data-i18n-alt / -aria / -title
        data-i18n-placeholder / -content / -caption → atributos
   · Los diccionarios viven en assets/i18n/en.js y assets/i18n/de.js y se
     descargan solo cuando el visitante elige ese idioma.
   · El español no necesita diccionario: se guarda una copia del texto
     original del documento al cargar la página.

   Para añadir o corregir un texto
   -------------------------------
   1. Edite el español en el HTML (o añada data-i18n="clave-nueva").
   2. Añada esa misma clave en assets/i18n/en.js y assets/i18n/de.js.
   Abra cualquier página con ?i18n-debug=1 para ver en la consola qué claves
   faltan o sobran en cada diccionario.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "laperla-lang";
  var SUPPORTED = ["es", "en", "de"];
  /* Valor del atributo lang del documento por idioma */
  var HTML_LANG = { es: "es-PE", en: "en", de: "de" };
  /* Sufijo del atributo data-i18n-*  →  atributo real que se traduce */
  var ATTRS = {
    alt: "alt",
    aria: "aria-label",
    title: "title",
    placeholder: "placeholder",
    content: "content",
    caption: "data-caption"
  };

  /* Textos que solo existen dentro del JavaScript (no están en el HTML) */
  var UI_ES = {
    "ui-cerrar-menu": "Cerrar menú",
    "ui-form-status": "Abrimos WhatsApp con su consulta lista para enviar. Si no se abrió, escríbanos al {tel}.",
    "ui-idioma": "Idioma"
  };

  var dicts = { es: {} };          /* idioma → { clave: texto } */
  var pending = {};                /* idioma → [callbacks] en descarga */
  var lang = "es";
  var listeners = [];

  var $$ = function (sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  };

  /* Carpeta de los diccionarios, deducida del src de este script */
  var base = "assets/i18n/";
  (function () {
    var me = document.currentScript;
    if (!me) {
      var all = document.getElementsByTagName("script");
      me = all[all.length - 1];
    }
    if (me && me.src) base = me.src.replace(/js\/i18n\.js(\?.*)?$/, "i18n/");
  })();

  /* ------------------------------------------------- elementos traducibles */
  var textNodes = function () { return $$("[data-i18n]"); };
  var attrNodes = function () {
    var sels = [];
    for (var suffix in ATTRS) sels.push("[data-i18n-" + suffix + "]");
    return $$(sels.join(","));
  };

  /* Guarda el español tal como viene en el documento */
  var snapshot = function () {
    textNodes().forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && !(key in dicts.es)) dicts.es[key] = el.innerHTML.trim();
    });
    attrNodes().forEach(function (el) {
      for (var suffix in ATTRS) {
        var key = el.getAttribute("data-i18n-" + suffix);
        if (!key || key in dicts.es) continue;
        var v = el.getAttribute(ATTRS[suffix]);
        if (v !== null) dicts.es[key] = v;
      }
    });
  };

  /* ------------------------------------------------------------ búsquedas */
  var lookup = function (key, l) {
    var d = dicts[l];
    if (d && typeof d[key] === "string" && d[key] !== "") return d[key];
    return null;
  };
  var t = function (key) {
    return lookup(key, lang) || lookup(key, "es") || UI_ES[key] || key;
  };
  var es = function (key) {
    return lookup(key, "es") || UI_ES[key] || key;
  };

  /* ------------------------------------------------------------- aplicar */
  var apply = function (l) {
    textNodes().forEach(function (el) {
      var v = lookup(el.getAttribute("data-i18n"), l) ||
              lookup(el.getAttribute("data-i18n"), "es");
      if (v === null || v === undefined) return;
      if (v.indexOf("<") >= 0) el.innerHTML = v;
      else el.textContent = v;
    });
    attrNodes().forEach(function (el) {
      for (var suffix in ATTRS) {
        var key = el.getAttribute("data-i18n-" + suffix);
        if (!key) continue;
        var v = lookup(key, l) || lookup(key, "es");
        if (v) el.setAttribute(ATTRS[suffix], v);
      }
    });
    document.documentElement.lang = HTML_LANG[l] || l;
  };

  var markButtons = function (l) {
    $$(".lang-switch__btn").forEach(function (b) {
      var on = b.getAttribute("data-lang") === l;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  };

  var reveal = function () {
    document.documentElement.classList.remove("i18n-pending");
  };

  /* -------------------------------------------------- carga de diccionario */
  var load = function (l, done) {
    if (l === "es" || dicts[l]) return done();
    if (pending[l]) { pending[l].push(done); return; }
    pending[l] = [done];
    var s = document.createElement("script");
    s.src = base + l + ".js";
    s.onload = s.onerror = function () {
      /* Si falla la descarga se queda en español, sin romper la página */
      if (!dicts[l]) dicts[l] = {};
      var queue = pending[l];
      delete pending[l];
      queue.forEach(function (fn) { fn(); });
    };
    document.head.appendChild(s);
  };

  /* ------------------------------------------------------- cambiar idioma */
  var setLang = function (l, opts) {
    if (SUPPORTED.indexOf(l) < 0) l = "es";
    opts = opts || {};
    load(l, function () {
      lang = l;
      apply(l);
      markButtons(l);
      reveal();
      if (opts.remember !== false) {
        try { localStorage.setItem(STORE_KEY, l); } catch (e) {}
      }
      listeners.forEach(function (fn) { fn(l); });
      if (/[?&]i18n-debug=1/.test(location.search)) audit(l);
    });
  };

  /* ---------------------------------------------------- idioma de arranque */
  var initialLang = function () {
    var m = location.search.match(/[?&]lang=(es|en|de)/);
    if (m) return m[1];
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) >= 0) return saved;
    /* Primera visita: se respeta el idioma del navegador si es inglés o alemán */
    var nav = (navigator.language || "es").toLowerCase();
    if (nav.indexOf("en") === 0) return "en";
    if (nav.indexOf("de") === 0) return "de";
    return "es";
  };

  /* --------------------------------------------------------- diagnóstico */
  var audit = function (l) {
    if (l === "es") return;
    var used = {}, missing = [], unused = [];
    textNodes().forEach(function (el) { used[el.getAttribute("data-i18n")] = 1; });
    attrNodes().forEach(function (el) {
      for (var suffix in ATTRS) {
        var k = el.getAttribute("data-i18n-" + suffix);
        if (k) used[k] = 1;
      }
    });
    Object.keys(used).forEach(function (k) {
      if (!lookup(k, l)) missing.push(k);
    });
    Object.keys(dicts[l] || {}).forEach(function (k) {
      if (!used[k]) unused.push(k);
    });
    console.log("[i18n] " + l + ": " + Object.keys(used).length +
      " claves en esta página, " + missing.length + " sin traducir.");
    if (missing.length) console.warn("[i18n] faltan en " + l + ".js:", missing);
    if (unused.length) console.info("[i18n] no se usan en esta página:", unused.length);
  };

  /* --------------------------------------------------------------- inicio */
  snapshot();

  window.LaPerlaI18n = {
    /* Lo llaman los diccionarios assets/i18n/<idioma>.js */
    register: function (l, dict) { dicts[l] = dict; },
    current: function () { return lang; },
    set: setLang,
    t: t,
    es: es,
    /* Texto en español de un elemento marcado con data-i18n */
    esOf: function (el) {
      var k = el && el.getAttribute && el.getAttribute("data-i18n");
      return k ? es(k) : (el ? (el.textContent || "").trim() : "");
    },
    onChange: function (fn) { listeners.push(fn); },
    name: function (l) {
      return { es: "Español", en: "English", de: "Deutsch" }[l || lang] || l;
    }
  };

  $$(".lang-switch__btn").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.getAttribute("data-lang"));
    });
  });

  var start = initialLang();
  if (start === "es") {
    markButtons("es");
    reveal();
    if (/[?&]i18n-debug=1/.test(location.search)) audit("es");
  } else {
    /* No se recuerda si vino del idioma del navegador y no de una elección */
    setLang(start, { remember: false });
  }
})();

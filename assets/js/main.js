/* ==========================================================================
   Campamento La Perla — interacciones del sitio
   Sin dependencias externas.
   ========================================================================== */
(function () {
  "use strict";

  var WHATSAPP = "51992746927";
  var TELEFONO = "992 746 927";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------- año */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------- cabecera al hacer scroll */
  var header = $("#siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ menú móvil */
  var burger = $("#burger");
  var mobileMenu = $("#mobileMenu");
  if (burger && mobileMenu) {
    var toggleMenu = function (open) {
      burger.classList.toggle("is-open", open);
      mobileMenu.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("is-locked", open);
    };
    burger.addEventListener("click", function () {
      toggleMenu(!mobileMenu.classList.contains("is-open"));
    });
    $$("a", mobileMenu).forEach(function (a) {
      a.addEventListener("click", function () { toggleMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) toggleMenu(false);
    });
    /* Cerrar al hacer clic fuera del menú */
    document.addEventListener("click", function (e) {
      if (mobileMenu.classList.contains("is-open") &&
          !mobileMenu.contains(e.target) &&
          !burger.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  /* ------------------------------------------------- carrusel de portada */
  var heroSlides = $("#heroSlides");
  if (heroSlides) {
    var slides = $$(".hero__slide", heroSlides);
    var dots = $$("button", $("#heroDots") || document.createElement("div"));
    var current = 0;
    var heroTimer = null;

    var goSlide = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle("is-active", si === current); });
      dots.forEach(function (d, di) { d.classList.toggle("is-active", di === current); });
    };
    var playHero = function () {
      stopHero();
      if (slides.length > 1) heroTimer = setInterval(function () { goSlide(current + 1); }, 6000);
    };
    var stopHero = function () { if (heroTimer) clearInterval(heroTimer); };

    dots.forEach(function (d, di) {
      d.addEventListener("click", function () { goSlide(di); playHero(); });
    });

    /* No animar si el visitante pidió menos movimiento */
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) playHero();
  }

  /* ------------------------------------------------------- volver arriba */
  var toTop = $("#toTop");
  if (toTop) {
    var onScrollTop = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* --------------------------------------------- aparición al hacer scroll */
  var revealItems = $$("[data-reveal]");
  if (revealItems.length) {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          setTimeout(function () { el.classList.add("is-visible"); }, i * 90);
          obs.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealItems.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ------------------------------------------------------------- visor */
  var lightbox = $("#lightbox");
  var lightboxImg = $("#lightboxImg");
  var lightboxCaption = $("#lightboxCaption");
  var lbItems = [];
  var lbIndex = 0;
  var lbLastFocus = null;

  var getFocusable = function (container) {
    return $$(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter(function (el) {
      return el.offsetParent !== null;
    });
  };

  var trapFocus = function (e, container) {
    var focusable = getFocusable(container);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  var showLightbox = function (i) {
    if (!lbItems.length) return;
    lbIndex = (i + lbItems.length) % lbItems.length;
    var item = lbItems[lbIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent =
      item.caption + "  ·  " + (lbIndex + 1) + " / " + lbItems.length;
  };
  var openLightbox = function (items, i, triggerEl) {
    if (!lightbox) return;
    lbItems = items;
    lbLastFocus = triggerEl || document.activeElement;
    showLightbox(i);
    lightbox.classList.add("is-open");
    document.body.classList.add("is-locked");
    /* Mover foco al primer elemento focusable del lightbox */
    setTimeout(function () {
      var focusable = getFocusable(lightbox);
      if (focusable.length) focusable[0].focus();
    }, 50);
  };
  var closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    /* Retornar foco al elemento que abrió el lightbox */
    if (lbLastFocus && lbLastFocus.focus) {
      setTimeout(function () { lbLastFocus.focus(); }, 50);
    }
  };

  $$("[data-gallery]").forEach(function (gallery) {
    var figures = $$(".gallery__item", gallery);
    var items = figures.map(function (fig) {
      var im = $("img", fig);
      return { el: im, caption: fig.getAttribute("data-caption") || (im ? im.alt : "") };
    });
    figures.forEach(function (fig, i) {
      fig.addEventListener("click", function () {
        openLightbox(items.map(function (it) {
          return { src: it.el ? it.el.currentSrc || it.el.src : "", caption: it.caption };
        }), i, fig);
      });
      /* Hacer las figuras focusables para accesibilidad */
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(items.map(function (it) {
            return { src: it.el ? it.el.currentSrc || it.el.src : "", caption: it.caption };
          }), i, fig);
        }
      });
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      var action = e.target.getAttribute && e.target.getAttribute("data-lb");
      if (action === "close" || e.target === lightbox) return closeLightbox();
      if (action === "prev") return showLightbox(lbIndex - 1);
      if (action === "next") return showLightbox(lbIndex + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
      if (e.key === "Tab") trapFocus(e, lightbox);
    });
  }

  /* -------------------------------------------------------------- formulario
     Sin backend: arma un mensaje de WhatsApp con los datos del formulario.
     Para recibirlos por correo, reemplace este bloque por su propio endpoint. */
  var labelFor = function (field) {
    var lbl = field.form.querySelector('label[for="' + field.id + '"]');
    return lbl ? lbl.textContent.trim() : field.name;
  };

  $$("[data-form]").forEach(function (form) {
    var kind = form.getAttribute("data-form");
    var status = $("#" + kind + "Status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var lines = ["Hola, escribo desde la web de Campamento La Perla."];
      $$("input, select, textarea", form).forEach(function (field) {
        if (!field.value) return;
        lines.push(labelFor(field) + ": " + field.value);
      });

      window.open(
        "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n")),
        "_blank", "noopener"
      );

      if (status) {
        status.hidden = false;
        status.textContent =
          "Abrimos WhatsApp con su consulta lista para enviar. Si no se abrió, escríbanos al " +
          TELEFONO + ".";
      }
    });
  });
})();

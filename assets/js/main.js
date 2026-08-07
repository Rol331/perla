/* ==========================================================================
   Campamento La Perla — interacciones del sitio
   Sin dependencias externas.
   ========================================================================== */
(function () {
  "use strict";

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

  /* ------------------------------------------------------------ contadores */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        if (isNaN(target)) return;
        var start = null;
        var duration = 1400;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ------------------------------------------------- slider de testimonios */
  $$(".slider").forEach(function (slider) {
    var track = $(".slider__track", slider);
    var slides = $$(".slider__slide", slider);
    if (!track || slides.length < 2) return;

    var dotsWrap = document.querySelector('.slider__dots[data-for="' + slider.id + '"]');
    var dots = dotsWrap ? $$("button", dotsWrap) : [];
    var index = 0;
    var timer = null;

    var go = function (i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) { d.classList.toggle("is-active", di === index); });
    };
    var play = function () {
      stop();
      timer = setInterval(function () { go(index + 1); }, 6500);
    };
    var stop = function () { if (timer) clearInterval(timer); };

    dots.forEach(function (d, di) {
      d.addEventListener("click", function () { go(di); play(); });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);

    /* deslizar con el dedo */
    var startX = null;
    slider.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      stop();
    }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      startX = null;
      play();
    });

    go(0);
    play();
  });

  /* ------------------------------------------------------------- lightbox */
  var lightbox = $("#lightbox");
  var lightboxImg = $("#lightboxImg");
  var lightboxCaption = $("#lightboxCaption");
  var lbItems = [];
  var lbIndex = 0;

  var openLightbox = function (items, i) {
    if (!lightbox) return;
    lbItems = items;
    showLightbox(i);
    lightbox.classList.add("is-open");
    document.body.classList.add("is-locked");
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
  var closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("is-locked");
  };

  $$("[data-gallery]").forEach(function (gallery) {
    var figures = $$(".gallery__item", gallery);
    var items = figures.map(function (fig) {
      var im = $("img", fig);
      return {
        el: im,
        caption: fig.getAttribute("data-caption") || (im ? im.alt : "")
      };
    });
    figures.forEach(function (fig, i) {
      fig.addEventListener("click", function () {
        openLightbox(
          items.map(function (it) {
            return { src: it.el ? it.el.currentSrc || it.el.src : "", caption: it.caption };
          }),
          i
        );
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
    });
  }

  /* -------------------------------------------------------------- formularios
     Sin backend: se arma un mensaje de WhatsApp con los datos del formulario.
     Para enviar por correo, reemplace este bloque por su propio endpoint. */
  var WHATSAPP = "5199274692";

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

      var lines = [
        kind === "contacto"
          ? "Hola, escribo desde la web de Campamento La Perla."
          : "Hola, quisiera consultar disponibilidad en Campamento La Perla."
      ];
      $$("input, select, textarea", form).forEach(function (field) {
        if (!field.value) return;
        lines.push(labelFor(field) + ": " + field.value);
      });

      var url =
        "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");

      if (status) {
        status.hidden = false;
        status.textContent =
          "Abrimos WhatsApp con su consulta lista para enviar. Si no se abrió, escríbanos al " +
          "992 74692.";
      }
    });
  });
})();

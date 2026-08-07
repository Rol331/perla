/* Respaldo de imágenes.
   Cada <img> apunta a un archivo local en assets/img/. Mientras esos archivos
   no existan, se carga automáticamente una imagen temática de referencia
   (data-fallback). En cuanto copie las fotos reales con el mismo nombre, el
   sitio las usa sin necesidad de tocar el HTML.

   Se carga de forma síncrona en <head> para capturar el error antes de que
   el navegador pinte la imagen rota. */
(function () {
  "use strict";
  document.addEventListener(
    "error",
    function (event) {
      var el = event.target;
      if (!el || el.tagName !== "IMG") return;
      var fallback = el.getAttribute("data-fallback");
      if (!fallback || el.dataset.fallbackApplied) return;
      el.dataset.fallbackApplied = "1";
      el.src = fallback;
    },
    true
  );
})();

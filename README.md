# Campamento La Perla — sitio web

Sitio estático en HTML, CSS y JavaScript puro (sin frameworks ni build).
Contenido, marca y estructura según **«PÁGINA WEB LA PERLA.pdf»**.

- **En línea:** https://rol331.github.io/perla/

## Marca

| Color | Hex | Uso |
|---|---|---|
| Verde | `#112b14` | Fondos oscuros, títulos, pie de página |
| Naranja | `#d9880e` | Botones, acentos, cifras, antetítulos |
| Crema | `#fffcdf` | Fondos claros alternos |

**Tipografías:** Valden para los títulos, Inter para el cuerpo. Ambas están
**autoalojadas** en `assets/fonts/` (convertidas a woff2 desde los archivos
originales de `fuentes/`), así que el sitio no depende de Google Fonts.

| Archivo | Origen | Peso |
|---|---|---|
| `valden.woff2` | `fuentes/valden.otf` | 21 KB |
| `inter.woff2` | `fuentes/Inter-VariableFont_opsz,wght.ttf` | 341 KB (variable, pesos 100–900) |

**Logotipo:** `assets/img/logo-claro.png` (texto crema). Es la única variante
que hace falta: la cabecera va siempre sobre fondo oscuro — la foto de portada
al principio y el verde corporativo al hacer scroll. El favicon sale del mismo
icono.

## Cómo verlo

```bash
python3 -m http.server 8000
# luego abra http://localhost:8000
```

## Estructura

```
.
├── index.html            Inicio (carrusel de 3 fotos)
├── hospedaje.html        Bungalows y habitaciones
├── restaurante.html      Cocina campestre y carta
├── retiros.html          Jornadas espirituales y retiros escolares
├── eventos.html          Fiestas, banquetes y celebraciones
├── corporativos.html     Capacitaciones y team building
├── recreacion.html       Deporte, juegos, fogatas y alrededores
├── galeria.html          Galería con visor a pantalla completa
├── nosotros.html         Historia desde 1968
├── contacto.html         Formulario, datos y mapa
└── assets/
    ├── css/style.css     Hoja de estilos (comentada por secciones)
    ├── js/main.js        Menú, carrusel, visor, animaciones, formulario
    ├── js/i18n.js        Traducción del sitio (es · en · de)
    ├── i18n/en.js        Diccionario inglés
    ├── i18n/de.js        Diccionario alemán
    ├── fonts/            ← aquí va valden.woff2
    └── img/              73 fotos procesadas (16 MB)
```

### Menú

El PDF pide `Inicio | Hospedaje | Retiros | Eventos | Corporativos | Nosotros |
Contacto`, pero también trae contenido para Restaurante, Recreación y Galería.
Se resolvió con dos submenús:

- **Hospedaje** › Habitaciones · Restaurante
- **Eventos** › Eventos y fiestas · Recreación · Galería

## Idiomas (español · inglés · alemán)

El HTML está escrito **en español**: es el idioma por defecto y el que indexan
los buscadores. El inglés y el alemán se aplican en el navegador con
`assets/js/i18n.js`, así que cada página existe una sola vez.

- Selector **ES · EN · DE** en la cabecera, también en móvil.
- La elección se recuerda en el navegador (`localStorage`) y vale para todas
  las páginas.
- En la primera visita, si el navegador está en inglés o alemán el sitio se
  muestra en ese idioma; en cualquier otro caso, en español.
- Se puede forzar con la dirección: `index.html?lang=en`, `?lang=de`, `?lang=es`
  (útil para enlazar la versión en inglés desde redes o Google Business).
- Se traducen también los `<title>`, las `description`, las etiquetas Open
  Graph, los textos `alt` de las fotos y los rótulos del formulario.
- Si el diccionario no carga, la página se queda en español: nunca aparece
  vacía ni a medias.

### Cómo se marca un texto traducible

```html
<h2 data-i18n="lo-que-nos-define">Lo que nos define</h2>
<img data-i18n-alt="fogata-nocturna" alt="Fogata nocturna" src="...">
```

| Atributo | Traduce |
|---|---|
| `data-i18n` | El contenido del elemento |
| `data-i18n-alt` | El `alt` de una imagen |
| `data-i18n-aria` | El `aria-label` |
| `data-i18n-title` | El `title` |
| `data-i18n-placeholder` | El `placeholder` de un campo |
| `data-i18n-content` | El `content` de un `<meta>` |
| `data-i18n-caption` | El `data-caption` de la galería |

La clave se repite en todas las páginas donde aparece el mismo texto, así que
el menú y el pie se traducen una sola vez.

### Cómo cambiar o añadir un texto

1. Edite el español directamente en el HTML.
2. Añada o corrija esa misma clave en `assets/i18n/en.js` y `assets/i18n/de.js`.

Para comprobar que no falta nada, abra cualquier página con **`?i18n-debug=1`**
y mire la consola del navegador: lista las claves de la página sin traducir y
las del diccionario que ya no se usan.

> El mensaje que llega por WhatsApp desde el formulario **siempre va en
> español** (rótulos y opciones incluidos), con una línea extra que avisa en qué
> idioma navegaba el visitante, para poder responderle en el suyo.

## Imágenes

Las 73 fotos salen de las carpetas originales en `img/` (que se mantiene como
fuente y **no se publica**). El script de procesamiento las redimensiona y
comprime a JPEG progresivo.

Para regenerarlas tras añadir o cambiar fotos, edite el mapa `MAP` del script
de procesamiento y vuelva a ejecutarlo.

**Falta una foto:** no hay ninguna del dormitorio militar / grupal, así que esa
tarjeta usa por ahora una imagen de un ambiente compartido. Si consiguen la
foto, reemplacen `assets/img/hab-grupal.jpg`.

## Datos de contacto

| Dato | Valor |
|---|---|
| Dirección | Av. La Eternidad 1085, Chupaca 12455, Junín, Perú |
| Teléfono / WhatsApp | 992 746 927 |
| Correo | campamentolaperla@gmail.com |
| Facebook | facebook.com/laperlachupaca |
| Instagram | instagram.com/la_perla_campamento |
| TikTok | tiktok.com/@laperlahospedaje |

## Formulario

No hay backend. Al enviar, el formulario arma un mensaje de WhatsApp con los
datos y lo abre en una pestaña nueva. Para recibirlos por correo, reemplace el
bloque final de `assets/js/main.js` por un `fetch()` a su endpoint (Formspree,
Vercel Functions, etc.).

## Publicación en GitHub Pages

Ya está configurado. Para actualizar:

```bash
git add -A && git commit -m "descripción del cambio" && git push
```

Pages se reconstruye solo en 1–2 minutos.

## Notas técnicas

- Sin dependencias externas salvo Google Fonts y el mapa embebido.
- Responsive desde 320 px; menú a pantalla completa en móvil.
- Respeta `prefers-reduced-motion` (incluido el carrusel de portada).
- Etiquetas `<title>`, `description` y Open Graph propias en cada página,
  traducidas al inglés y al alemán.
- Carga diferida en todas las imágenes salvo las de portada.

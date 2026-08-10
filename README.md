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

**Logotipo:** `assets/img/logo-claro.png` (texto crema, para fondos oscuros y
foto) y `assets/img/logo-oscuro.png` (texto verde, para la cabecera blanca al
hacer scroll). La variante oscura se generó a partir de la clara recoloreando
el texto; el icono naranja se mantiene igual. El favicon sale del mismo icono.

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
    ├── fonts/            ← aquí va valden.woff2
    └── img/              73 fotos procesadas (16 MB)
```

### Menú

El PDF pide `Inicio | Hospedaje | Retiros | Eventos | Corporativos | Nosotros |
Contacto`, pero también trae contenido para Restaurante, Recreación y Galería.
Se resolvió con dos submenús:

- **Hospedaje** › Habitaciones · Restaurante
- **Eventos** › Eventos y fiestas · Recreación · Galería

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
- Etiquetas `<title>`, `description` y Open Graph propias en cada página.
- Carga diferida en todas las imágenes salvo las de portada.

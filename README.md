# Campamento La Perla — sitio web

Sitio estático en HTML, CSS y JavaScript puro (sin frameworks ni build).
Diseño basado en la plantilla **Luxex** (tipografías Montserrat / Raleway /
Oswald, paleta blanco–gris–negro con acento dorado `#f3bf3d`).

## Cómo verlo

Abra `index.html` en el navegador, o levante un servidor local:

```bash
python3 -m http.server 8000
# luego abra http://localhost:8000
```

> El formulario y el visor de imágenes funcionan igual con doble clic, pero
> conviene usar el servidor local para que el mapa y las fuentes carguen bien.

## Estructura

```
.
├── index.html                Inicio
├── nosotros.html             Historia, instalaciones, cifras
├── habitaciones.html         Listado de los 4 tipos de habitación
│   ├── habitacion-doble.html      Ficha de detalle
│   └── habitacion-familiar.html   Ficha de detalle
├── restaurante.html          Carta, heladería, horarios
├── eventos.html              Bodas, convenciones, capacitaciones
├── recreacion.html           Canchas, gimnasio, jardines, alrededores
├── galeria.html              Galería con visor a pantalla completa
├── contacto.html             Formulario, datos y mapa
└── assets/
    ├── css/style.css         Toda la hoja de estilos (comentada por secciones)
    ├── js/main.js            Menú, scroll, slider, visor, contadores, formularios
    ├── js/fallback.js        Respaldo automático de imágenes
    └── img/                  Aquí van las fotos — ver assets/img/LEEME.txt
```

## Imágenes

Las fotos de Facebook no se pudieron descargar (Facebook bloquea el acceso sin
sesión iniciada), así que el sitio usa **imágenes temáticas provisionales de
Unsplash** como referencia visual.

Para poner las reales basta con copiar los archivos en `assets/img/` con los
nombres indicados en **`assets/img/LEEME.txt`**. No hay que editar el HTML: el
script `fallback.js` usa el archivo local si existe y recurre a la imagen
provisional solo si falta.

## Pendiente de confirmar antes de publicar

Estos datos vienen de fuentes públicas (InfoIsInfo, TripAdvisor) y conviene
verificarlos con el cliente:

| Dato | Valor actual | Dónde se cambia |
|---|---|---|
| **Teléfono** | `992 74692` | `assets/js/main.js` (const `WHATSAPP`) y las páginas HTML |
| **Correo** | `reservas@campamentolaperla.com.pe` | páginas HTML (inventado, hay que confirmarlo) |
| Dirección | Av. La Eternidad 1085, Chupaca 12455, Junín | páginas HTML |
| Tarifas | Aparecen como “Consultar” | `habitaciones.html` y fichas de detalle |
| Horarios | Check-in 14:00 / check-out 12:00 (referenciales) | `habitaciones.html` |
| Carta del restaurante | Platos de ejemplo | `restaurante.html` |

El teléfono público figura con 8 dígitos, pero los móviles peruanos tienen 9.
**Hay que confirmar el número completo** antes de publicar: se usa en los
enlaces `tel:` y en el botón de WhatsApp.

## Formularios

No hay backend. Al enviar, el formulario arma un mensaje de WhatsApp con los
datos y lo abre en una pestaña nueva. Si más adelante quiere recibirlos por
correo, reemplace el bloque final de `assets/js/main.js` por un `fetch()` a su
endpoint (Formspree, Vercel Functions, etc.).

## Publicación en GitHub Pages

El repositorio ya está inicializado y con el primer commit hecho. Faltan dos
pasos:

**1. Cree el repositorio en GitHub** (vacío, sin README ni .gitignore) y suba
el código:

```bash
git remote add origin https://github.com/USUARIO/REPO.git
git push -u origin main
```

**2. Active Pages** en el repositorio: *Settings → Pages → Source: Deploy from
a branch → Branch: `main` / carpeta `/ (root)` → Save*.

En un par de minutos queda publicado en `https://USUARIO.github.io/REPO/`.

Para actualizarlo después, basta con:

```bash
git add -A && git commit -m "descripción del cambio" && git push
```

### Notas sobre Pages

- El archivo `.nojekyll` está incluido para que GitHub publique la carpeta tal
  cual, sin procesarla con Jekyll.
- Todas las rutas son relativas, así que el sitio funciona igual en la raíz de
  un dominio que en un subdirectorio (`usuario.github.io/repo/`).
- Si más adelante usa un dominio propio, actualice las etiquetas
  `<link rel="canonical">` de cada página, que hoy apuntan a
  `campamentolaperla.com.pe`.

### Otras opciones

Al ser estático sirve cualquier hosting. Con Vercel:

```bash
npx vercel deploy --prod
```

## Notas técnicas

- Sin dependencias externas salvo Google Fonts y el mapa embebido.
- Responsive a partir de 320 px; menú a pantalla completa en móvil.
- Respeta `prefers-reduced-motion`.
- Etiquetas `<title>`, `description` y Open Graph propias en cada página.

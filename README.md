# 📖 Manga Reader

Lector de manga gratuito construido con **React + Vite + TailwindCSS**, consumiendo
la API pública de [MangaDex](https://api.mangadex.org/docs/). Sin backend: favoritos
e historial de lectura se guardan en `localStorage` del navegador. Instalable como PWA.

## ✨ Funciones

- 🔍 Buscar mangas por título
- 🖼️ Ver portada, autor, tags y descripción
- 📚 Listar y leer capítulos (imágenes servidas directo desde MangaDex)
- 💾 Guardar progreso de lectura automáticamente
- ❤️ Favoritos
- 🌙 Modo oscuro
- 📱 Responsive + instalable como PWA
- ⌨️ Navegación con flechas del teclado en el lector

## 🧱 Stack

- React 18 + Vite
- React Router v6
- TailwindCSS
- Axios
- vite-plugin-pwa

## 🚀 Empezar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## 📦 Build de producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

## 🌐 Publicar en GitHub Pages

### 1. Ajusta el nombre del repositorio

Abre `vite.config.js` y cambia:

```js
const REPO_NAME = 'manga-reader'
```

por el nombre **exacto** de tu repositorio de GitHub (el que aparece en la URL,
`https://github.com/tu-usuario/ESTE-NOMBRE`).

> Si vas a publicar en la raíz de `tu-usuario.github.io` (repo especial de usuario),
> usa `base: '/'` en vez de `/${REPO_NAME}/`.

### 2. Opción A: despliegue con `gh-pages` (rápido)

```bash
npm install
npm run deploy
```

Esto genera el build y lo publica en la rama `gh-pages`. Luego, en GitHub:
**Settings → Pages → Source → Deploy from branch → `gh-pages` / `root`**.

### 3. Opción B: despliegue con GitHub Actions (recomendado)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Luego en GitHub: **Settings → Pages → Source → GitHub Actions**.

## 📁 Estructura del proyecto

```
manga-reader/
│
├── public/
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── components/     Navbar, MangaCard, SearchBar, ChapterList, Reader
│   ├── pages/           Home, Manga, Read, Favorites, History
│   ├── services/        mangadex.js (todas las llamadas a la API)
│   ├── utils/            storage.js (localStorage), reader.js (navegación)
│   ├── styles/           main.css, dark.css, reader.css
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

## ⚠️ Notas sobre la API de MangaDex

- No requiere API key para lectura pública.
- Puede aplicar rate limiting si se hacen demasiadas peticiones muy rápido;
  si ves errores 429, espera unos segundos.
- Las imágenes de los capítulos se sirven desde `uploads.mangadex.org` /
  `*.mangadex.network`, directamente desde el navegador del usuario (sin backend propio).
- Este proyecto respeta el content rating "safe/suggestive" por defecto en las
  búsquedas; puedes ajustarlo en `src/services/mangadex.js`.

## 📄 Licencia

Uso libre para fines educativos y personales. Los datos y contenidos de manga
pertenecen a sus respectivos autores/editoriales vía MangaDex.

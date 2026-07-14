# t3_act8_eq15


Consumo de APIs de Terceros - Login y Sistema con Tabla CRUD



# Sistema Inteligente de Noticias

Dashboard de noticias construido con **React + Vite + Tailwind CSS v4**.

## Integrante

- Santiago Ramirez Erick Omar

## APIs utilizadas

- **Login (Fase 1):** [DummyJSON Auth](https://dummyjson.com/docs/auth) — `POST https://dummyjson.com/auth/login`
- **Tabla de datos (Fase 3):** [DummyJSON Posts](https://dummyjson.com/docs/posts) (`/posts`), usada como fuente de
  "noticias" (título, contenido, categoría/tag, vistas y reacciones). Se eligió esta API porque, igual que
  products/recipes, simula las operaciones de escritura (POST/PUT/DELETE) sin persistir realmente los datos —
  ideal para practicar las llamadas reales que pide la actividad.
- **Traducción:** [MyMemory Translation API](https://mymemory.translated.net) (`api.mymemory.translated.net`),
  gratuita y sin API key. DummyJSON solo devuelve texto en inglés, así que cada título, extracto y categoría
  se traduce al español antes de mostrarse (tanto en la tabla de Noticias como en el Resumen Diario). El slug
  original en inglés se conserva por debajo para que el filtro de categoría siga funcionando contra la API.
  Nota: al ser un servicio gratuito con límite de uso diario, en un uso muy intensivo alguna traducción
  podría tardar un poco o, si se agota la cuota, mostrarse en inglés como respaldo.

## Link al proyecto desplegado


## Cómo correr el proyecto localmente

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto http://localhost:5173).

## Credenciales de prueba

DummyJSON no acepta cualquier usuario/contraseña: usa una cuenta real del catálogo de prueba,
por ejemplo `emilys` / `emilyspass`. Puedes ver más usuarios válidos en
https://dummyjson.com/users (campo `username`, contraseña = `<username>pass`).

## Estructura del proyecto

```
src/
  components/   → piezas de UI reutilizables (Navbar, Sidebar, modales, paginación)
  pages/        → vistas de la app (Login, Resumen Diario, Noticias, Configuración)
  services/     → llamadas a la API, separadas de los componentes
                  (authService, newsService, translateService)
  hooks/        → lógica reutilizable (autenticación, sincronización con la URL)
```

## Notas sobre la Fase 3 (filtros)

La API de DummyJSON no permite combinar búsqueda de texto y filtro de categoría en una sola
petición, así que el orden de prioridad es: **si hay texto de búsqueda, se usa `/posts/search`;
si no, y hay una categoría seleccionada, se usa `/posts/tag/{tag}`; si no hay ningún filtro, se
usa `/posts` normal.** Todas soportan paginación real con `limit` y `skip`.

## Fase 4 (despliegue)


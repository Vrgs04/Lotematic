# Lotemática

PWA local-first para jugar Lotería Mexicana con hasta 20 tablas digitales de 4×4, marcado manual y reconocimiento opcional de nombres por micrófono. Cada casilla representa una figura doble en distribución horizontal, vertical o diagonal.

## Funciones

- Catálogo tipado de las 54 figuras tradicionales, con alias normalizados y placeholders propios.
- Crear, editar, generar, duplicar y eliminar tablas; evita figuras repetidas y exige 16 casillas.
- Respaldo JSON importable/exportable y tres tablas demo voluntarias.
- Partidas con tabla llena, fila, columna, diagonal o cuatro esquinas; detección múltiple de ganadores.
- Selector manual completo, historial, deshacer, prevención de duplicados y marcado simultáneo.
- Adaptador desacoplado `BrowserSpeechRecognitionAdapter`, español de México, reinicio acotado, errores visibles y coincidencia conservadora.
- Medidor Web Audio y calibración orientativa de 14 segundos. No se almacena audio.
- PWA instalable, shell offline, actualización controlada, safe areas y rutas SPA para Cloudflare Pages.

> Capturas: agrega imágenes del producto final en `docs/screenshots/` si se desean incluir en la publicación del repositorio.

## Requisitos e instalación

Node.js 22 LTS (declarado en `.nvmrc` y `package.json`) y npm 10 o posterior.

```bash
nvm use
npm install
npm run dev
```

Vite mostrará la URL local. El micrófono requiere una acción explícita y un contexto seguro (HTTPS o localhost).

## Validación y compilación

```bash
npm run test:run
npm run lint
npm run typecheck
npm run build
npm run preview
```

`npm run test` deja Vitest en modo interactivo. La salida de producción está en `dist/`; `public/_redirects` se copia allí.

## Estructura

- `src/app`, `src/pages`, `src/components`: rutas y UI.
- `src/catalog`: catálogo único de figuras.
- `src/game`: marcado, progreso y patrones ganadores.
- `src/recognition`: normalizador, matcher y adaptador del navegador.
- `src/storage`: base IndexedDB (Dexie), validación y respaldo.
- `src/hooks`, `src/styles`, `src/tests`: audio, diseño y pruebas.

Tablas, ajustes, partida activa e historial de sesiones viven en IndexedDB y nunca se envían a un servidor. La configuración de una tabla queda separada de las fichas de cada sesión.

## Micrófono, privacidad y compatibilidad

Lotemática no graba, guarda ni sube audio. `SpeechRecognition`/`webkitSpeechRecognition` puede enviar voz al proveedor del navegador y puede requerir Internet; no se afirma que funcione localmente. Chrome/Edge Chromium ofrecen la mejor posibilidad de soporte. Firefox y ciertos navegadores iOS pueden no exponer la API. El ruido, las conversaciones y el sistema operativo afectan el resultado; la calibración de volumen no separa fuentes. El modo manual funciona offline y es siempre el respaldo.

Para sustituir el proveedor, implementa `CardRecognitionAdapter` en `src/recognition/BrowserSpeechRecognitionAdapter.ts` y cambia su construcción en `LiveGame.tsx`. El motor de partida solo recibe IDs, por lo que no depende del proveedor.

## Imágenes autorizadas

La interfaz usa placeholders tipográficos. Consulta `public/cards/README.md` y coloca imágenes WebP propias/licenciadas con el slug exacto (por ejemplo `el-gallo.webp`). El catálogo ya incluye `imagePath`, listo para incorporar estas imágenes sin cambiar los datos.

## PWA y modo offline

El service worker precachea el shell después de la primera visita. Cuando hay una versión nueva aparece un aviso para actualizar, evitando bloquear permanentemente versiones. En iOS usa Compartir → Agregar a inicio; en Chromium usa Instalar aplicación. La transcripción de voz puede no estar disponible offline.

## Cloudflare Pages

Conecta este repositorio desde **Workers & Pages → Create → Pages → Connect to Git**:

- Rama de producción: `main`
- Framework preset: Vite
- Build: `npm run build`
- Directorio de salida: `dist`
- Directorio raíz: `/`
- Variable opcional `NODE_VERSION`: `22`

El fallback `/* /index.html 200` permite recargar rutas internas. Despliegue manual alternativo (autentícate con Wrangler cuando lo solicite):

```bash
npm run build
npx wrangler pages deploy dist --project-name=lotematica
```

No se incluyen credenciales ni se ejecuta despliegue automáticamente.

## Publicar en GitHub

Después de crear un repositorio vacío:

```bash
git remote add origin https://github.com/TU_USUARIO/lotematica.git
git add .
git commit -m "feat: build loteria companion PWA"
git branch -M main
git push -u origin main
```

Si `origin` ya existe, omite el primer comando. Revisa `git status` antes de confirmar cambios.

## Problemas comunes

- **No aparece el micrófono:** comprueba HTTPS, permisos del sitio y compatibilidad; usa el selector manual.
- **No reconoce una carta:** acerca el móvil, calibra, reduce ruido y pronuncia solo el nombre.
- **No se instala:** carga por HTTPS, visita dos veces y revisa el menú del navegador.
- **Datos inesperados:** importa un respaldo válido o elimina los datos del sitio desde el navegador.
- **Ruta 404 desplegada:** comprueba que `dist/_redirects` exista y que Cloudflare publique `dist`.

## Desarrollo sin micrófono

En desarrollo, el selector manual permite simular cualquier detección por el mismo motor sin pedir micrófono. Las métricas básicas de latencia aparecen junto a la última carta solo bajo `import.meta.env.DEV`.

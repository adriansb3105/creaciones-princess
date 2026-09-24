# Fase 4 — Carga de recetas en lote (gratis, corre en tu computadora)

Nada de esto toca Vercel/Mongo directamente ni sube nada a un servicio de
pago — todo corre local. El resultado final (texto por receta) se estructura
después con ayuda de Claude Code y se sube a Mongo ya revisado.

## 1. Instalar dependencias (una sola vez)

Necesitás Python 3.10+, `pip` y `ffmpeg` instalados (en Windows, `ffmpeg` se
puede instalar con `winget install ffmpeg` si no lo tenés). Ya en el proyecto:

```bash
python -m pip install -r scripts/recetario/requirements.txt
```

## 2. Sacar los enlaces de un chat de WhatsApp exportado

1. En el grupo de WhatsApp: nombre del grupo → **Exportar chat** → **Sin
   archivos multimedia**.
2. Mándatelo a vos mismo y guarda el `.txt` en tu computadora.
3. Desde `scripts/recetario/`:
   ```bash
   node extraer-links.mjs "ruta/al/chat-exportado.txt"
   ```
   Esto crea `links.txt` (un enlace por línea, sin duplicados, solo de
   YouTube/TikTok/Instagram/Facebook).

## 3. Transcribir localmente

```bash
python transcribir.py --limit 5          # prueba con 5 primero
python transcribir.py                     # el resto, cuando confirmes que anda bien
```

- Se puede cortar con `Ctrl+C` en cualquier momento y volver a correr el
  mismo comando después — los enlaces ya procesados (carpeta `salida/`) se
  saltan solos.
- Si muchos enlaces de Instagram/Facebook fallan por "login required" o
  similar, agregá `--cookies-from-browser chrome` (o `firefox`/`edge`) — usa
  la sesión de esos sitios ya iniciada en tu navegador.
- Al final queda un `reporte.json` con qué salió bien y qué falló (y por
  qué), para reintentar solo esos.
- Con ~200 enlaces, calculá que puede tardar un par de horas sin supervisión
  (más rápido si usás `--model tiny`, con algo menos de precisión).

## 4. Estructurar e importar

Cuando `salida/` tenga los `.json` de todas (o la mayoría de) las recetas,
compartí esa carpeta en una sesión de Claude Code — se estructura cada una
(ingredientes/pasos con evidencia validada, igual que en
`/admin/recetario/importar`) y se inserta en Mongo como "Requiere revisión",
lista para que las repases y publiques desde `/admin/recetario`.

## 5. La próxima vez (nuevas recetas que se compartan en el grupo)

Cuando quieras agregar recetas más adelante, no hace falta buscar a mano
cuáles son nuevas: volvé a exportar el chat completo (paso 2) y corré
`extraer-links.mjs` de nuevo sobre ese archivo. El script compara contra el
`links.txt` que ya existe y:

- deja `links.txt` actualizado con el total completo,
- crea `links-nuevos.txt` con **solo** los enlaces que no estaban antes,
- actualiza `checkpoint.json` con la fecha y el conteo de esa corrida.

Después corré `transcribir.py` normal (sin flags especiales) — como ya se
salta todo lo que tiene archivo en `salida/`, procesa automáticamente nada
más los nuevos, sin importar si le pasás el `links.txt` completo o el
`links-nuevos.txt`.

Si en cambio un enlace nuevo te llega suelto (alguien lo mandó aparte, no en
una exportación), simplemente agregalo como línea nueva al final de
`links.txt` a mano y corré `transcribir.py` — hace lo mismo.

## Notas

- `links.txt`, `links-nuevos.txt`, `checkpoint.json`, `salida/`, `reporte.json`
  y `cookies.txt` quedan fuera de git (`.gitignore`) — son datos tuyos, no
  código del sitio.
- Descargar audio de contenido ajeno con `yt-dlp` está en una zona gris
  respecto a los términos de cada red social; es para uso personal y la
  decisión de usarlo es tuya.

#!/usr/bin/env python3
"""
Transcribe localmente (gratis, sin subir nada a ningún servicio de pago) los
videos listados en links.txt.

Para cada enlace:
  1. Si es YouTube, intenta primero traer subtítulos ya existentes (gratis,
     sin descargar audio).
  2. Si no hay subtítulos, descarga solo el audio con yt-dlp y lo transcribe
     con faster-whisper (100% local, corre en tu CPU).

Reanudable: si un enlace ya tiene su archivo en salida/, se salta — podés
cortar el proceso (Ctrl+C) y volver a correrlo después sin perder lo hecho.

Uso:
  python transcribir.py                              # todos los enlaces de links.txt
  python transcribir.py --limit 5                     # prueba solo con los primeros 5
  python transcribir.py --model small                 # tiny | base | small | medium
  python transcribir.py --lang auto                    # autodetectar idioma en vez de forzar español
  python transcribir.py --cookies-from-browser chrome  # para Instagram/Facebook que piden login
  python transcribir.py --cookies cookies.txt           # alternativa si --cookies-from-browser falla (DPAPI en Windows)
  python transcribir.py --force                        # reprocesa aunque ya exista salida
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
LINKS_FILE = SCRIPT_DIR / 'links.txt'
OUTPUT_DIR = SCRIPT_DIR / 'salida'
REPORT_FILE = SCRIPT_DIR / 'reporte.json'


def url_hash(url):
    return hashlib.sha1(url.encode('utf-8')).hexdigest()[:12]


def detect_platform(url):
    if 'youtube.com' in url or 'youtu.be' in url:
        return 'youtube'
    if 'tiktok.com' in url:
        return 'tiktok'
    if 'instagram.com' in url:
        return 'instagram'
    if 'facebook.com' in url or 'fb.watch' in url:
        return 'facebook'
    return 'desconocida'


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')


def get_title(url, cookies_args):
    result = run(['yt-dlp', '--skip-download', '--print', '%(title)s', *cookies_args, url])
    if result.returncode != 0:
        return None
    return result.stdout.strip().splitlines()[0] if result.stdout.strip() else None


def vtt_to_text(path):
    lines = path.read_text(encoding='utf-8', errors='ignore').splitlines()
    text_lines, seen = [], set()
    for line in lines:
        line = line.strip()
        if not line or line.startswith(('WEBVTT', 'Kind:', 'Language:')) or '-->' in line or line.isdigit():
            continue
        clean = re.sub(r'<[^>]+>', '', line).strip()
        if clean and clean not in seen:
            seen.add(clean)
            text_lines.append(clean)
    return '\n'.join(text_lines)


def try_existing_subtitles(url, workdir, cookies_args):
    """Solo aplica realmente a YouTube. Devuelve texto o None."""
    run([
        'yt-dlp', '--skip-download', '--write-auto-subs', '--write-subs',
        '--sub-langs', 'es,es-419,es-MX,en',
        '--convert-subs', 'vtt',
        '-o', str(workdir / 'sub.%(ext)s'),
        *cookies_args, url,
    ])
    vtt_files = list(workdir.glob('sub*.vtt'))
    return vtt_to_text(vtt_files[0]) if vtt_files else None


def download_audio(url, workdir, cookies_args):
    result = run([
        'yt-dlp', '-f', 'bestaudio/best', '-x', '--audio-format', 'mp3', '--audio-quality', '5',
        '-o', str(workdir / 'audio.%(ext)s'), *cookies_args, url,
    ])
    if result.returncode != 0:
        return None, result.stderr[-1500:]
    audio_files = list(workdir.glob('audio.*'))
    return (audio_files[0] if audio_files else None), None


def transcribe_audio(model, audio_path, language):
    # El filtro de voz (VAD) evita "alucinar" texto durante silencios, pero a
    # veces descarta de más (música, voz de fondo floja). Si con el filtro no
    # sale nada, se reintenta una vez sin filtro antes de decir que no hay voz.
    segments, _info = model.transcribe(str(audio_path), language=language, vad_filter=True)
    text = ' '.join(seg.text.strip() for seg in segments).strip()
    if text:
        return text

    segments, _info = model.transcribe(str(audio_path), language=language, vad_filter=False)
    return ' '.join(seg.text.strip() for seg in segments).strip()


def main():
    parser = argparse.ArgumentParser(description='Transcribe localmente los enlaces de links.txt')
    parser.add_argument('--links', default=str(LINKS_FILE))
    parser.add_argument('--limit', type=int, default=None)
    parser.add_argument('--model', default='small', choices=['tiny', 'base', 'small', 'medium'])
    parser.add_argument('--lang', default='es', help='Código de idioma a forzar (es, en...) o "auto" para autodetectar')
    parser.add_argument('--cookies-from-browser', default=None, help='chrome, firefox, edge... para IG/FB que piden login')
    parser.add_argument('--cookies', default=None, help='ruta a un cookies.txt exportado — usar si --cookies-from-browser falla con error de DPAPI')
    parser.add_argument('--force', action='store_true', help='Reprocesa aunque ya exista salida')
    args = parser.parse_args()

    links_path = Path(args.links)
    if not links_path.exists():
        print(f'No encuentro {links_path}. Corre primero extraer-links.mjs')
        sys.exit(1)

    urls = [line.strip() for line in links_path.read_text(encoding='utf-8').splitlines() if line.strip()]
    if args.limit:
        urls = urls[:args.limit]

    OUTPUT_DIR.mkdir(exist_ok=True)
    if args.cookies:
        cookies_args = ['--cookies', args.cookies]
    elif args.cookies_from_browser:
        cookies_args = ['--cookies-from-browser', args.cookies_from_browser]
    else:
        cookies_args = []
    language = None if args.lang == 'auto' else args.lang

    print(f'Cargando modelo Whisper "{args.model}" (la primera vez descarga el modelo, tarda un poco)...')
    from faster_whisper import WhisperModel
    model = WhisperModel(args.model, device='cpu', compute_type='int8')

    results = {'ok': [], 'omitidos': [], 'errores': []}

    for i, url in enumerate(urls, 1):
        h = url_hash(url)
        out_path = OUTPUT_DIR / f'{h}.json'
        platform = detect_platform(url)
        print(f'\n[{i}/{len(urls)}] ({platform}) {url}')

        if out_path.exists() and not args.force:
            print('  -> ya procesado, se salta (usa --force para reprocesar)')
            results['omitidos'].append(url)
            continue

        with tempfile.TemporaryDirectory(prefix='recetario_') as tmp:
            workdir = Path(tmp)
            try:
                title = get_title(url, cookies_args)

                text, method = None, None
                if platform == 'youtube':
                    text = try_existing_subtitles(url, workdir, cookies_args)
                    if text:
                        method = 'subtitulos'

                if not text:
                    print('  -> descargando audio...')
                    audio_path, err = download_audio(url, workdir, cookies_args)
                    if not audio_path:
                        raise RuntimeError(f'no se pudo descargar el audio: {err}')
                    print('  -> transcribiendo (puede tardar unos minutos)...')
                    text = transcribe_audio(model, audio_path, language)
                    method = 'transcripcion'

                if not text or not text.strip():
                    raise RuntimeError('no se obtuvo texto (audio sin voz reconocible o sin acceso al contenido)')

                data = {
                    'url': url,
                    'platform': platform,
                    'title': title,
                    'method': method,
                    'text': text,
                    'model': args.model if method == 'transcripcion' else None,
                    'generatedAt': datetime.now(timezone.utc).isoformat(),
                }
                out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
                print(f'  -> OK ({method}, {len(text)} caracteres) -> {out_path.name}')
                results['ok'].append(url)
            except Exception as e:
                print(f'  -> ERROR: {e}')
                results['errores'].append({'url': url, 'error': str(e)})

    REPORT_FILE.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'\n\nListo. OK: {len(results["ok"])}  Omitidos: {len(results["omitidos"])}  Errores: {len(results["errores"])}')
    print(f'Reporte completo en {REPORT_FILE}')
    if results['errores']:
        print('\nEnlaces con error (podés reintentarlos con --cookies-from-browser o --cookies cookies.txt):')
        for e in results['errores']:
            print(f'  - {e["url"]}: {e["error"][:150]}')


if __name__ == '__main__':
    main()

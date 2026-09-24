import { describe, it, expect } from 'vitest';
import { detectPlatform, isValidUrl } from '@/lib/recipes/platforms';

describe('detectPlatform', () => {
  it('detecta YouTube (watch, youtu.be, shorts)', () => {
    expect(detectPlatform('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube');
    expect(detectPlatform('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube');
    expect(detectPlatform('https://m.youtube.com/shorts/dQw4w9WgXcQ')).toBe('youtube');
  });

  it('detecta TikTok', () => {
    expect(detectPlatform('https://www.tiktok.com/@scout2015/video/6718335390845095173')).toBe('tiktok');
    expect(detectPlatform('https://vm.tiktok.com/ZMabc123/')).toBe('tiktok');
  });

  it('detecta Instagram', () => {
    expect(detectPlatform('https://www.instagram.com/reel/C6Ovj9CIQjV/')).toBe('instagram');
  });

  it('detecta Facebook', () => {
    expect(detectPlatform('https://www.facebook.com/facebook/posts/10153231379946729')).toBe('facebook');
    expect(detectPlatform('https://fb.watch/abc123/')).toBe('facebook');
  });

  it('devuelve null para plataformas no soportadas o URLs inválidas', () => {
    expect(detectPlatform('https://www.pinterest.com/pin/123')).toBeNull();
    expect(detectPlatform('no-es-una-url')).toBeNull();
    expect(detectPlatform('')).toBeNull();
  });
});

describe('isValidUrl', () => {
  it('acepta http(s) y rechaza el resto', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('ftp://example.com')).toBe(false);
    expect(isValidUrl('hola')).toBe(false);
  });
});

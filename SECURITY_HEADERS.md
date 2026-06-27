# YahyazLab Production Security Headers

This is a static Vite/React website. The app cannot set HTTP response headers by itself after it is built, so these headers should be added in the production host, reverse proxy, Coolify proxy configuration, or Nginx/Caddy layer.

## Recommended Headers

```nginx
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; worker-src 'self' blob:; manifest-src 'self'; form-action 'self' mailto:; upgrade-insecure-requests" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), autoplay=(self), camera=(), clipboard-read=(), clipboard-write=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), xr-spatial-tracking=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
```

## Notes

- The CSP is designed for a static React/Vite build using local scripts, local images, local videos, local fonts, Three.js/WebGL, and the existing `mailto:` contact link.
- `style-src 'unsafe-inline'` is included because browser/runtime style attributes and Vite-generated style handling can require inline style allowance. Remove it only after verifying the deployed site with a stricter CSP.
- If analytics, external fonts, a CDN, or third-party embeds are added later, update `script-src`, `connect-src`, `font-src`, `img-src`, or `frame-src` intentionally instead of using broad wildcards.
- Test both English and Arabic pages after enabling headers in production.

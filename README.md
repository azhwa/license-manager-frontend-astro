# License Manager Frontend

Frontend static berbasis Astro untuk License Manager. UI menggunakan tema dark high-tech sebagai default, dengan toggle light theme, dan icon `iconify-icon`.

## Development

Build toolchain memakai Astro 5 agar kompatibel dengan Node.js 20 yang digunakan backend/VPS.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Atur `.env`:

```env
PUBLIC_API_URL=http://localhost:3000
PUBLIC_TURNSTILE_SITE_KEY=
PUBLIC_SUPPORT_URL=https://lynk.id
```

`PUBLIC_*` adalah konfigurasi yang memang akan masuk ke bundle browser. Jangan menaruh Turso token, JWT secret, atau merchant key di sini.

## Production

```bash
npm ci
npm run build
```

Hasil build ada di `dist/` dan dapat dilayani oleh Nginx, Cloudflare Pages, atau static hosting lain. Backend tetap berjalan melalui PM2 dan Cloudflare Tunnel.

## PM2 di VPS

Setelah build selesai, jalankan static server frontend melalui PM2:

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

Frontend listen di `127.0.0.1:4321`, sehingga dapat diarahkan dari Cloudflare Tunnel:

```yaml
ingress:
  - hostname: app.example.com
    service: http://127.0.0.1:4321
  - service: http_status:404
```

Jika hasil build berubah, jalankan `npm run build && pm2 restart license-manager-frontend`.

Setelah domain frontend tersedia, tambahkan domain tersebut ke `CORS_ORIGIN` backend. Contoh:

```env
CORS_ORIGIN=https://app.example.com
```

Dashboard memakai JWT 8 jam dari endpoint `/admin/login` dan menyimpannya hanya selama tab browser aktif melalui `sessionStorage`.

# license-manager-frontend-astro

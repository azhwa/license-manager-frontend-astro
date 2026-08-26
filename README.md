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

Setelah domain frontend tersedia, tambahkan domain tersebut ke `CORS_ORIGIN` backend. Contoh:

```env
CORS_ORIGIN=https://app.example.com
```

Dashboard memakai JWT 8 jam dari endpoint `/admin/login` dan menyimpannya hanya selama tab browser aktif melalui `sessionStorage`.

# license-manager-frontend-astro

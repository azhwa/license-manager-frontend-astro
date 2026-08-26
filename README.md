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
PUBLIC_SUPPORT_URL=https://wa.me/6281234567890?text=Halo%20saya%20butuh%20bantuan%20license
```

`PUBLIC_SUPPORT_URL` dapat diisi dengan link WhatsApp dalam format internasional tanpa tanda `+`, spasi, atau tanda kurung. Ganti nomor contoh dengan nomor support Anda.

`PUBLIC_*` adalah konfigurasi yang memang akan masuk ke bundle browser. Jangan menaruh Turso token, JWT secret, atau merchant key di sini.

## Production dengan Cloudflare Pages

Frontend ini adalah static Astro site, jadi tidak perlu PM2 atau proses Node.js yang berjalan di VPS. Cloudflare Pages mengambil source dari repository GitHub dan menjalankan build otomatis.

Konfigurasi project Cloudflare Pages:

| Pengaturan | Nilai |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js version | `20` |

Environment variables pada Cloudflare Pages:

```env
PUBLIC_API_URL=https://api.example.com
PUBLIC_TURNSTILE_SITE_KEY=isi_site_key_turnstile
PUBLIC_SUPPORT_URL=https://wa.me/6281234567890?text=Halo%20saya%20butuh%20bantuan%20license
```

`PUBLIC_*` adalah konfigurasi publik yang masuk ke bundle browser. Jangan menaruh Turso token, JWT secret, atau merchant key di sini.

Setelah domain frontend tersedia, tambahkan domain tersebut ke `CORS_ORIGIN` backend. Contoh:

```env
CORS_ORIGIN=https://app.example.com
```

Dashboard memakai JWT 8 jam dari endpoint `/admin/login` dan menyimpannya hanya selama tab browser aktif melalui `sessionStorage`.

# license-manager-frontend-astro

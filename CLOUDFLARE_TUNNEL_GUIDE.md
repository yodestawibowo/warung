# Panduan Cloudflare Tunnel Otomatis WARUNG RIMBUN

- **Domain Publik**: `https://warungrimbun.cloudpme.my.id`
- **Tunnel ID**: `4b630e38-406c-4895-a80e-1fabea7a3b1b`
- **Layanan Internal Docker**: `http://warung-rimbun:80`
- **Port Host Lokal**: `8880`

---

## ⚡ Zero-Setup di CasaOS / Server Anda

Semua konfigurasi file `docker-compose.yml`, `docker-compose.tunnel.yml`, dan `cloudflared/config.yml` telah dipersiapkan secara otomatis.

### Cara Menjalankan Langsung:
```bash
./setup.sh
```

Jika Anda ingin menyertakan Token Tunnel Cloudflare secara langsung:
```bash
./setup.sh --token eyJhIjoi...
```

Atau masukkan token Anda ke file `.env`:
```env
CLOUDFLARE_TUNNEL_ID=4b630e38-406c-4895-a80e-1fabea7a3b1b
CLOUDFLARE_HOSTNAME=warungrimbun.cloudpme.my.id
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi...
```

---

## 🔗 Pemetaan di Dashboard Cloudflare Zero Trust

1. Buka **Cloudflare Zero Trust** > **Networks** > **Tunnels**.
2. Pilih Tunnel Anda: **`4b630e38-406c-4895-a80e-1fabea7a3b1b`**.
3. Di tab **Public Hostname**:
   - **Hostname**: `warungrimbun.cloudpme.my.id`
   - **Service**: `HTTP`
   - **URL**: `warung-rimbun:80`
4. Simpan.

Sekarang aplikasi Anda aktif di **`https://warungrimbun.cloudpme.my.id`** dengan sertifikat SSL gratis, CDN cepat, dan tanpa membutuhkan IP Publik Statis maupun Port Forwarding.

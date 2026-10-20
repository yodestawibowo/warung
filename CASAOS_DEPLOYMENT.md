# Panduan Otomatis Deployment WARUNG RIMBUN di CasaOS + Cloudflare Tunnel

Aplikasi **WARUNG RIMBUN** sudah dikonfigurasi **100% Otomatis (Zero-Setup)** dengan domain publik dan Cloudflare Tunnel:
- **Domain Publik**: `https://warungrimbun.cloudpme.my.id`
- **Cloudflare Tunnel ID**: `4b630e38-406c-4895-a80e-1fabea7a3b1b`
- **Port Lokal CasaOS**: `8880`

---

## 🚀 Cara 1: Menggunakan Fitur "Custom Install" di Dashboard CasaOS (Termudah)

1. Buka dashboard **CasaOS** di browser (contoh: `http://casaos.local` atau `http://<IP-SERVER-ANDA>`).
2. Di pojok kanan atas bagian App Store / Apps, klik ikon **`+`** lalu pilih **"Install a customized app"**.
3. Di pojok kanan atas jendela instalasi, klik tombol **`Import`**.
4. Salin (copy) seluruh isi file `docker-compose.yml` dari proyek ini, lalu tempel (paste) ke dalam dialog CasaOS.
5. Klik **Submit**. CasaOS akan otomatis mengisi seluruh konfigurasi:
   - Nama: **WARUNG RIMBUN (warungrimbun.cloudpme.my.id)**
   - Port Lokal: `8880` -> `80`
   - Cloudflare Tunnel otomatis aktif melayani `warungrimbun.cloudpme.my.id`.
6. Klik **Install**.
7. Aplikasi langsung dapat diakses baik via lokal `http://<IP-CASAOS>:8880` maupun via internet publik di:
   👉 **`https://warungrimbun.cloudpme.my.id`**

---

## 💻 Cara 2: 1-Klik Jalankan via Terminal / SSH CasaOS (Otomatis Penuh)

Cukup masuk ke folder proyek di server CasaOS Anda dan jalankan perintah:

```bash
chmod +x setup.sh && ./setup.sh
```

Script akan otomatis:
1. Memeriksa ketersediaan Docker & Docker Compose di server Anda.
2. Membangun image Docker `warung-rimbun:latest`.
3. Menjalankan container web dan container `warung-rimbun-tunnel` dengan Tunnel ID `4b630e38-406c-4895-a80e-1fabea7a3b1b`.
4. Langsung mengaktifkan routing ke `warungrimbun.cloudpme.my.id`.

### Perintah Manajemen Cepat:
- **Cek Status**: `./setup.sh status`
- **Lihat Log**: `./setup.sh logs`
- **Restart Layanan**: `./setup.sh restart`
- **Hentikan**: `./setup.sh stop`

---

## 🌐 Konfigurasi Cloudflare Zero Trust (Satu Kali di Dashboard Cloudflare)

Jika Anda belum menghubungkan Public Hostname di Cloudflare Zero Trust Dashboard:
1. Buka [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) > **Networks** > **Tunnels**.
2. Pilih Tunnel ID **`4b630e38-406c-4895-a80e-1fabea7a3b1b`** > Klik **Configure**.
3. Masuk ke tab **Public Hostnames** > Klik **Add a public hostname**:
   - **Subdomain**: `warungrimbun`
   - **Domain**: `cloudpme.my.id`
   - **Service Type**: `HTTP`
   - **URL**: `warung-rimbun:80` (karena berada dalam satu network Docker compose) atau `<IP-CASAOS>:8880`
4. Klik **Save Hostname**.

Selesai! Aplikasi Anda aman, terlindungi enkripsi SSL HTTPS gratis dari Cloudflare, dan dapat diakses dari mana saja.

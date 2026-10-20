#!/usr/bin/env bash
# ==============================================================================
# WARUNG RIMBUN - One-Line Auto Installer for CasaOS / Linux Server
# Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan
# Domain Publik : https://warungrimbun.cloudpme.my.id
# Tunnel ID     : 4b630e38-406c-4895-a80e-1fabea7a3b1b
# ==============================================================================

set -e

# Warna Terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "======================================================================"
echo "   WARUNG RIMBUN - 1-LINE AUTO INSTALLER UNTUK CASAOS & DOCKER       "
echo "      Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan           "
echo "   Domain  : https://warungrimbun.cloudpme.my.id                     "
echo "   Tunnel  : 4b630e38-406c-4895-a80e-1fabea7a3b1b                    "
echo "======================================================================"
echo -e "${NC}"

# Tentukan lokasi folder instalasi di CasaOS
if [ -d "/DATA/AppData" ]; then
  INSTALL_DIR="/DATA/AppData/warung-rimbun"
elif [ -d "$HOME" ]; then
  INSTALL_DIR="$HOME/warung-rimbun"
else
  INSTALL_DIR="/var/www/warung-rimbun"
fi

echo -e "${BLUE}▶ Menyiapkan direktori instalasi di: ${YELLOW}${INSTALL_DIR}${NC}"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

BUNDLE_URL="https://ais-pre-2xcids4muvsu2mknck6xbb-741891396295.asia-northeast1.run.app/warung-rimbun-casaos.tar.gz"

echo -e "${BLUE}▶ Mengunduh paket arsip WARUNG RIMBUN (lengkap dengan Cloudflare Tunnel)...${NC}"
if command -v curl &>/dev/null; then
  curl -fL --progress-bar "$BUNDLE_URL" -o warung-rimbun-casaos.tar.gz
elif command -v wget &>/dev/null; then
  wget --show-progress -q "$BUNDLE_URL" -O warung-rimbun-casaos.tar.gz
else
  echo -e "${RED}Error: curl atau wget dibutuhkan untuk mengunduh paket.${NC}"
  exit 1
fi

echo -e "${BLUE}▶ Mengekstrak paket aplikasi...${NC}"
tar -xzf warung-rimbun-casaos.tar.gz

echo -e "${GREEN}✔ Berkas berhasil diekstrak.${NC}"
echo ""

# Pastikan script installer executable
chmod +x setup.sh casaos-install.sh 2>/dev/null || true

# Jalankan installer otomatis
echo -e "${BLUE}▶ Menjalankan instalasi Docker Compose...${NC}"
./setup.sh auto

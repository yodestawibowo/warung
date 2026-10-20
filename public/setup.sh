#!/usr/bin/env bash
# ==============================================================================
# WARUNG RIMBUN - Otomatisasi Instalasi & Manajemen CasaOS / Docker
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DEFAULT_PORT=8880
DEFAULT_TUNNEL_ID="4b630e38-406c-4895-a80e-1fabea7a3b1b"
DEFAULT_HOSTNAME="warungrimbun.cloudpme.my.id"

print_header() {
  clear 2>/dev/null || true
  echo -e "${CYAN}${BOLD}"
  echo "======================================================================"
  echo "   WARUNG RIMBUN - INSTALLER & PENGATURAN CASAOS / DOCKER TERMINAL   "
  echo "      Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan           "
  echo "======================================================================"
  echo -e "${NC}"
}

check_dependencies() {
  echo -e "${BLUE}▶ Memeriksa dependensi sistem...${NC}"
  
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}✘ Docker belum terpasang di sistem ini.${NC}"
    echo -e "Silakan pasang Docker terlebih dahulu dengan perintah:"
    echo -e "${YELLOW}  curl -fsSL https://get.docker.com | sh${NC}"
    exit 1
  fi
  echo -e "${GREEN}✔ Docker terdeteksi: $(docker --version | head -n 1)${NC}"

  if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
  elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
  else
    echo -e "${RED}✘ Docker Compose belum terpasang.${NC}"
    echo -e "Pasang docker compose plugin atau gunakan perintah:"
    echo -e "${YELLOW}  sudo apt-get install docker-compose-plugin${NC}"
    exit 1
  fi
  echo -e "${GREEN}✔ Docker Compose terdeteksi: $($COMPOSE_CMD version | head -n 1)${NC}"
  echo ""
}

get_local_ip() {
  LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
  if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
  fi
  echo "$LOCAL_IP"
}

action_install() {
  print_header
  check_dependencies

  USER_PORT=${PORT:-$DEFAULT_PORT}

  echo -e "${BLUE}▶ Membangun kontainer WARUNG RIMBUN (instan menggunakan pre-built assets)...${NC}"
  $COMPOSE_CMD -f docker-compose.yml up -d --build

  SERVER_IP=$(get_local_ip)

  echo ""
  echo -e "${GREEN}${BOLD}======================================================================"
  echo "   SELAMAT! WARUNG RIMBUN BERHASIL DIAKTIFKAN DI CASAOS!             "
  echo "======================================================================${NC}"
  echo ""
  echo -e "Aplikasi Lokal CasaOS:"
  echo -e "  👉 ${CYAN}${BOLD}http://${SERVER_IP}:${USER_PORT}${NC}"
  echo -e "  👉 ${CYAN}${BOLD}http://localhost:${USER_PORT}${NC}"
  echo ""
  echo -e "Domain Cloudflare Tunnel:"
  echo -e "  🌐 ${GREEN}${BOLD}https://${DEFAULT_HOSTNAME}${NC}"
  echo ""
  echo -e "Perintah Cepat:"
  echo -e "  • Cek status : ${YELLOW}./setup.sh status${NC}"
  echo -e "  • Lihat log  : ${YELLOW}./setup.sh logs${NC}"
  echo -e "  • Restart    : ${YELLOW}./setup.sh restart${NC}"
  echo -e "  • Stop       : ${YELLOW}./setup.sh stop${NC}"
  echo "======================================================================"
}

action_status() {
  print_header
  check_dependencies
  echo -e "${BLUE}▶ Status Layanan WARUNG RIMBUN:${NC}"
  $COMPOSE_CMD -f docker-compose.yml ps
  echo ""
  SERVER_IP=$(get_local_ip)
  echo -e "Alamat Lokal : ${CYAN}http://${SERVER_IP}:${DEFAULT_PORT}${NC}"
}

action_logs() {
  check_dependencies
  echo -e "${BLUE}▶ Menampilkan live log container...${NC}"
  $COMPOSE_CMD -f docker-compose.yml logs -f --tail=100
}

action_stop() {
  check_dependencies
  echo -e "${YELLOW}▶ Menghentikan container...${NC}"
  $COMPOSE_CMD -f docker-compose.yml down
  echo -e "${GREEN}✔ Container berhasil dihentikan.${NC}"
}

action_start() {
  check_dependencies
  echo -e "${BLUE}▶ Menjalankan container...${NC}"
  $COMPOSE_CMD -f docker-compose.yml up -d
  echo -e "${GREEN}✔ Container aktif.${NC}"
}

action_restart() {
  check_dependencies
  echo -e "${BLUE}▶ Me-restart container...${NC}"
  $COMPOSE_CMD -f docker-compose.yml restart
  echo -e "${GREEN}✔ Layanan berhasil di-restart.${NC}"
}

case "$1" in
  status)
    action_status
    ;;
  logs)
    action_logs
    ;;
  stop)
    action_stop
    ;;
  start)
    action_start
    ;;
  restart)
    action_restart
    ;;
  auto|install|setup|"")
    action_install
    ;;
  *)
    echo -e "${RED}Perintah tidak dikenal: $1${NC}"
    echo "Penggunaan: ./setup.sh [install|start|stop|restart|status|logs]"
    exit 1
    ;;
esac

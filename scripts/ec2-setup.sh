#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# EC2 First-Time Setup Script — Selections.pk
# Run once on a fresh Ubuntu 22.04 / 24.04 EC2 instance:
#   chmod +x ec2-setup.sh && sudo ./ec2-setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"   # <-- change this
APP_DIR="/home/ubuntu/selections-pk"

echo "══════════════════════════════════════════"
echo "  Selections.pk — EC2 Setup"
echo "══════════════════════════════════════════"

# ── 1. System packages ────────────────────────────────────────────────────────
apt-get update -y
apt-get install -y git curl ca-certificates gnupg ufw

# ── 2. Docker Engine ──────────────────────────────────────────────────────────
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io \
                   docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker

# Allow ubuntu user to run Docker without sudo
usermod -aG docker ubuntu

# ── 3. Firewall ───────────────────────────────────────────────────────────────
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS (for future SSL)
echo "Firewall configured."

# ── 4. Clone the repository ───────────────────────────────────────────────────
if [ ! -d "$APP_DIR" ]; then
    git clone "$REPO_URL" "$APP_DIR"
    chown -R ubuntu:ubuntu "$APP_DIR"
fi

# ── 5. Create .env file ───────────────────────────────────────────────────────
if [ ! -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    echo ""
    echo "⚠  .env file created from .env.example"
    echo "   Edit it NOW before starting the app:"
    echo "   nano $APP_DIR/.env"
    echo ""
fi

echo "══════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Edit the .env file:"
echo "     nano $APP_DIR/.env"
echo ""
echo "  2. Start the application:"
echo "     cd $APP_DIR"
echo "     docker compose up -d"
echo ""
echo "  3. Create Django superuser:"
echo "     docker compose exec backend python manage.py createsuperuser"
echo "══════════════════════════════════════════"

# ==============================================================================
# WARUNG RIMBUN - High-Performance Fast Dockerfile
# Optimized for CasaOS, Docker, and Resource-Constrained Environments
# ==============================================================================

FROM nginx:1.27-alpine

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration with SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-compiled production distribution
COPY dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

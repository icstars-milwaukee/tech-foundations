# =====================================================================
# T10B: Dockerfile for the CohortHub Events Service
# =====================================================================
# A Dockerfile is a recipe for building an IMAGE. Each line is one step.
#
#   docker build -t cohorthub-events:1.0.0 ./app
# =====================================================================

# Start FROM an official Node.js image. Pin the version.
# Never use "latest": it changes under you, so the same Dockerfile
# could build a different image next month.
FROM node:24-alpine

# The folder inside the container where the next steps happen.
WORKDIR /app

# COPY package.json in first, then the rest of the app.
# (.dockerignore keeps .env, node_modules, and .git out.)
COPY package.json ./
COPY . .

# EXPOSE documents the port. It doesn't publish it. -p does that.
ENV PORT=8080
EXPOSE 8080

# Switch to the non-root user that Node images include.
# If someone breaks into the app, they shouldn't get root.
USER node

# Calls /health every 30 seconds so `docker ps` shows (healthy) or (unhealthy).
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# What runs when a container starts. JSON array form, so node receives
# SIGTERM from `docker stop` directly and can shut down cleanly.
CMD ["node", "server.js"]

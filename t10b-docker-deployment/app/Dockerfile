# =====================================================================
# T10B: Dockerfile for the CohortHub Events Service
# =====================================================================
# A Dockerfile is a recipe for building an IMAGE. Each line is one step.
#
#   docker build -t cohorthub-events:1.0.0 ./app
# =====================================================================

# 1: Official Node.js image, pinned. Never "latest": it changes under you.
FROM node:24-alpine

# 2: The folder inside the container where the app lives
WORKDIR /app

# 3: package.json first, then the rest of the app.
#    (.dockerignore keeps .env, node_modules, and .git out.)
COPY package.json ./
COPY . .

# 4: The port the app listens on. EXPOSE documents it; -p publishes it.
ENV PORT=8080
EXPOSE 8080

# 5: Run as the non-root user Node images include
USER node

# 6: Docker calls /health every 30s so `docker ps` shows (healthy)/(unhealthy)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# 7: What runs when the container starts
CMD ["node", "server.js"]

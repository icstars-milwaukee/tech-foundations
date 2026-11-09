# =====================================================================
# T10B: Dockerfile for the CohortHub Events Service
# =====================================================================
# A Dockerfile is a recipe for building an IMAGE. Each line is one step.
# Build it with your trainer, step by step. Replace each TODO with one
# real instruction. Keep the comments; they explain WHY each step exists.
#
#   docker build -t cohorthub-events:1.0.0 ./app
# =====================================================================

# TODO 1: Start FROM an official Node.js image. Pin the version.
#         Never use "latest": it changes under you, so the same Dockerfile
#         could build a different image next month.
FROM node:24-alpine
# TODO 2: Set the WORKDIR (the folder inside the container) to /app
WORKDIR /app
# TODO 3: COPY package.json in first, then COPY the rest of the app.
#         (.dockerignore keeps .env, node_modules, and .git out.)
COPY package.json ./
COPY . .
# TODO 4: Set ENV PORT=8080 and EXPOSE 8080
#         (EXPOSE documents the port. It doesn't publish it. -p does that.)
ENV PORT=8080
EXPOSE 8080

# TODO 5: Switch to the non-root user that Node images include: USER node
#         If someone breaks into the app, they shouldn't get root.
USER node
# TODO 6 (Advanced): add a HEALTHCHECK that calls /health every 30 seconds
#         so `docker ps` shows (healthy) or (unhealthy).
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
# TODO 7: CMD to start the app. Use the JSON array form: ["node", "server.js"]
CMD ["node", "server.js"]
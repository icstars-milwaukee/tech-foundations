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

# TODO 2: Set the WORKDIR (the folder inside the container) to /app

# TODO 3: COPY package.json in first, then COPY the rest of the app.
#         (.dockerignore keeps .env, node_modules, and .git out.)

# TODO 4: Set ENV PORT=8080 and EXPOSE 8080
#         (EXPOSE documents the port. It doesn't publish it. -p does that.)

# TODO 5: Switch to the non-root user that Node images include: USER node
#         If someone breaks into the app, they shouldn't get root.

# TODO 6 (Advanced): add a HEALTHCHECK that calls /health every 30 seconds
#         so `docker ps` shows (healthy) or (unhealthy).

# TODO 7: CMD to start the app. Use the JSON array form: ["node", "server.js"]

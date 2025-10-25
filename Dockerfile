# Multi-stage Dockerfile for a Vite + React app
# 1) Build the app with Node
# 2) Serve the production build with nginx

FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies (copy package files first for better caching)
COPY package.json package-lock.json* ./

# Install all deps (including devDependencies needed for build)
RUN npm install --prefer-offline --no-audit --progress=false

# Copy source and build
COPY . .
RUN npm run build

# --------------
# Production image
# --------------
FROM nginx:stable-alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (container listens on 80)
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

# Start with a base image for installing dependencies
FROM node:20-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

# Only copy package files to leverage Docker cache
COPY package.json pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

# Set up the builder stage for compiling the app
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy over the installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm build

# Setup the production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files for running the app
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

# Switch to non-root user for security
USER nextjs

# Set up the runtime environment
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "frontend/server.js"]

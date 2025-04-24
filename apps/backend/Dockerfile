# Start with dependencies installation
FROM node:20-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

# Only copy package files for better caching
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile

# Set up the builder stage
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Bring in the dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and build the app
RUN pnpm --filter backend prisma generate
RUN pnpm build

# Setup the production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

# Copy only the necessary files
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/node_modules/@prisma/client ./node_modules/@prisma/client

# Configure the runtime
EXPOSE 5000
ENV PORT 5000

# Launch the application
CMD ["node", "dist/index.js"]

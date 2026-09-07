# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Generate Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:24-alpine AS runtime

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy generated Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Run the application (as non-root for security)
USER node
CMD ["npm", "start"]

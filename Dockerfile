# Dockerfile

# ---- Base Stage ----
# Use an official Node.js LTS image. Choose one based on your Node version.
# Using Alpine Linux variants is smaller but sometimes has compatibility issues with native dependencies. Start with the standard debian-based one.
FROM node:22 AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# Use --omit=dev if you have many devDependencies not needed for runtime,
# but be careful not to omit something needed by TypeORM or your app runtime.
# Often safer to install all initially, then prune later.
# RUN npm install --omit=dev --only=production
RUN npm install

# ---- Build Stage ----
# Copy all source code
COPY . .

# Build TypeScript to JavaScript
# This assumes your build script outputs to a 'dist' folder (default for NestJS)
RUN npm run build

# ---- Production Stage ----
# Start from a clean Node.js image again (smaller final image)
FROM node:22-slim AS production

# Set working directory
WORKDIR /usr/src/app

# Set NODE_ENV to production (important for NestJS performance and TypeORM settings)
ENV NODE_ENV=production
# Set the default port (Render will often override this with its own PORT env var)
ENV PORT=3000

# Copy only necessary files from the build stage
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
# Copy package.json for runtime information if needed (optional)
# COPY --from=base /usr/src/app/package.json ./package.json

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application (using the compiled JS)
CMD ["node", "dist/main.js"]
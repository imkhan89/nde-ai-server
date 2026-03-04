# Use lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better Docker caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# Set production environment
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]

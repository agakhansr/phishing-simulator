FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy application source
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]

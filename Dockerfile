# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]

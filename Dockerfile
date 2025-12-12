FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install dependencies
RUN cd backend && npm install --production

# Copy frontend files
COPY frontend ./frontend

# Copy data files
COPY data ./data

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/server.js"]

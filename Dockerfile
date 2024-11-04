# Use Node.js base image
FROM node:20-slim

# Install Python and required packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Create Python virtual environment and install yt-dlp
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install yt-dlp

# Expose the port your app runs on
EXPOSE 3000

# Start command
CMD ["npm", "start"]
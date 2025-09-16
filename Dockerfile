# Use the latest LTS version of Node.js
FROM node:18-alpine

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache and install dependencies with platform-specific modules
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install --no-optional && \
    npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
# Codigo/backend/Dockerfile
FROM node:jod-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
# (This will be overwritten by the volume mount in dev,
# but it's good practice for building the image)
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# The command to run your application in development mode
CMD ["npm", "run", "dev"]
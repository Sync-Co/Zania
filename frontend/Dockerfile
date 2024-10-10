# frontend/Dockerfile
FROM --platform=linux/amd64 node:16-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port used by the React app (default is 3000)
EXPOSE 3000

# Start the app using npm start
CMD ["npm", "start"]
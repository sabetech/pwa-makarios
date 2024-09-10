# Use a node base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire React app to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Serve the app using a production-ready server (serve is just an example, you can use any other server)
RUN npm install -g serve

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

# Expose the specified port
EXPOSE 80

# Command to run the app when the container starts
CMD ["serve", "-s", "build"]
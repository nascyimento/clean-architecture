# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# The app binds to port 3000, so expose it
EXPOSE 3000

# Command to run the application
CMD [ "npm", "test" ]
